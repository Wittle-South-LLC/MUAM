# pylint: disable=C0103
"""login.py - Module to handle /login API endpoint"""
import datetime
import os
from flask import current_app, g, jsonify
from flask_jwt_extended import create_access_token, \
     jwt_refresh_token_required, \
     create_refresh_token, set_access_cookies, \
     set_refresh_cookies
from util.api_util import api_error
from dm.User import User
from dm.UserGroup import UserGroup
from dm.Group import Group

def post(login_data):
    """handles POST verb for /login endpoint"""

    # Need to confirm that either username & password are provided, or
    # access_token for a Facebook login.
    if ('username' not in login_data or 'password' not in login_data)\
       and 'access_token' not in login_data:
        return api_error(400, 'MISSING_USERNAME_API_KEY')

    # Get user based on username / password or access_token
    if 'username' in login_data:

        # Look up the user and verify that the password is correct
        user = g.db_session.query(User)\
                           .filter(User.username == login_data['username'])\
                           .one_or_none()
        if not user or not user.verify_password(login_data['password']):
            return api_error(401, 'INVALID_USERNAME_PASSWORD')

    # Now at this point, we should always have a valid user object,
    # whether it came from a Facebook authentication or a normal
    # username / password validation

    # Create access and refresh tokens for the user. See the documentation for
    # flask-jwt-extended for details on these two different kinds of tokens
    access_token = create_access_token(identity=user.get_uuid())
    refresh_token = create_refresh_token(identity=user.get_uuid())

    # Build the response data by dumping the user data
    resp = jsonify({})

    # Set the tokens we created as cookies in the response
    set_access_cookies(resp, access_token, int(datetime.timedelta(minutes=30).total_seconds()))
    set_refresh_cookies(resp, refresh_token, int(datetime.timedelta(days=30).total_seconds()))

    # TODO: Figure out what the server needs to do, if anything, to enable
    # the CSRF cookie to be accessible to via fetch() headers in browser apps.
    # Some documentation implies that the ability to allow this must be granted
    # from the server via headers, but this may be specific to CORS situations,
    # which does not currently apply to this app. The below 3rd parameter to
    # return adds a custom header which is one component of CORS security to
    # allow access to the cookie
    return resp, 200, {'Access-Control-Expose-Headers': 'Set-Cookie, Content-Type'}
