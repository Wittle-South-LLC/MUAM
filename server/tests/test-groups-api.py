# pylint: disable-msg=C0103,W0603
"""test-users-api.py - Tests of users APIs"""
import logging
from .TestUtil import get_response_with_jwt, get_new_session,\
                      log_response_error

# Set up logger
LOGGER = logging.getLogger()

# Have a variable to retain the ID of records added via the API
added_id = -1

# Ensure we can run tests against a session where needed
TEST_SESSION = get_new_session()
MEMBER_SESSION = get_new_session()


def setUp():
    """Need a logged in session for this API"""
    test_user = {
        'username': 'testing',
        'password': 'testing0'
    }
    resp = get_response_with_jwt(TEST_SESSION, 'POST', '/login', test_user)
    assert resp.status_code == 200
    assert 'access_token_cookie' in TEST_SESSION['session'].cookies
    member_user = {'username': 'normal', 'password': 'normal00'}
    resp = get_response_with_jwt(MEMBER_SESSION, 'POST', '/login', member_user)
    assert resp.status_code == 200

def test_group_add_no_json():
    """GroupAPIs: Test add API failure due to no json"""
    resp = get_response_with_jwt(None, 'POST', '/groups')
    assert resp.status_code == 400

def test_group_add_no_username():
    """--> Test add API failure due to json with missing group name"""
    add_json = {'gid': 100}
    resp = get_response_with_jwt(None, 'POST', '/groups', add_json)
    assert resp.status_code == 400

def test_group_add_no_authority():
    """--> Test add API failure due to user having insufficient privileges"""
    add_json = {'gid': 100, 'name': 'failme'}
    resp = get_response_with_jwt(MEMBER_SESSION, 'POST', '/groups', add_json)
    assert resp.status_code == 401

def test_group_add_api_success():
    """--> Test add API success"""
    #pylint: disable=W0603
    global added_id
    add_json = {
        'name': "unittestgroup",
        'description': 'Group for unit testing',
        'gid': 300
    }
    resp = get_response_with_jwt(TEST_SESSION, 'POST', '/groups', add_json)
    log_response_error(resp)
    assert resp.status_code == 201
    json = resp.json()
    assert json['group_id']
    added_id = json['group_id']

def test_update():
    """--> Update a group"""
    update_data = {
        "name": "unit_test_group"
    }
    resp2 = get_response_with_jwt(TEST_SESSION, 'PUT', '/groups/' + added_id, update_data)
    assert resp2.status_code == 200
    log_response_error(resp2)
    resp3 = get_response_with_jwt(TEST_SESSION, 'GET', '/groups/' + added_id)
    log_response_error(resp3)
    assert resp3.json()['name'] == 'unit_test_group'

def test_update_no_authority():
    """--> Update a group fails if user is not admin for the group"""
    update_data = {
        "name": "unit_test_group2"
    }
    resp2 = get_response_with_jwt(MEMBER_SESSION, 'PUT', '/groups/' + added_id, update_data)
    assert resp2.status_code == 401

def test_list():
    """--> Test list groups"""
    resp = get_response_with_jwt(TEST_SESSION, 'GET', '/groups?search_text=')
    log_response_error(resp)
    assert resp.status_code == 200
    LOGGER.debug('Response text = %s', resp.text)
    json = resp.json()
    LOGGER.debug('Response json = %s', str(json))
    assert len(json) > 1

def test_list_with_text():
    """--> Test list groups with query text"""
    resp = get_response_with_jwt(TEST_SESSION, 'GET', '/groups?search_text=unit')
    log_response_error(resp)
    assert resp.status_code == 200
    LOGGER.debug('Response text = %s', resp.text)
    json = resp.json()
    LOGGER.debug('Response json = %s', str(json))
    assert len(json) == 1
    assert json[0]['name'] == 'unit_test_group'

def test_list_with_gid():
    """--> Test list groups with query gid"""
    resp = get_response_with_jwt(TEST_SESSION, 'GET', '/groups?gid=300')
    log_response_error(resp)
    assert resp.status_code == 200
    LOGGER.debug('Response text = %s', resp.text)
    json = resp.json()
    assert len(json) == 1
    assert json[0]['name'] == 'unit_test_group'

def test_delete_no_authority():
    """--> Test deleting a group fails if user is not owner"""
    resp = get_response_with_jwt(MEMBER_SESSION, 'DELETE', '/groups/' + added_id)
    log_response_error(resp)
    assert resp.status_code == 401

def test_delete():
    """--> Test deleting a group"""
    resp = get_response_with_jwt(TEST_SESSION, 'DELETE', '/groups/' + added_id)
    log_response_error(resp)
    assert resp.status_code == 204
