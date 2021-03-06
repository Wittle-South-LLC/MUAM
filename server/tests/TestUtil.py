"""TestUtil.py - Utility methods for test cases"""
import os.path
import logging
import requests
import uuid
from flask import Flask, make_response
from flask_jwt_extended import JWTManager, create_access_token, \
     create_refresh_token, get_csrf_token, set_access_cookies
from http import cookiejar
from smoacks.api_util import AcceptAll

LOGGER = logging.getLogger()

APP = Flask(__name__)
APP.config['SECRET_KEY'] = 'Testing'
APP.config['JWT_COOKIE_CSRF_PROTECT'] = True
APP.config['JWT_TOKEN_LOCATION'] = ['cookies']
JWT = JWTManager(APP)

default_group_ids = {}
default_user_ids = {}
default_group_name = {}
user_id_role_map = {}
default_group_ids['Owner'] = str(uuid.UUID(bytes=uuid.uuid4().bytes))
default_group_name['Owner'] = 'Owner Group'
default_user_ids['Owner'] = str(uuid.UUID(bytes=uuid.uuid4().bytes))
user_id_role_map[default_user_ids['Owner']] = 'Owner'
default_group_ids['Editor'] = str(uuid.UUID(bytes=uuid.uuid4().bytes))
default_group_name['Editor'] = 'Editor Group'
default_user_ids['Editor'] = str(uuid.UUID(bytes=uuid.uuid4().bytes))
user_id_role_map[default_user_ids['Editor']] = 'Editor'
default_group_ids['Viewer'] = str(uuid.UUID(bytes=uuid.uuid4().bytes))
default_group_name['Viewer'] = 'Viewer Group'
default_user_ids['Viewer'] = str(uuid.UUID(bytes=uuid.uuid4().bytes))
user_id_role_map[default_user_ids['Viewer']] = 'Viewer'


@JWT.user_claims_loader
def add_claims_to_access_token(identity):
    result = {
        'user_id': identity,
        'groups': {}
    }
    if identity in user_id_role_map:
        role_name = user_id_role_map[identity]
        result['groups'][default_group_ids[role_name]] = {
            'name': default_group_name[role_name],
            'gid': 1000
        }
    return result

# This method attempts to generate valid Flask-JWT-Extended tokens, and set them
# in the session cookiejar to simulate a valid Flask-JWT-Extended session. Part of
# the approach came from this stackoverflow answer
# https://stackoverflow.com/questions/17224054/how-to-add-a-cookie-to-the-cookiejar-in-python-requests-library
def mock_login(uid=None):
    my_session = requests.session()
    access_token = None
    csrf_token = None
    my_identity = default_user_ids['Owner'] if not uid else uid
    with APP.app_context():
        access_token = create_access_token(identity=my_identity)
        refresh_token = create_refresh_token(identity=my_identity)
        csrf_token = get_csrf_token(access_token)
        csrf_refresh_token = get_csrf_token(refresh_token)
    print('access_token: ', str(access_token))
    print('csrf_token: ', str(csrf_token))
    print('refresh_token: ', str(refresh_token))
    print('csrf_refresh_token: ', str(csrf_refresh_token))
    my_access_cookie = requests.cookies.create_cookie(name='access_token_cookie', value=access_token, domain=os.environ['TEST_HOST'])
    my_session.cookies.set_cookie(my_access_cookie)
    my_refresh_cookie = requests.cookies.create_cookie(name='refresh_token_cookie', value=refresh_token, domain=os.environ['TEST_HOST'])
    my_session.cookies.set_cookie(my_refresh_cookie)
    return {
        'session': my_session,
        'csrf_token': csrf_token,
        'csrf_refresh_token': csrf_refresh_token
    }

def log_response_error(resp, log_success=False):
    """Shared method for logging response errors"""
    if resp.status_code >= 400 or log_success:
        LOGGER.debug('Response code: {}, text: {}'.format(resp.status_code, resp.text))

def get_new_session():
    """Sets up a new session object that contains a requests session and a saved csrf token"""
    my_session = requests.session()
    my_session.cookies.set_policy(AcceptAll())
    return {
        'session': my_session,
        'csrf_token': None,
        'csrf_refresh_token': None
    }