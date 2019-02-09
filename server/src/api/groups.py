"""Module to handle /groups API endpoint"""
import uuid
from flask import g, current_app, request
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from flask_jwt_extended import jwt_required
from dm.Group import Group
from util.api_util import api_error

@jwt_required
def post(body):
    """Method to handle POST verb for /groups enpoint"""

    # Check if this request would be a duplicate, and if so return an error
    check_group = g.db_session.query(Group).filter(Group.name == body['name']).one_or_none()
    if check_group is not None:
        return api_error(400, 'DUPLICATE_GROUP_NAME', body['name'])
    if 'gid' in body:
        check_group = g.db_session.query(Group).filter(Group.gid == body['gid']).one_or_none()
        if check_group is not None:
            return api_error(400, 'DUPLICATE_GID', body['gid'])
    # If we get here, then we have a valid create request
    current_app.logger.debug('groups.post -> group = ' + str(body))
    new_group = Group(name=body['name'], source='Local')
    new_group.apply_update(body)
    try:
        g.db_session.add(new_group)
        g.db_session.commit()
    except IntegrityError:
        return api_error(400, 'DUPLICATE_GROUP_KEY')
    return {'group_id': new_group.get_uuid()}, 201

@jwt_required
def search(search_text):
    """Method to handle GET verb with no URL parameters"""
    my_search = '%'
    if search_text:
        my_search = '%' + search_text + '%'
    current_app.logger.debug('groups.search my_search = {}'.format(my_search))
    group_list = g.db_session.query(Group)\
                  .filter(Group.name.like(my_search))\
                  .order_by(Group.name)\
                  .all()
    ret = []
    for group in group_list:
        ret.append(group.dump())
    return ret, 200

@jwt_required
def delete(group_id):
    """Method to handle DELETE verb for /groups/{group_id} endpoint"""
    current_app.logger.debug('Delete group called with group_id = ' + group_id)
    binary_uuid = uuid.UUID(group_id).bytes
    delete_group = g.db_session.query(Group).filter(Group.group_id == binary_uuid).one_or_none()
    if not delete_group:
        return api_error(404, 'GROUP_ID_NOT_FOUND', group_id)
    g.db_session.delete(delete_group)
    g.db_session.commit()
    return 'Group deleted', 204

@jwt_required
def put(group_id, body):
    """Method to handle PUT verb for /groups/{group_id} endpoint"""
    current_app.logger.debug('groups.put group_id = {}, body = {}'.format(group_id, str(body)))
    binary_uuid = uuid.UUID(group_id).bytes
    update_group = g.db_session.query(Group).filter(Group.group_id == binary_uuid).one_or_none()
    if not update_group:
        return api_error(404, 'GROUP_ID_NOT_FOUND', group_id)
    # Now we're good to update the user and their identity person record
    for key, value in body.items():
        if hasattr(update_group, key):
            setattr(update_group, key, value)
    g.db_session.add_all([update_group])
    g.db_session.commit()
    return 'Group updated', 200

@jwt_required
def get(group_id):
    """Handles GET verb for /groups/{group_id} endpoint"""
    binary_uuid = uuid.UUID(group_id).bytes
    find_group = g.db_session.query(Group).filter(Group.group_id == binary_uuid).one_or_none()
    if not find_group:
        return api_error(404, 'GROUP_ID_NOT_FOUND', group_id)
    ret = find_group.dump(deep=True)
    current_app.logger.debug('groups.get ret = {}'.format(str(ret)))
    return ret, 200
