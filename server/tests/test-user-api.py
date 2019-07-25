# pylint: disable-msg=C0103,W0603
# Note about pylint disables - pylint thinks my globals are constants,
# and they're not, so disabling C0103. It also doesn't like globals,
# which I don't care much about because I want to use them here in my
# tests.
"""test-user-api.py - Tests of User APIs"""
import logging
from smoacks.api_util import call_api, login
from muam.User import User
from .TestUtil import log_response_error, default_group_ids

LOGGER = logging.getLogger()
TEST_SESSION = login('admin', 'testing0')
added_obj = None

def test_user_create():
    """UserAPIs: Test create API"""
    #pylint: disable=W0603
    global added_obj
    test_obj = User()
    test_obj.username = 'testing'
    test_obj.email = 'testing@wittlesouth.com'
    test_obj.password = 'MyPassword.ResetMe'
    test_obj.first_name = 'Tester'
    test_obj.full_name = 'Tester, Unit X'
    test_obj.last_name = 'Unit'
    test_obj.phone = '+1 (919) 999-9999'
    test_obj.profiles = {"muam": {"test": "value"}}
    test_obj.create_users = False
    test_obj.create_groups = True
    test_obj.grant_privs = False
    
    success, resp = test_obj.save_new(TEST_SESSION)
    if not success: log_response_error(resp)
    assert success
    added_obj = test_obj

def test_user_get():
    """--> get returns details """
    global added_obj
    assert added_obj
    
    success, resp = User.get(TEST_SESSION, added_obj.user_id)
    if not success: log_response_error(resp)
    assert success
    assert resp.username == 'testing'
    assert resp.email == 'testing@wittlesouth.com'
    assert resp.first_name == 'Tester'
    assert resp.full_name == 'Tester, Unit X'
    assert resp.last_name == 'Unit'
    assert resp.phone == '+1 (919) 999-9999'
    assert resp.profiles == {"muam": {"test": "value"}}
    assert resp.create_users == False
    assert resp.create_groups == True
    assert resp.grant_privs == False
    
def test_user_search():
    """--> tests search """
    
    success, resp_list = User.search(TEST_SESSION, '')
    if not success: log_response_error(resp_list)
    assert success
    LOGGER.debug('search result: {}'.format(str(resp_list)))
    assert len(resp_list) == 1
    resp = resp_list[0]
    assert resp.username == 'testing'
    assert resp.email == 'testing@wittlesouth.com'
    assert resp.first_name == 'Tester'
    assert resp.full_name == 'Tester, Unit X'
    assert resp.last_name == 'Unit'
    assert resp.phone == '+1 (919) 999-9999'
    assert resp.profiles == {"muam": {"test": "value"}}
    assert resp.create_users == False
    assert resp.create_groups == True
    assert resp.grant_privs == False
    

def test_user_put():
    """--> put updates object """
    global added_obj
    
    # Change a value
    added_obj.first_name = 'Tester - edited'
    # Save the change a value
    success, resp = added_obj.save_update(TEST_SESSION)
    if not success: log_response_error(resp)
    assert success
    # Read the object again
    success, resp = User.get(TEST_SESSION, added_obj.user_id)
    if not success: log_response_error(resp)
    assert success
    # Confirm the values we read match what we wrote
    assert resp.first_name == added_obj.first_name

def test_user_delete():
    """--> delete returns 204"""
    success, resp = added_obj.save_delete(TEST_SESSION)
    if not success: log_response_error(resp)
    assert success