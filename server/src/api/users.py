# pylint: disable-msg=C0321,R0912
"""Module to handle /Users API endpoint """
import uuid
from flask import current_app, g
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError
from util.api_util import handle_post, handle_search, handle_delete, \
                          handle_put, handle_get, api_error
from dm.User import User

@jwt_required
def post(body):
    """Method to handle POST verb for /Users endpoint"""
    # Check if the username is already in use, and if so return an error
    check_user = g.db_session.query(User).filter(User.username == body['username']).one_or_none()
    if check_user is not None:
        return api_error(400, 'DUPLICATE_USER_NAME', body['username'])
    new_record = User()
    new_record.apply_update(body)
    new_record._creator_user_id = g.user_id
    new_record.source = 'Local'
    new_record.hash_password(body['password'])
    try:
        g.db_session.add(new_record)
        g.db_session.commit()
    except IntegrityError:
        return api_error(400, 'DUPLICATE_USER_KEY')
    result = {
        'user_id': new_record.get_uuid()
    }
    return result, 201

@jwt_required
def search(search_text):
    """Method to handle GET verb with no URL parameters"""
    return handle_search(User, User.full_name, g.db_session, search_text)

@jwt_required
def delete(user_id):
    """Method to handle DELETE verb for /User/user_id endpoint"""
    return handle_delete(User, User.user_id, g.db_session, user_id)

@jwt_required
def put(user_id, body):
    """Method to handle PUT verb for /User/user_id endpoint"""
    binary_uuid = uuid.UUID(user_id).bytes
    update_user = g.db_session.query(User).filter(User.user_id == binary_uuid).one_or_none()
    if not update_user:
        return api_error(404, 'USER_ID_NOT_FOUND', user_id)
    user = g.db_session.query(User)\
                       .filter(User.user_id == g.user_id)\
                       .one_or_none()
    if update_user.username != user.username and not user.create_users:
        current_app.logger.debug('/users PUT: rejected update to %s by %s' %\
                                 (update_user.username, user.username))
        return api_error(401, 'UNAUTHORIZED_USER_EDIT')
    update_user.apply_update(body)
    if 'newPassword' in body:
        update_user.hash_password(body['newPassword'])
    g.db_session.add(update_user)
    g.db_session.commit()
    return 'User updated', 200

@jwt_required
def get(user_id):
    """Method to handle GET verb for /User/user_id endpoint"""
    return handle_get(User, User.user_id, g.db_session, user_id)