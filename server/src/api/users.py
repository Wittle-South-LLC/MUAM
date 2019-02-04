"""Module to handle /users API endpoint"""
import uuid
from flask import g, current_app, request
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import jwt_required
from dm.User import User
from util.api_util import api_error

def post(body):
    """Method to handle POST verb for /users enpoint"""

    # Check if the username is already in use, and if so return an error
    check_user = g.db_session.query(User).filter(User.username == body['username']).one_or_none()
    if check_user is not None:
        return api_error(400, 'DUPLICATE_USER_NAME', body['username'])
    current_app.logger.debug('user = ' + str(body))
    new_user = User(username=body['username'], source='Local')
    for key in vars(new_user).items():
        if key in body:
            setattr(new_user, key, body[key])
    new_user.hash_password(body['password'])
    try:
        g.db_session.add(new_user)
        g.db_session.commit()
    except IntegrityError:
        return api_error(400, 'DUPLICATE_USER_KEY')
    return {'user_id': new_user.get_uuid()}, 201

@jwt_required
def search(search_text):
    """Method to handle GET verb with no URL parameters"""
    my_search = '%'
    if search_text:
        my_search = '%' + search_text + '%'
    user_list = g.db_session.query(User)\
                 .filter(User.username.like(my_search))\
                 .order_by(User.username)\
                 .all()
    ret = []
    for user in user_list:
        ret.append(user.dump())
    return ret, 200

@jwt_required
def delete(user_id):
    """Method to handle DELETE verb for /users/{user_id} endpoint"""
    current_app.logger.debug('Delete user called with user_id = ' + user_id)
    binary_uuid = uuid.UUID(user_id).bytes
    delete_user = g.db_session.query(User).filter(User.user_id == binary_uuid).one_or_none()
    if not delete_user:
        return api_error(404, 'USER_ID_NOT_FOUND', user_id)
    g.db_session.delete(delete_user)
    g.db_session.commit()
    return 'User deleted', 204

@jwt_required
def put(user_id, body):
    """Method to handle PUT verb for /users/{user_id} endpoint"""
    binary_uuid = uuid.UUID(user_id).bytes
    update_user = g.db_session.query(User).filter(User.user_id == binary_uuid).one_or_none()
    if not update_user:
        return api_error(404, 'USER_ID_NOT_FOUND', user_id)
    if update_user.username != g.user.username:
        current_app.logger.debug('/users PUT: rejected update to %s by %s' %\
                                 (update_user.username, g.user.username))
        return api_error(401, 'UNAUTHORIZED_USER_EDIT')
    # Now we're good to update the user and their identity person record
    for key, value in body.items():
        if key != 'password' and key != 'newPassword':
            if hasattr(update_user, key):
                setattr(update_user, key, value)
        elif key == 'newPassword':
            update_user.hash_password(value)
    g.db_session.add_all([update_user])
    g.db_session.commit()
    return 'User updated', 200

@jwt_required
def get(user_id):
    """Handles GET verb for /users/{user_id} endpoint"""
    binary_uuid = uuid.UUID(user_id).bytes
    find_user = g.db_session.query(User).filter(User.user_id == binary_uuid).one_or_none()
    if not find_user:
        return api_error(404, 'USER_ID_NOT_FOUND', user_id)
    ret = find_user.dump(deep=True)
    return ret, 200
