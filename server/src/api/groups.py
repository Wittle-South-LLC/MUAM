# pylint: disable-msg=C0321,R0912
"""Module to handle /Groups API endpoint """
from flask import current_app, g
from flask_jwt_extended import jwt_required
from util.api_util import new_dm_object, existing_dm_object, persist_dm_object, \
                          delete_dm_object, post_response, handle_search, api_error
from dm.Group import Group
from dm.Membership import Membership
from dm.User import User

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
    obj = new_dm_object(Group, body)
    # Ensure that user who created the group is the owner
    obj.memberships.append(Membership(user=user, is_owner=True))
    persist_dm_object(obj, g.db_session)
    current_app.logger.info('Group Post Response: {}'.format(str(post_response(obj, 'group_id'))))
    return post_response(obj, 'group_id')

@jwt_required
def search(search_text):
    """Method to handle GET verb with no URL parameters"""
    return handle_search(Group, Group.name, g.db_session, search_text)

@jwt_required
def delete(group_id):
    """Method to handle DELETE verb for /Group/group_id endpoint"""
    obj = existing_dm_object(Group, g.db_session, Group.group_id, group_id)
    if not obj:
        return 'NOT_FOUND', 404
    delete_dm_object(obj, g.db_session)
    return 'Group deleted', 204

@jwt_required
def put(group_id, body):
    """Method to handle PUT verb for /Group/group_id endpoint"""
    obj = existing_dm_object(Group, g.db_session, Group.group_id, group_id)
    if not obj:
        return 'NOT_FOUND', 404
    user = g.db_session.query(User)\
                       .filter(User.user_id == g.user_id)\
                       .one_or_none()
    # Confirm the logged in user is an admin or owner
    authorized = False
    for member in obj.memberships:
        if member.user.user_id == user.user_id:
            if member.is_admin or member.is_owner:
                authorized = True
            break
    if not authorized:
        return api_error(401,'INSUFFICIENT_PRIVILEGES', user.username)
    obj.apply_update(body)
    persist_dm_object(obj, g.db_session)
    return 'Group updated', 200

@jwt_required
def get(group_id):
    """Method to handle GET verb for /Group/group_id endpoint"""
    obj = existing_dm_object(Group, g.db_session, Group.group_id, group_id)
    if not obj:
        return 'NOT_FOUND', 404
    return obj.dump(True), 200