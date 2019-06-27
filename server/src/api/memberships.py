# pylint: disable-msg=C0321,R0912
"""Module to handle /Memberships API endpoint """
from flask import current_app, g
from flask_jwt_extended import jwt_required
from util.api_util import handle_2key_post, handle_2key_delete, handle_2key_put, \
                          handle_2key_get
from dm.Membership import Membership

@jwt_required
def post(body):
    """Method to handle POST verb for /Memberships endpoint"""
    return handle_2key_post(Membership, g.db_session, body)

@jwt_required
def delete(group_id, user_id):
    """Method to handle DELETE verb for /Membership/user_id endpoint"""
    return handle_2key_delete(Membership, Membership.group_id, Membership.user_id, g.db_session, group_id, user_id)

@jwt_required
def put(group_id, user_id, body):
    """Method to handle PUT verb for /Membership/user_id endpoint"""
    return handle_2key_put(Membership, Membership.group_id, Membership.user_id, g.db_session, group_id, user_id, body)

@jwt_required
def get(group_id, user_id):
    """Method to handle GET verb for /Membership/user_id endpoint"""
    return handle_2key_get(Membership, Membership.group_id, Membership.user_id, g.db_session, group_id, user_id)