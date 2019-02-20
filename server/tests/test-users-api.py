# pylint: disable-msg=C0103,W0603
# Note about pylint disables - pylint thinks my globals are constants,
# and they're not, so disabling C0103. It also doesn't like globals,
# which I don't care much about because I want to use them here in my
# tests.
"""test-users-api.py - Tests of users APIs"""
import logging
from .TestUtil import get_response_with_jwt, get_new_session,\
                      log_response_error
import jwt

# Set up logger
LOGGER = logging.getLogger()

# Have a variable to retain the ID of records added via the API
added_id = -1
testing_id = -1

# Ensure we can run tests against a session where needed
TEST_SESSION = get_new_session()

def setUp():
    """Need a logged in session for this API"""
    test_user = {
        'username': 'testing',
        'password': 'testing0'
    }
    resp = get_response_with_jwt(TEST_SESSION, 'POST', '/login', test_user)
    assert resp.status_code == 200
    global testing_id
    assert 'access_token_cookie' in TEST_SESSION['session'].cookies
    token = jwt.decode(TEST_SESSION['session'].cookies['access_token_cookie'], verify=False)
    testing_id = token['identity']

def test_user_add_no_json():
    """UserAPIs: Test add API failure due to no json"""
    resp = get_response_with_jwt(None, 'POST', '/users')
    assert resp.status_code == 400

def test_user_add_no_username():
    """--> Test add API failure due to json with missing username"""
    user_json = {'first_name': 'Junk'}
    resp = get_response_with_jwt(None, 'POST', '/users', user_json)
    assert resp.status_code == 400

def test_user_add_duplicate_user():
    """--> Test add API fails when a user already exists"""
    user_json = {
        'username': "testing",
        'password': "testing1",
        'email': "test@wittle.net",
        'first_name': 'Test',
        'last_name': 'User',
        'full_name': 'Test X User',
        'phone': '9999999999'
    }
    resp = get_response_with_jwt(None, 'POST', '/users', user_json)
    log_response_error(resp)
    assert resp.status_code == 400

def test_user_add_duplicate_key():
    """--> Test add API fails when email or phone number is already in use"""
    user_json = {
        'username': "johndoe",
        'password': "testing1",
        'email': "test@wittle.net",
        'first_name': 'John',
        'last_name': 'Doe',
        'full_name': 'John X. Doe',
        'phone': '9194753999'
    }
    resp = get_response_with_jwt(None, 'POST', '/users', user_json)
    log_response_error(resp)
    assert resp.status_code == 400

def test_user_add_api_success():
    """--> Test add API success"""
    #pylint: disable=W0603
    global added_id
    user_json = {
        'username': "ilana",
        'password': "testing1",
        'email': "ilana@wittle.net",
        'first_name': 'Ilana',
        'last_name': 'Wittle',
        'full_name': 'Ilana Karen Wittle',
        'phone': '9195372096'
    }
    resp = get_response_with_jwt(None, 'POST', '/users', user_json)
    log_response_error(resp)
    assert resp.status_code == 201
    json = resp.json()
    assert json['user_id']
    added_id = json['user_id']

def test_self_update():
    """--> Update the same user that is authenticated"""
    # Use a new session
    my_session = get_new_session()
    # Login in with talw
    login_data = {'username': 'ilana', 'password': 'testing1'}
    resp1 = get_response_with_jwt(my_session, 'POST', '/login', login_data)
    log_response_error(resp1)
    assert resp1.status_code == 200
    assert 'csrf_access_token' in resp1.cookies
    update_data = {
        "username": "ilana",
        "password": "testing1",
        "full_name": "Ilana K. Wittle",
        "newPassword": "testing3"
    }
    resp2 = get_response_with_jwt(my_session, 'PUT', '/users/' + added_id, update_data)
    assert resp2.status_code == 200
    log_response_error(resp2)
    resp3 = get_response_with_jwt(my_session, 'GET', '/users/' + added_id)
    log_response_error(resp3)
    assert resp3.json()['full_name'] == 'Ilana K. Wittle'

def test_user_list():
    """--> Test list users"""
    resp = get_response_with_jwt(TEST_SESSION, 'GET', '/users?search_text=')
    log_response_error(resp)
    assert resp.status_code == 200
    LOGGER.debug('Response text = %s', resp.text)
    json = resp.json()
    LOGGER.debug('Response json = %s', str(json))
    assert len(json) > 3

def test_user_list_with_query():
    """--> Test list users with query"""
    resp = get_response_with_jwt(TEST_SESSION, 'GET', '/users?search_text=ilana')
    log_response_error(resp)
    assert resp.status_code == 200
    LOGGER.debug('Response text = %s', resp.text)
    json = resp.json()
    LOGGER.debug('Response json = %s', str(json))
    assert len(json) == 1
    assert json[0]['username'] in ['ilana', 'testing']

def test_delete_user():
    """--> Test deleting a user"""
    resp = get_response_with_jwt(TEST_SESSION, 'DELETE', '/users/' + added_id)
    log_response_error(resp)
    assert resp.status_code == 204



