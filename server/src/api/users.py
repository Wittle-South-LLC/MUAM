# pylint: disable-msg=C0321,R0912
"""Module to handle /Users API endpoint """
from flask import current_app, g
from flask_jwt_extended import jwt_required
from util.api_util import new_dm_object, existing_dm_object, persist_dm_object, \
                          delete_dm_object, post_response, handle_search, api_error
from dm.User import User

@jwt_required
def post(body):
    """Method to handle POST verb for /Users endpoint"""
    # Check if the username is already in use, and if so return an error
    check_user = g.db_session.query(User).filter(User.username == body['username']).one_or_none()
    if check_user is not None:
        return api_error(400, 'DUPLICATE_USER_NAME', body['username'])
    obj = new_dm_object(User, body)
    obj.source = 'Local'
    obj.hash_password(body['password'])
    persist_dm_object(obj, g.db_session)
    return post_response(obj, 'user_id')

@jwt_required
def search(search_text):
    """Method to handle GET verb with no URL parameters"""
    return handle_search(User, User.full_name, g.db_session, search_text)

@jwt_required
def delete(user_id):
    """Method to handle DELETE verb for /User/user_id endpoint"""
    obj = existing_dm_object(User, g.db_session, User.user_id, user_id)
    if not obj:
        return 'NOT_FOUND', 404
    delete_dm_object(obj, g.db_session)
    return 'User deleted', 204

@jwt_required
def put(user_id, body):
    """Method to handle PUT verb for /User/user_id endpoint"""
    obj = existing_dm_object(User, g.db_session, User.user_id, user_id)
    if not obj:
        return 'NOT_FOUND', 404
    user = g.db_session.query(User)\
                       .filter(User.user_id == g.user_id)\
                       .one_or_none()
    if obj.username != user.username and not user.create_users:
        current_app.logger.debug('/users PUT: rejected update to %s by %s' %\
                                 (obj.username, user.username))
        return api_error(401, 'UNAUTHORIZED_USER_EDIT')
    obj.apply_update(body)
    if 'newPassword' in body:
        obj.hash_password(body['newPassword'])
    persist_dm_object(obj, g.db_session)
    return 'User updated', 200

@jwt_required
def get(user_id):
    """Method to handle GET verb for /User/user_id endpoint"""
    obj = existing_dm_object(User, g.db_session, User.user_id, user_id)
    if not obj:
        return 'NOT_FOUND', 404
    return obj.dump(True), 200