# pylint: disable-msg=C0103,W0603
# Note about pylint disables - pylint thinks my globals are constants,
# and they're not, so disabling C0103. It also doesn't like globals,
# which I don't care much about because I want to use them here in my
# tests.
"""test-login-api.py - Tests of login APIs"""
import logging
import jwt
from .TestUtil import get_response_with_jwt, get_new_session,\
                      log_response_error

# Set up logger
LOGGER = logging.getLogger()

# Have a variable to retain the ID of records added via the API
added_user_id = -1

# Ensure we can run tests against a session where needed
TEST_SESSION = get_new_session()
SETUP_SESSION = get_new_session()

def setUp():
    """Set up for tests by creating a new user"""
    global added_user_id
    new_user_json = {
        'username': "eric",
        'password': "testing0$",
        'email': "eric@wittle.net",
        'first_name': "Eric",
        'last_name': "Wittle",
        'phone': '+1 (919) 475-3336'
    }
    resp = get_response_with_jwt(None, 'POST', '/users', new_user_json)
    log_response_error(resp)
    assert resp.status_code == 201
    # Save the user ID so we can delete it later
    json = resp.json()
    assert json['user_id']
    added_user_id = json['user_id']

def tearDown():
    """Clean up from tests by deleting the user for this test"""
    global added_user_id
    # Log in with this user with SETUP_SESSION so we have authentication
    # to delete later
    login_json = {
        'username': 'testing',
        'password': 'testing0'
    }
    resp = get_response_with_jwt(SETUP_SESSION, 'POST', '/login', login_json)
    log_response_error(resp)
    assert resp.status_code == 200
    resp = get_response_with_jwt(SETUP_SESSION, 'DELETE', '/users/' + added_user_id)
    log_response_error(resp)
    assert resp.status_code == 204

def test_login_fail_jwt():
    """LoginAPIs: Test login returns 401 for invalid username/password"""
    bad_login = {'username': 'badboy', 'password': 'loginfail0'}
    resp = get_response_with_jwt(TEST_SESSION, 'POST', '/login', bad_login)
    log_response_error(resp)
    assert resp.status_code == 401

def test_login_fail_required_fields():
    """--> Test missing required fields"""
    bad_login = {'junk': 'junky'}
    resp = get_response_with_jwt(TEST_SESSION, 'POST', '/login', bad_login)
    log_response_error(resp)
    assert resp.status_code == 400

def test_initial_login_jwt():
    """--> Test initial user login with JWT"""
    login_data = {
        'username': 'testing',
        'password': 'testing0'
    }
    resp = get_response_with_jwt(TEST_SESSION, 'POST', '/login', login_data)
    log_response_error(resp, True)
    assert resp.status_code == 200
    assert 'csrf_access_token' in resp.cookies
    assert 'access_token_cookie' in TEST_SESSION['session'].cookies
    assert 'refresh_token_cookie' in TEST_SESSION['session'].cookies
    claims = jwt.decode(TEST_SESSION['session'].cookies['access_token_cookie'], verify=False)
    LOGGER.debug('claims = ' + str(claims))
    assert 'user_claims' in claims
    assert 'user_id' in claims['user_claims']

def test_hydrate():
    """--> Test that we get groups for hydrate API (/login with GET)"""
    resp = get_response_with_jwt(TEST_SESSION, 'GET', '/login', None, True)
    log_response_error(resp, True)
    assert resp.status_code == 200
    json = resp.json()
    assert len(json) == 3
    assert json['Groups'][0]['name'] == 'TestGroup' or\
           json['Groups'][1]['name'] == 'TestGroup'
    assert len(json['Memberships']) == 5

def test_shutdown_bad_key():
    """--> Test shutdown with bad key for code coverage"""
    resp = get_response_with_jwt(None, 'POST', '/shutdown', {'key': 'Junk'})
    assert resp.status_code == 400

def test_logout():
    """--> Test logging out of session"""
    resp = get_response_with_jwt(TEST_SESSION, 'POST', '/logout', {}, True)
    log_response_error(resp)
    LOGGER.debug('TEST_SESSION.cookies = ' + str(TEST_SESSION['session'].cookies))
    assert resp.status_code == 200
    assert 'csrf_access_token' not in TEST_SESSION['session'].cookies
    assert 'access_token_cookie' not in TEST_SESSION['session'].cookies
    assert 'refresh_token_cookie' not in TEST_SESSION['session'].cookies
