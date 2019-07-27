# pylint: disable=C0103
"""login.py - Module to handle /login API endpoint"""
import datetime
import os
import uuid
from flask import current_app, g, jsonify
from flask_jwt_extended import create_access_token, \
     jwt_refresh_token_required, \
     create_refresh_token, set_access_cookies, \
     set_refresh_cookies
from util.api_util import api_error
from dm.smoacks.base import Base
from dm.Group import Group #pylint: disable=W0611
from dm.Membership import Membership #pylint: disable=W0611
from dm.User import User #pylint: disable=W0611


def post(body):
    """handles POST verb for /login endpoint"""

    # Need to confirm that either username & password are provided, or
    # access_token for a Facebook login.
    if ('username' not in body or 'password' not in body)\
       and 'access_token' not in body:
        return api_error(400, 'MISSING_USERNAME_API_KEY')

    # Get user based on username / password or access_token
    if 'username' in body:

        # Look up the user and verify that the password is correct
        user = g.db_session.query(User)\
                           .filter(User.username == body['username'])\
                           .one_or_none()
        if not user or not user.verify_password(body['password']):
            current_app.logger.info('--> Failed user.verify_password')
            return api_error(401, 'INVALID_USERNAME_PASSWORD')

    # Now at this point, we should always have a valid user object,
    # whether it came from a Facebook authentication or a normal
    # username / password validation

    # Create access and refresh tokens for the user. See the documentation for
    # flask-jwt-extended for details on these two different kinds of tokens
    access_token = create_access_token(identity=user.get_uuid())
    refresh_token = create_refresh_token(identity=user.get_uuid())

    # Build the response data by dumping the user data
    resp = jsonify({'Users': [user.dump()], 'auth_user_id': user.get_uuid()})

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

# The /login enpoint with the GET verb is intended to be used by client apps
# to reload the user's application data when needed (e.g. after an application
# refresh, or browser restart)
@jwt_refresh_token_required
def search():
    """Handles GET verb for /login endpoint"""
    result = {}
    
    groups_l = []
    groups_q = g.db_session.query(Group).all()
    for groups_item in groups_q:
        groups_l.append(groups_item.dump(deep=True))
    result['Groups'] = groups_l
    result['auth_user_id'] = str(uuid.UUID(bytes=g.user_id))
    
    memberships_l = []
    memberships_q = g.db_session.query(Membership).all()
    for memberships_item in memberships_q:
        memberships_l.append(memberships_item.dump(deep=True))
    result['Memberships'] = memberships_l
    result['auth_user_id'] = str(uuid.UUID(bytes=g.user_id))
    
    users_l = []
    users_q = g.db_session.query(User).all()
    for users_item in users_q:
        users_l.append(users_item.dump(deep=True))
    result['Users'] = users_l
    result['auth_user_id'] = str(uuid.UUID(bytes=g.user_id))
    
    return result, 200