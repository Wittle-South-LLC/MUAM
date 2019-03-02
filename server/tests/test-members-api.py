# pylint: disable-msg=C0103,W0603
# Note about pylint disables - pylint thinks my globals are constants,
# and they're not, so disabling C0103. It also doesn't like globals,
# which I don't care much about because I want to use them here in my
# tests.
"""test-users-api.py - Tests of users APIs"""
import logging
from .TestUtil import get_response_with_jwt, get_new_session,\
                      log_response_error

# Global vars so we don't havae to look up a group and user more than once
group_id = -1
user_id = -1

# Ensure we can run tests against an authenticated session where needed
TEST_SESSION = get_new_session()

# Set up logger
LOGGER = logging.getLogger()

def setUp():
    """Need a logged in session for this API, as well as a user and group ID"""
    # Authenticate a user for the TEST_SESSION
    test_user = {
        'username': 'gadmin',
        'password': 'gadmin00'
    }
    resp = get_response_with_jwt(TEST_SESSION, 'POST', '/login', test_user)
    assert resp.status_code == 200
    # Look up the user ID for one of the users created by our test script
    group_data = get_response_with_jwt(TEST_SESSION, 'GET', '/groups?gid=101')
    assert resp.status_code == 200
    global group_id
    group_id = group_data.json()[0]['group_id']
    # Look up the normal user, which we will use for this test
    user_data = get_response_with_jwt(TEST_SESSION, 'GET', '/users?search_text=normal')
    assert resp.status_code == 200
    global user_id
    user_id = user_data.json()[0]['user_id']

def test_create_membership():
    """MembersAPIs: Test add membership"""
    member_data = {
        'group_id': group_id,
        'user_id': user_id,
        'is_admin': False,
        'is_owner': False
    }
    resp = get_response_with_jwt(TEST_SESSION, 'POST', '/members', member_data)
    assert resp.status_code == 201

def test_update_memmbership():
    """--> Test update membership API"""
    update_data = {
        'is_admin': True,
        'is_owner': False
    }
    api_url = '/members/{}/{}'.format(group_id, user_id)
    resp = get_response_with_jwt(TEST_SESSION, 'PUT', api_url, update_data)
    assert resp.status_code == 200
    resp2 = get_response_with_jwt(TEST_SESSION,'GET', '/groups/' + group_id)
    assert resp2.status_code == 200
    resp2_users = resp2.json()['users']
    LOGGER.debug('resp2_users = ' + str(resp2_users))
    assert (resp2_users[0]['user_id'] == user_id and resp2_users[0]['is_admin']) or\
           (resp2_users[1]['user_id'] == user_id and resp2_users[1]['is_admin']) or\
           (resp2_users[2]['user_id'] == user_id and resp2_users[1]['is_admin'])

def test_delete_membership():
    """--> Test delete membership API"""
    api_url = '/members/{}/{}'.format(group_id, user_id)
    resp = get_response_with_jwt(TEST_SESSION, 'DELETE', api_url)
    assert resp.status_code == 204
