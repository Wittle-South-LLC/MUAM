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
added_withgroups_id = -1
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
        'username': "testuser",
        'password': "testing1",
        'email': "testuser@wittle.net",
        'first_name': 'Test',
        'last_name': 'User',
        'full_name': 'Test User',
        'phone': '9997776666'
    }
    resp = get_response_with_jwt(None, 'POST', '/users', user_json)
    log_response_error(resp)
    assert resp.status_code == 201
    json = resp.json()
    assert json['user_id']
    added_id = json['user_id']

def test_user_add_with_groups_success():
    """--> Test add API success for a user with groups"""
    #pylint: disable=W0603
    global testing_group_id, added_withgroups_id
    # Look up the user ID of the group admin user (created in testme script)
    resp = get_response_with_jwt(TEST_SESSION, 'GET', '/groups?gid=100')
    assert resp.status_code == 200
    json = resp.json()
    testing_group_id = json[0]['group_id']
    user_json = {
        'username': "test2user",
        'password': "testing2",
        'email': "testuser2@wittlesouth.com",
        'first_name': 'Test',
        'last_name': 'User 2',
        'full_name': 'Test User 2',
        'phone': '9998887777',
        'groups': [
            {
                'group_id': testing_group_id,
                'is_admin': False,
                'is_owner': False
            }
        ]
    }
    resp = get_response_with_jwt(None, 'POST', '/users', user_json)
    log_response_error(resp)
    assert resp.status_code == 201
    json = resp.json()
    assert json['user_id']
    added_withgroups_id = json['user_id']

def test_self_update():
    """--> Update the same user that is authenticated"""
    # Use a new session
    my_session = get_new_session()
    # Login in with talw
    login_data = {'username': 'test2user', 'password': 'testing2'}
    resp1 = get_response_with_jwt(my_session, 'POST', '/login', login_data)
    log_response_error(resp1)
    assert resp1.status_code == 200
    assert 'csrf_access_token' in resp1.cookies
    update_data = {
        "username": "test2user",
        "password": "testing2",
        "full_name": "Test K. User 2",
        "newPassword": "testing3"
    }
    resp2 = get_response_with_jwt(my_session, 'PUT', '/users/' + added_withgroups_id, update_data)
    assert resp2.status_code == 200
    log_response_error(resp2)
    resp3 = get_response_with_jwt(my_session, 'GET', '/users/' + added_withgroups_id)
    log_response_error(resp3)
    json3 = resp3.json()
    LOGGER.debug('json3 = {}'.format(str(json3)))
    assert json3['full_name'] == 'Test K. User 2'
    assert json3['groups'][0]['group_id'] == testing_group_id

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
    resp = get_response_with_jwt(TEST_SESSION, 'GET', '/users?search_text=testuser')
    log_response_error(resp)
    assert resp.status_code == 200
    LOGGER.debug('Response text = %s', resp.text)
    json = resp.json()
    LOGGER.debug('Response json = %s', str(json))
    assert len(json) == 1
    assert json[0]['username'] in ['testuser', 'testing']

def test_delete_user():
    """--> Test deleting a user"""
    resp = get_response_with_jwt(TEST_SESSION, 'DELETE', '/users/' + added_id)
    log_response_error(resp)
    assert resp.status_code == 204
    resp = get_response_with_jwt(TEST_SESSION, 'DELETE', '/users/' + added_withgroups_id)
    log_response_error(resp)
    assert resp.status_code == 204



