"""test-user-api-ext.py - Extended tests of User APIs"""
import logging
from smoacks.api_util import call_api, login
from muam.User import User
from .TestUtil import log_response_error

LOGGER = logging.getLogger()
TEST_SESSION = login('admin', 'testing0')
user_session = None
member_user = None
added_obj = None

def setUp():
    global added_obj, member_user, user_session
    added_obj = User()
    added_obj.first_name = 'firstname'
    added_obj.last_name = 'lastname'
    added_obj.username = 'testuser'
    added_obj.email = 'testuser@wittle.net'
    added_obj.password = 'testing0'
    success, resp = added_obj.save_new(TEST_SESSION)
    assert success
    assert added_obj.user_id
    user_session = login('testuser', 'testing0')
    assert user_session
    member_user = User()
    member_user.first_name = 'firstname2'
    member_user.last_name = 'lastname2'
    member_user.username = 'testuser2'
    member_user.email = 'testuser2@wittle.net'
    member_user.password = 'testing0'
    success, resp = member_user.save_new(TEST_SESSION)
    assert success
    assert member_user.user_id

def tearDown():
    global added_obj, member_user
    success, resp = added_obj.save_delete(TEST_SESSION)
    if not success: log_response_error(resp)
    assert success
    success, resp = member_user.save_delete(TEST_SESSION)
    if not success: log_response_error(resp)
    assert success

def test_update_no_authority():
    """--> Update a user fails if user does not have create_users"""
    global member_user, user_session
    member_user.name = 'Edited'
    success, resp = member_user.save_update(user_session)
    assert not success
    assert resp.status_code == 401

def test_delete_no_authority():
    """--> Update a user fails if user does not have create_users"""
    global member_user, user_session
    success, resp = member_user.save_delete(user_session)
    assert not success
    assert resp.status_code == 401
