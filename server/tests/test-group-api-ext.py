"""test-group-api-ext.py - Extended tests of Group APIs"""
import logging
from smoacks.api_util import call_api, login
from muam.Group import Group
from .TestUtil import log_response_error

LOGGER = logging.getLogger()
TEST_SESSION = login('admin', 'testing0')
MEMBER_SESSION = login('member', 'member00')
added_obj = None

def setUp():
    global added_obj
    added_obj = Group()
    added_obj.name = 'unittestgroup'
    added_obj.description = 'Description of unit test group'
    added_obj.gid = 909
    success, resp = added_obj.save_new(TEST_SESSION)
    assert success
    assert added_obj.group_id

def tearDown():
    global added_obj
    success, resp = added_obj.save_delete(TEST_SESSION)
    if not success: log_response_error(resp)
    assert success

def test_group_add_no_json():
    """GroupAPIs Extended: Test add API failure due to no json"""
    resp = call_api(TEST_SESSION, 'POST', '/groups')
    log_response_error(resp, True)
    assert resp.status_code == 400

def test_group_add_no_group_name():
    """--> Test add API failure due to json with missing group name"""
    test_obj = Group()
    test_obj.gid = 100
    success, resp = test_obj.save_new(TEST_SESSION)
    assert not success

def test_update_no_authority():
    """--> Update a group fails if user is not admin or owner for the group"""
    global added_obj
    added_obj.name = 'edited'
    success, resp = added_obj.save_update(MEMBER_SESSION)
    assert not success
    assert resp.status_code == 401

def test_delete_no_authority():
    """--> Delete a group fails if user is not owner for the group"""
    global added_obj
    success, resp = added_obj.save_delete(MEMBER_SESSION)
    assert not success
    assert resp.status_code == 401
