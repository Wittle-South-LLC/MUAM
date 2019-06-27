#pylint: disable=W0603,C0103,C0121
"""test-pw_reset-api.py - Tests of password reset APIs"""
import datetime
import os.path
import logging
import logging.config
import yaml
from sqlalchemy import create_engine, exc
from sqlalchemy.orm import sessionmaker
from src.dm.DataModel import get_session
from src.dm.User import User                     #pylint: disable=W0611
from src.dm.Membership import Membership         #pylint: disable=W0611
from src.dm.Group import Group                   #pylint: disable=W0611
from muam.User import User as mUser
from smoacks.api_util import call_api, login
from .TestUtil import get_new_session, log_response_error, mock_login

# Try loading logging configuration, see if we can manage it directly
with open('src/server_logging.yaml', 'r') as f:
    config = yaml.safe_load(f.read())
    logging.config.dictConfig(config)

# Set up logger
LOGGER = logging.getLogger()

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
LOGGER.info('Network is {} with host var {} and port var {}'.format(MY_NETWORK, MY_HOSTVAR, MY_PORTVAR))
LOGGER.info('Using database named {} on host {} on port {}'.format(DB_NAME, DB_HOST, DB_PORT))
LOGGER.debug('Connect string: {}'.format(connect_string))

# We need a setup session to login in so we have privilege to delete
# the user as part of cleanup. We need a separate test session that
# does not have an access_token or refresh_token to test the lost
# password reset use case
SETUP_SESSION = login('admin', 'testing0')
TEST_SESSION = get_new_session()

# Need to save the user ID so we can delete it when done
added_user = None

def setUp():
    """Set up for tests by creating a new user"""
    global added_user
    added_user = mUser(**{
        'username': "talw",
        'password': "testing0$",
        'email': "tal@wittle.net",
        'first_name': "Tal",
        'last_name': "Lewin Wittle",
        'phone': '+1 (919) 475-3337'
    })
    success, resp = added_user.save_new(SETUP_SESSION)
    assert success

def tearDown():
    """Clean up from tests by deleting the user for this test"""
    global added_user
    success, resp = added_user.save_delete(SETUP_SESSION)
    assert success

def test_reset_invalid_email():
    """PasswordResetAPIs: Test reset API failure due to invalid email"""
    resp = call_api(None, 'POST', '/us/pw_reset', {'email': 'john.doe@nowhere.org'})
    log_response_error(resp, True)
    assert resp.status_code == 404

def test_reset_fails_email():
    """--> Test that reset fails due to email difference"""
    resp = call_api(None, 'POST', '/us/pw_reset', {'email': 'liora@wittle.net'})
    log_response_error(resp, True)
    assert resp.status_code == 400 or resp.status_code == 404

def test_reset_start_valid():
    """--> Test getting a reset code that should work"""
    resp = call_api(TEST_SESSION, 'POST', '/us/pw_reset', {'email': 'tal@wittle.net'}, True)
    log_response_error(resp, True)
    assert resp.status_code == 200
    LOGGER.debug('refresh_token = ' + str(TEST_SESSION['session'].cookies))
    assert 'refresh_token_cookie' in TEST_SESSION['session'].cookies
    assert 'csrf_refresh_token' in TEST_SESSION['session'].cookies

def test_reset_finish_email_mismatch():
    """--> Test reset finish fail due to email mismatch"""
    session = get_session()
    user = session.query(User).filter(User.email == 'tal@wittle.net').one_or_none()
    assert user is not None
    reset_json = {
        'email': 'junk@wittle.net',
        'password': 'reset111',
        'reset_code': user.reset_code
    }
    resp = call_api(TEST_SESSION, 'PUT', '/us/pw_reset', reset_json, True)
    log_response_error(resp, True)
    assert resp.status_code == 400

def test_rest_start_fails_existing_code():
    """--> Test getting a second reset code when existing one has not expired fails"""
    resp = call_api(TEST_SESSION, 'POST', '/us/pw_reset', {'email': 'tal@wittle.net'}, True)
    log_response_error(resp, True)
    assert resp.status_code == 400

def test_refresh_finish_expired_code():
    """--> Test reset API failure due to expired code"""
    # Look up the user in the database and set the reset_expires to now
    session = get_session()
    user = session.query(User).filter(User.email == 'tal@wittle.net').one_or_none()
    assert user
    user.reset_expires = datetime.datetime.now() - datetime.timedelta(days=5)
    session.add(user)
    session.commit()
    reset_json = {
        'email': 'reset@wittle.net',
        'password': 'reset111',
        'reset_code': user.reset_code
    }
    session.close()
    resp = call_api(TEST_SESSION, 'PUT', '/us/pw_reset', reset_json, True)
    log_response_error(resp, True)
    assert resp.status_code == 400

def test_reset_finish_valid():
    """--> Test reset API success"""
    # Look up reset code and reset expires to the future
    # (We set it to the past in the last test)
    session = get_session()
    user = session.query(User).filter(User.email == 'tal@wittle.net').one_or_none()
    assert user
    LOGGER.debug('1: user.reset_expires = ' + str(user.reset_expires))
    # The below minutes value is a hack because while I set the time zone for the
    # server to America/New York, it is still off by 4 hours from MacOS
    # This should not result in a real issue, because in normal use casese all
    # reading / updating of the reset_expires value will be in the server time zone
    user.reset_expires = datetime.datetime.now() + datetime.timedelta(days=5)
    LOGGER.debug('2: user.reset_expires = ' + str(user.reset_expires))
    session.add(user)
    session.commit()
    reset_json = {
        'email': 'tal@wittle.net',
        'password': 'reset111',
        'reset_code': user.reset_code
    }
    session.close()
    # Add optional fourth parameter to ensure we send the CSRF refresh token
    resp = call_api(TEST_SESSION, 'PUT', '/us/pw_reset', reset_json, True)
    log_response_error(resp)
    assert resp.status_code == 200
    session = get_session()
    new_password_user = session.query(User).filter(User.email == 'tal@wittle.net').one_or_none()
    assert new_password_user.reset_code == None
    assert new_password_user.reset_expires == None
    assert new_password_user.verify_password('reset111')
