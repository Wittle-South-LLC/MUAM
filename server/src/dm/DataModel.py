# DataModel.py - Single source for the entire data model
import logging
import os
import sys
from sqlalchemy import create_engine, event, exc, select
from sqlalchemy.orm import sessionmaker
from dm.smoacks.base import Base
from dm.Group import Group #pylint: disable=W0611
from dm.Membership import Membership #pylint: disable=W0611
from dm.User import User #pylint: disable=W0611

LOGGER = logging.getLogger('appLogger')

# Confirm that required environment variables are present
for req_var in ['APP_DB_NAME', 'APP_DB_ACCOUNT', 'APP_DB_PASSWORD']:
    if req_var not in os.environ:
        sys.exit('Required environment variable {} not present'.format(req_var))

# Pull key environment variables, use defaults if needed
MY_NETWORK = os.environ['MY_NETWORK'] if 'MY_NETWORK' in os.environ else 'kubernetes'
MY_HOSTVAR = 'APP_DB_CNAME' if MY_NETWORK == 'kubernetes' else 'APP_DB_SNAME'
MY_PORTVAR = 'APP_DB_CPORT' if MY_NETWORK == 'kubernetes' else 'APP_DB_SPORT'
DB_HOST = os.environ[MY_HOSTVAR] if MY_HOSTVAR in os.environ else 'localhost'
DB_PORT = os.environ[MY_PORTVAR] if MY_PORTVAR in os.environ else '3306'
DB_NAME = os.environ['APP_DB_NAME']
DB_USER = os.environ['APP_DB_ACCOUNT']
DB_PWD = os.environ['APP_DB_PASSWORD']

# Assemble the connection string from component parts
connect_string = "mysql+mysqldb://{}:{}@{}:{}/{}?charset=utf8mb4&binary_prefix=True".format(\
                 DB_USER, DB_PWD, DB_HOST, DB_PORT, DB_NAME)
LOGGER.info('Using database named {} on host {} on port {}'.format(DB_NAME, DB_HOST, DB_PORT))
LOGGER.debug('Connect string: {}'.format(connect_string))
# Create database connection and sessionmaker
try:
    ENGINE = create_engine(connect_string, pool_recycle=3600)
except exc.SQLAlchemyError: # pragma: no cover
    LOGGER.error('Caught exception in create_engine: ' + str(exc.SQLAlchemyError))
try:
    DBSESSION = sessionmaker(bind=ENGINE)
except exc.SQLAlchemyError: # pragma: no cover
    LOGGER.error('Caught an exception in sessionmaker: ' + str(exc.SQLAlchemyError))
LOGGER.debug('We have created a sessionmaker')

# Check to see if the schema exists, if not create it
try:
    LOGGER.debug('Let us check if there is a User table...')
    if not ENGINE.dialect.has_table(ENGINE, 'Group'):
        LOGGER.info('No schema, so need to create_all')
        Base.metadata.create_all(ENGINE)
except exc.SQLAlchemyError: # pragma: no cover
    LOGGER.error('Caught an exception in schema setup: ' + str(exc.SQLAlchemyError))
LOGGER.debug('We have created or found a Group table')

def get_session():
    return DBSESSION()

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