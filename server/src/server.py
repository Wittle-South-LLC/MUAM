# pylint: disable=R1703
# Note: disabling the pylint whine about how I'm setting DEBUG_APP
"""Server.py - Creates API server"""
import datetime
import uuid
import os.path
import logging
import logging.config
import yaml
import connexion
from connexion.resolver import RestyResolver
from flask_jwt_extended import JWTManager, create_access_token, set_access_cookies
from flask import request, g, abort
from sqlalchemy import create_engine, event, exc, select
from sqlalchemy.orm import sessionmaker
from dm.base import Base
# The lines below have pylint unused import (W0611) disabled because
# pylint doesn't understand that the entire data model must be available
# if we need to create it; the server creates the data model if it does
# not already exist in the database.
from dm.Group import Group                   #pylint: disable=W0611
from dm.User import User                     #pylint: disable=W0611
from dm.UserGroup import UserGroup           #pylint: disable=W0611

# Try loading logging configuration, see if we can manage it directly
with open('/app/server/src/server_logging.yaml', 'r') as f:
    config = yaml.safe_load(f.read())
    logging.config.dictConfig(config)

# Define constants
API_REQUIRES_JSON = 'All PUT/POST API requests require JSON, and this request did not'
OTHER_PRECHECK_401 = 'Other 401 response'

# Get the spec file from the environment variable
OPENAPI_SPEC = os.environ['OPENAPI_SPEC']

# Set up Connexion for debugging based on FLASK_DEBUG environment variable
if 'FLASK_DEBUG' in os.environ and int(os.environ['FLASK_DEBUG']) >= 1:
    DEBUG_APP = True   #pragma: no cover
else:
    DEBUG_APP = False

# Create the connextion-based Flask app, and tell it where to look for API specs
APP = connexion.FlaskApp(__name__, specification_dir='spec/', debug=DEBUG_APP)
FAPP = APP.app
if DEBUG_APP:
    FAPP.debug = True
else:
    FAPP.debug = False

# JWT implementation
JWT = JWTManager(FAPP)

# Add our specific API spec, and tell it to use the Resty resolver to find the
# specific python module to handle the API call by navigating the source tree
# according to the API structure. All API modules are in the "api" directory
APP.add_api(OPENAPI_SPEC, resolver=RestyResolver('api'))

# Set a reference to the app and request loggers created in app_logging.yaml
LOGGER = logging.getLogger('appLogger')
REQUEST_LOGGER = logging.getLogger('requestLogger')

# Log the API spec we're using
LOGGER.info('API Specification: ' + OPENAPI_SPEC)
if 'NODE_ENV' in os.environ:
    LOGGER.info('Node ENV: ' + os.environ['NODE_ENV'])

# Get the database connect string from the environment
if 'APP_DB_SERVER' in os.environ:
    APP_DB_SERVER = os.environ['APP_DB_SERVER']
else:
    APP_DB_SERVER = 'mysql'
CONNECT_STRING = "mysql+mysqldb://" + str(os.environ['APP_DB_ACCOUNT']) +\
                 ":" + str(os.environ['APP_DB_PASSWORD']) +\
                 "@" + APP_DB_SERVER + "/" + str(os.environ['APP_DB_NAME']) +\
                 "?charset=utf8mb4&binary_prefix=True"
LOGGER.debug('Connect String = ' + CONNECT_STRING)
APPSERVER_PORT = os.environ['APPSERVER_CONTAINER_PORT']
LOGGER.info('Running on port: ' + APPSERVER_PORT)
LOGGER.debug('DebugSetting: ' + str(DEBUG_APP))

# Get the secret key from the environment
FAPP.config['SECRET_KEY'] = os.environ['SECRET_KEY']

# Set JWT configuration options
# Configure application to store JWTs in cookies
FAPP.config['JWT_TOKEN_LOCATION'] = ['cookies']
# Only allow JWT cookies to be sent over https. In production, this
# should likely be True
if 'NODE_ENV' in os.environ and os.environ['NODE_ENV'] == 'production':
    FAPP.config['JWT_COOKIE_SECURE'] = True
else:
    FAPP.config['JWT_COOKIE_SECURE'] = False
# Set the cookie paths, so that you are only sending your access token
# cookie to the access endpoints, and only sending your refresh token
# to the refresh endpoint. Technically this is optional, but it is in
# your best interest to not send additional cookies in the request if
# they aren't needed.
FAPP.config['JWT_ACCESS_COOKIE_PATH'] = '/'
FAPP.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(minutes=30)
# Adding domain so that CORS works
if 'NODE_ENV' in os.environ and os.environ['NODE_ENV'] == 'development':
    FAPP.config['JWT_COOKIE_DOMAIN'] = '.wittlesouth.local'
    LOGGER.info('Setting JWT_COOKIE_DOMAIN to: %s', FAPP.config['JWT_COOKIE_DOMAIN'])
FAPP.config['JWT_REFRESH_COOKIE_PATH'] = os.environ['REACT_APP_API_PATH']
FAPP.config['JWT_REFRESH_TOKEN_EXPIRES'] = datetime.timedelta(days=30)
FAPP.config['JWT_SESSION_COOKIE'] = False
# Enable csrf double submit protection. See this for a thorough
# explination: http://www.redotheweb.com/2015/11/09/api-security.html
FAPP.config['JWT_COOKIE_CSRF_PROTECT'] = True
# Ensure that CSRF protection covers GET operations as well as those
# that describe state change; flask_jwt_extended defaults to only covering
# state change operations
FAPP.config['JWT_CSRF_METHODS'] = ['POST', 'PUT', 'PATCH', 'DELETE', 'GET']

