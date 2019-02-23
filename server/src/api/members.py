"""Module to handle /membership API endpoint"""
import uuid
from flask import g, current_app, request
from flask_jwt_extended import jwt_required
from dm.Group import Group
from dm.UserGroup import UserGroup
from dm.User import User
from util.api_util import api_error

@jwt_required
def post(body):
    """Method to handle POST verb for /members endpoint"""

    # Convert the IDs that are required parameters to binary UUID form
    binary_user_id = uuid.UUID(body['user_id']).bytes
    binary_group_id = uuid.UUID(body['group_id']).bytes

    # Make sure the group exists
    group = g.db_session.query(Group).filter(Group.group_id == binary_group_id).one_or_none()
    if not group:
        return api_error(404,'GROUP_ID_NOT_FOUND', body['group_id'])

    # Find what the logged in user's privileges are within the group
    users_ug = None
    for ug in group.users:
        if ug.user_id == g.user.user_id:
            users_ug = ug
            break

    # If the logged in user is not a member of the group, or is a member
    # of the group without admin or owner privileges, reject this operation
    if not users_ug or (not users_ug.is_admin and not users_ug.is_owner):
        return api_error(401, 'INSUFFICIENT_PRIVILEGES', g.user.username)

    # This operation is authorized, so let's get it done
    new_ug = UserGroup(user_id = binary_user_id, group_id = binary_group_id,
                       is_admin = body['is_admin'], is_owner = body['is_owner'])
    g.db_session.add(new_ug)
    g.db_session.commit()
    return 'Membership created', 201

@jwt_required
def delete(group_id, user_id):
    """Method to handle DELETE verb for /members/{group_id}/{user_id} endpoint"""

    # Convert the IDs that are required parameters to binary UUID form
    binary_user_id = uuid.UUID(user_id).bytes
    binary_group_id = uuid.UUID(group_id).bytes

    # Make sure the group exists
    group = g.db_session.query(Group).filter(Group.group_id == binary_group_id).one_or_none()
    if not group:
        return api_error(404,'GROUP_ID_NOT_FOUND', group_id)

    # Find the user group for the logged in user and the one to delete
    delete_ug = None
    users_ug = None
    for ug in group.users:
        if ug.user_id == g.user.user_id:
            users_ug = ug
        if ug.user_id == binary_user_id:
            delete_ug = ug
        if delete_ug and users_ug:
            break

    # If we didn't find the usergroup record in the group, we can't delete it
    if not delete_ug:
        return api_error(404,'USER_ID_NOT_FOUND', user_id)

    # If the logged in user is not an owner or admin for the group, and 
    # they're not trying to delete their own membership, this is unauthorized
    if not users_ug or (not users_ug.is_admin and not users_ug.is_owner and not binary_user_id == g.user.user_id):
        return api_error(401, 'INSUFFICIENT_PRIVILEGES', g.user.username)

    g.db_session.delete(delete_ug)
    g.db_session.commit()
    return 'Membership removed', 204

@jwt_required
def put(group_id, user_id, body):
    """Method to handle PUT verb for /members/{group_id}/{user_id} endpoint"""

    # Convert the IDs that are required parameters to binary UUID form
    binary_user_id = uuid.UUID(user_id).bytes
    binary_group_id = uuid.UUID(group_id).bytes

    # Make sure the group exists
    group = g.db_session.query(Group).filter(Group.group_id == binary_group_id).one_or_none()
    if not group:
        return api_error(404,'GROUP_ID_NOT_FOUND', group_id)

    # Find the user group for the logged in user and the one to update
    update_ug = None
    users_ug = None
    for ug in group.users:
        if ug.user_id == g.user.user_id:
            users_ug = ug
        if ug.user_id == binary_user_id:
            update_ug = ug
        if update_ug and users_ug:
            break

    # If the logged in user is not a member of the group, or is a member
    # of the group without admin or owner privileges, reject this operation
    if not users_ug or (not users_ug.is_admin and not users_ug.is_owner):
        return api_error(401, 'INSUFFICIENT_PRIVILEGES', g.user.username)

    # This operation is authorized, so let's get it done
    update_ug.is_admin = body['is_admin']
    update_ug.is_owner = body['is_owner']
    g.db_session.add(update_ug)
    g.db_session.commit()
    return 'Membership update', 200
