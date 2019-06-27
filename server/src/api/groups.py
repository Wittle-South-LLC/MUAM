# pylint: disable-msg=C0321,R0912
"""Module to handle /Groups API endpoint """
import uuid
from flask import current_app, g
from flask_jwt_extended import jwt_required
from util.api_util import handle_post, handle_search, handle_delete, \
                          handle_put, handle_get, api_error
from dm.User import User
from dm.Membership import Membership
from dm.Group import Group

@jwt_required
def post(body):
    """Method to handle POST verb for /Groups endpoint"""
    user = g.db_session.query(User)\
                       .filter(User.user_id == g.user_id)\
                       .one_or_none()
    # Check to see if the user has privileges to create groups
    if not user.create_groups:
        return api_error(401, 'INSUFFICIENT_PRIVILEGES', g.user.username)

    # Check if this request would be a duplicate, and if so return an error
    check_group = g.db_session.query(Group).filter(Group.name == body['name']).one_or_none()
    if check_group is not None:
        return api_error(400, 'DUPLICATE_GROUP_NAME', body['name'])
    if 'gid' in body:
        check_group = g.db_session.query(Group).filter(Group.gid == body['gid']).one_or_none()
        if check_group is not None:
            return api_error(400, 'DUPLICATE_GID', body['gid'])

    # If we get here, then we have a valid create request
    new_record = Group()
    new_record.apply_update(body)
    # Ensure that user who created the group is the owner
    new_record.memberships.append(Membership(user=user, is_owner=True))
    new_record._creator_user_id = g.user_id
    g.db_session.add(new_record)
    g.db_session.commit()
    result = {}
    result['group_id'] = new_record.get_uuid()
    return result, 201

@jwt_required
def search(search_text):
    """Method to handle GET verb with no URL parameters"""
    return handle_search(Group, Group.name, g.db_session, search_text)

@jwt_required
def delete(group_id):
    """Method to handle DELETE verb for /Group/group_id endpoint"""
    return handle_delete(Group, Group.group_id, g.db_session, group_id)

@jwt_required
def put(group_id, body):
    """Method to handle PUT verb for /Group/group_id endpoint"""
    binary_uuid = uuid.UUID(group_id).bytes
    update_group = g.db_session.query(Group).filter(Group.group_id == binary_uuid).one_or_none()
    if not update_group:
        return api_error(404, 'GROUP_ID_NOT_FOUND', group_id)
    user = g.db_session.query(User)\
                       .filter(User.user_id == g.user_id)\
                       .one_or_none()
    # Confirm the logged in user is an admin or owner
    authorized = False
    for member in update_group.memberships:
        if member.user.user_id == user.user_id:
            if member.is_admin or member.is_owner:
                authorized = True
            break
    if not authorized:
        return api_error(401,'INSUFFICIENT_PRIVILEGES', user.username)
    return handle_put(Group, Group.group_id, 'group_id', g.db_session, group_id, body)

@jwt_required
def get(group_id):
    """Method to handle GET verb for /Group/group_id endpoint"""
    return handle_get(Group, Group.group_id, g.db_session, group_id)