# Create database connection and sessionmaker
try:
    ENGINE = create_engine(CONNECT_STRING, pool_recycle=3600)
except exc.SQLAlchemyError: # pragma: no cover
    LOGGER.error('Caught exception in create_engine: ' + str(exc.SQLAlchemyError))
try:
    DBSESSION = sessionmaker(bind=ENGINE)
except exc.SQLAlchemyError: # pragma: no cover
    LOGGER.error('Caught an exception in sessionmaker: ' + str(exc.SQLAlchemyError))
LOGGER.debug('We have created a session')
try:
    LOGGER.debug('Let us check if there is a User table...')
    if not ENGINE.dialect.has_table(ENGINE, 'User'):
        LOGGER.info('No schema, so need to create_all')
        Base.metadata.create_all(ENGINE)
except exc.SQLAlchemyError: # pragma: no cover
    LOGGER.error('Caught an exception in schema setup: ' + str(exc.SQLAlchemyError))
LOGGER.debug('We have created or found a User table')

@JWT.user_claims_loader
def add_claims_to_access_token(identity):
    user = g.db_session.query(User)\
                       .filter(User.user_id == uuid.UUID(identity).bytes)\
                       .one_or_none()
    if not user:
        return None
    return {
        'user_id': identity,
        'groups': user.get_groups()
    }

# This method ensures that we have a user object both in global and
# in the current_user proxy from flask-jwt-extended
@JWT.user_loader_callback_loader
def user_loader_callback(identity):
    """Callback to load user object for requests where jwt_identity is required"""
    g.user = g.db_session.query(User)\
                         .filter(User.user_id == uuid.UUID(identity).bytes)\
                         .one_or_none()
    if not g.user:
        return None #pragma: no cover
    return g.user

# Need to make sure that the use of the database session is
# scoped to the request to avoid open orm transactions between requests
@FAPP.before_request
def before_request():
    """Method to do work before the request"""
    # Ensure there is a database session available for the request
    g.db_session = DBSESSION()

    # Log request details (see comments in app_logging.yaml for details)
    REQUEST_LOGGER.warning('Starting request for path %s', request.url)
    REQUEST_LOGGER.debug('--> Headers: %s', request.headers)
    REQUEST_LOGGER.warning('--> Request Body: %s', request.get_data())
    REQUEST_LOGGER.info('--> Request Cookies: %s', str(request.cookies))

    # Confirm that any POST or PUT includes JSON (except logout)
    if (request.method == 'POST' or request.method == 'PUT') and \
        not request.is_json and request.path != '/shutdown':
        if request.path != '/fb_login':
            abort(400, API_REQUIRES_JSON)
        else:
            abort(401, OTHER_PRECHECK_401) #pragma: no cover

@FAPP.after_request
def after_request(resp):
    """Method to do work after the request"""
    # Ensure that swagger UI can be served; omitting this results in server side errors
    # when the api UI url is used
    resp.direct_passthrough = False
    # Work around CORS issue with create_react_app since proxy is currently broken
    # TODO: Remove when proxy in create_react_app is fixed. Note that the next
    #       four lines are specific to enviornments where CORS is required.
    if 'NODE_ENV' in os.environ and os.environ['NODE_ENV'] == 'development':
        resp.headers['Access-Control-Allow-Origin'] = 'http://eric.wittlesouth.local:3000'
        resp.headers['Access-Control-Allow-Methods'] = "GET,HEAD,OPTIONS,POST,PUT"
        resp.headers['Access-Control-Allow-Credentials'] = "true" 
        resp.headers['Access-Control-Allow-Headers'] = "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Allow-Methods, Accept, X-Requested-With, Content-Type, Set-Cookie, Access-Control-Request-Method, Access-Control-Request-Headers, X-CSRF-TOKEN"
    # Log request headers & body if FLASK_DEBUG > 1
    if 'FLASK_DEBUG' in os.environ and int(os.environ['FLASK_DEBUG']) >= 2:
        LOGGER.debug('Response Headers: %s', resp.headers)
        LOGGER.debug('Response Body: %s', resp.get_data())

    # If we have a valid response, create a new access_token to
    # reset the 15 minute clock
    if (resp.status_code) < 400 and 'user' in g and\
       not request.path in ['/api/v1/logout', '/api/v1/shutdown']:
        access_token = create_access_token(identity=g.user.get_uuid())
        set_access_cookies(resp, access_token, int(datetime.timedelta(minutes=30).total_seconds()))
    g.db_session.close()
    return resp

# Need to recover if the sql server has closed the connection
# due to a timeout or other reason
@event.listens_for(ENGINE, "engine_connect")
def ping_connection(connection, branch): # pragma: no cover
    """Method to check if database connection is active """
    if branch:
        return

    save_should_close_with_result = connection.should_close_with_result
    connection.should_close_with_result = False

    try:
        connection.scalar(select([1]))
    except exc.DBAPIError as err:
        if err.connection_invalidated:
            LOGGER.info("Recovering from connection_invalidated")
            connection.scalar(select([1]))
        else:
            raise
    finally:
        connection.should_close_with_result = save_should_close_with_result

# Start the app
if 'NODE_ENV' in os.environ and os.environ['NODE_ENV'] == 'production':
    LOGGER.info('We are running in production.')
else:
    LOGGER.info('Starting non-production server')
    APP.run(host='0.0.0.0', port=int(APPSERVER_PORT))
