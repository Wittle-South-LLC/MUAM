# pylint: disable-msg=C0103,W0603
# Note about pylint disables - pylint thinks my globals are constants,
# and they're not, so disabling C0103. It also doesn't like globals,
# which I don't care much about because I want to use them here in my
# tests.
"""test-login-api.py - Tests of Login API"""
import logging
from smoacks.api_util import call_api, login
from .TestUtil import log_response_error

LOGGER = logging.getLogger()
TEST_SESSION = login('admin', 'testing0')

def test_login():
    """LoginAPI: Test login API"""
    resp = call_api(TEST_SESSION, 'GET', '/us/login', None, True)
    log_response_error(resp)
    assert resp.status_code == 200
    json = resp.json()
    
    assert len(json['Groups']) == 0
    assert len(json['Memberships']) == 0
    assert len(json['Users']) == 1