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
from dm.DataModel import get_session
from dm.User import User                     #pylint: disable=W0611

# Try loading logging configuration, see if we can manage it directly
with open(os.environ['APP_LOGGING_CONFIG'], 'r') as f:
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

APPSERVER_PORT = os.environ['APPSERVER_CPORT']
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
    FAPP.config['JWT_COOKIE_DOMAIN'] = os.environ['COOKIE_DOMAIN']
    LOGGER.info('Setting JWT_COOKIE_DOMAIN to: %s', FAPP.config['JWT_COOKIE_DOMAIN'])
LOGGER.info('Setting JWT_REFRESH_COOKE_PATH to %s', os.environ['REACT_APP_API_PATH'])
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
    g.db_session = get_session()

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
        resp.headers['Access-Control-Allow-Origin'] = os.environ['ACCESS_CONTROL_ORIGIN']
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
       not request.path in ['/api/v1/us/logout', '/api/v1/us/shutdown']:
        access_token = create_access_token(identity=g.user.get_uuid())
        set_access_cookies(resp, access_token, int(datetime.timedelta(minutes=30).total_seconds()))
    g.db_session.close()
    return resp

# Start the app
if 'NODE_ENV' in os.environ and os.environ['NODE_ENV'] == 'production':
    LOGGER.info('We are running in production.')
else:
    LOGGER.info('Starting non-production server')
    APP.run(host='0.0.0.0', port=int(APPSERVER_PORT))
