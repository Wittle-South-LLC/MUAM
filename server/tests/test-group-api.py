# pylint: disable-msg=C0103,W0603
# Note about pylint disables - pylint thinks my globals are constants,
# and they're not, so disabling C0103. It also doesn't like globals,
# which I don't care much about because I want to use them here in my
# tests.
"""test-group-api.py - Tests of Group APIs"""
import logging
from smoacks.api_util import call_api, login
from muam.Group import Group
from .TestUtil import log_response_error, default_group_ids

LOGGER = logging.getLogger()
TEST_SESSION = login('admin', 'testing0')
added_obj = None

def test_group_create():
    """GroupAPIs: Test create API"""
    #pylint: disable=W0603
    global added_obj
    test_obj = Group()
    test_obj.description = 'This is a really long description of a group'
    test_obj.profiles = {"muam": {"test": "value"}}
    test_obj.gid = 104
    test_obj.name = 'app-users'
    
    success, resp = test_obj.save_new(TEST_SESSION)
    if not success: log_response_error(resp)
    assert success
    added_obj = test_obj

def test_group_get():
    """--> get returns details """
    global added_obj
    assert added_obj
    
    success, resp = Group.get(TEST_SESSION, added_obj.group_id)
    if not success: log_response_error(resp)
    assert success
    assert resp.description == 'This is a really long description of a group'
    assert resp.profiles == {"muam": {"test": "value"}}
    assert resp.gid == 104
    assert resp.name == 'app-users'
    
def test_group_search():
    """--> tests search """
    
    success, resp_list = Group.search(TEST_SESSION, '')
    if not success: log_response_error(resp_list)
    assert success
    LOGGER.debug('search result: {}'.format(str(resp_list)))
    assert len(resp_list) == 1
    resp = resp_list[0]
    assert resp.description == 'This is a really long description of a group'
    assert resp.profiles == {"muam": {"test": "value"}}
    assert resp.gid == 104
    assert resp.name == 'app-users'
    

def test_group_put():
    """--> put updates object """
    global added_obj
    
    # Change a value
    added_obj.name = 'app-users - edited'
    # Save the change a value
    success, resp = added_obj.save_update(TEST_SESSION)
    if not success: log_response_error(resp)
    assert success
    # Read the object again
    success, resp = Group.get(TEST_SESSION, added_obj.group_id)
    if not success: log_response_error(resp)
    assert success
    # Confirm the values we read match what we wrote
    assert resp.name == added_obj.name

def test_group_delete():
    """--> delete returns 204"""
    success, resp = added_obj.save_delete(TEST_SESSION)
    if not success: log_response_error(resp)
    assert success