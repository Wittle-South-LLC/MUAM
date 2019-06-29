# pylint: disable-msg=C0321,R0912
"""Module to handle /Memberships API endpoint """
from flask import current_app, g
from flask_jwt_extended import jwt_required
from util.api_util import new_dm_object, existing_dm_object, persist_dm_object, \
                          delete_dm_object, post_response, handle_search, api_error
from dm.Membership import Membership

@jwt_required
def post(body):
    """Method to handle POST verb for /Memberships endpoint"""
    obj = new_dm_object(Membership, body)
    persist_dm_object(obj, g.db_session)
    return post_response(obj, ['group_id', 'user_id'])

@jwt_required
def delete(group_id, user_id):
    """Method to handle DELETE verb for /Membership/user_id endpoint"""
    obj = existing_dm_object(Membership, g.db_session, [Membership.group_id, Membership.user_id], [group_id, user_id])
    if not obj:
        return 'NOT_FOUND', 404
    delete_dm_object(obj, g.db_session)
    return 'Membership deleted', 204

@jwt_required
def put(group_id, user_id, body):
    """Method to handle PUT verb for /Membership/user_id endpoint"""
    obj = existing_dm_object(Membership, g.db_session, [Membership.group_id, Membership.user_id], [group_id, user_id])
    if not obj:
        return 'NOT_FOUND', 404
    obj.apply_update(body)
    persist_dm_object(obj, g.db_session)
    return 'Membership updated', 200

@jwt_required
def get(group_id, user_id):
    """Method to handle GET verb for /Membership/user_id endpoint"""
    obj = existing_dm_object(Membership, g.db_session, [Membership.group_id, Membership.user_id], [group_id, user_id])
    if not obj:
        return 'NOT_FOUND', 404
    return obj.dump(True), 200