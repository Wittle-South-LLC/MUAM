# pylint: disable-msg=C0103,W0603
# Note about pylint disables - pylint thinks my globals are constants,
# and they're not, so disabling C0103. It also doesn't like globals,
# which I don't care much about because I want to use them here in my
# tests.
"""test-membership-api.py - Tests of Membership APIs"""
import logging
from smoacks.api_util import call_api, login
from muam.Membership import Membership
from muam.Group import Group

from muam.User import User

from .TestUtil import log_response_error, default_group_ids

LOGGER = logging.getLogger()
TEST_SESSION = login('admin', 'testing0')
added_obj = None
added_group = None
added_user = None

def setUp():
    
    global added_group
    added_group = Group(**{'description': 'This is a really long description of a group', 'gid': 104, 'name': 'app-users'})
    success, resp = added_group.save_new(TEST_SESSION)
    if not success: log_response_error(resp)
    assert success
    
    global added_user
    added_user = User(**{'username': 'testing','password': 'Testing', 'email': 'testing@wittlesouth.com', 'first_name': 'Tester', 'full_name': 'Tester, Unit X', 'last_name': 'Unit', 'phone': '+1 (919) 999-9999', 'create_users': False, 'create_groups': True, 'grant_privs': False})
    success, resp = added_user.save_new(TEST_SESSION)
    if not success: log_response_error(resp)
    assert success
    

def tearDown():
    
    global added_group
    success, resp = added_group.save_delete(TEST_SESSION)
    assert success 
    global added_user
    success, resp = added_user.save_delete(TEST_SESSION)
    assert success 

def test_membership_create():
    """MembershipAPIs: Test create API"""
    #pylint: disable=W0603
    global added_obj
    test_obj = Membership()
    test_obj.is_owner = False
    test_obj.is_admin = False
    test_obj.group_id = added_group.group_id
    test_obj.user_id = added_user.user_id
    success, resp = test_obj.save_new(TEST_SESSION)
    if not success: log_response_error(resp)
    assert success
    added_obj = test_obj

def test_membership_get():
    """--> get returns details """
    global added_obj
    assert added_obj
    global added_group
    global added_user
    
    success, resp = Membership.get(TEST_SESSION, [added_obj.group_id, added_obj.user_id])
    if not success: log_response_error(resp)
    else:
        LOGGER.debug('member.is_owner = {}, .is_admin = {}'.format(resp.is_owner, resp.is_admin))
    assert success
    assert resp.is_owner == False
    assert resp.is_admin == False
    


def test_membership_put():
    """--> put updates object """
    global added_obj
    global added_group
    global added_user
    
    # Change a value
    
    # Save the change a value
    success, resp = added_obj.save_update(TEST_SESSION)
    if not success: log_response_error(resp)
    assert success
    # Read the object again
    success, resp = Membership.get(TEST_SESSION, [added_obj.group_id, added_obj.user_id])
    if not success: log_response_error(resp)
    assert success
    # Confirm the values we read match what we wrote
    None

def test_membership_delete():
    """--> delete returns 204"""
    success, resp = added_obj.save_delete(TEST_SESSION)
    if not success: log_response_error(resp)
    assert success