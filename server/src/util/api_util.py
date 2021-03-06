"""api_util.py - Utility functions to share across APIs"""
# The intent of this module is to provide shared utility code that works across APIs
# api_error - Enables internationalization / localization of error messages in the UI by
#             returning a set of error codes as well as default english error messages

import uuid
from flask import jsonify, g

API_ERRORS = {
    "INSUFFICIENT_PRIVILEGES": "User {} does not have required privileges for this operation",
    "INVALID_SHUTDOWN_KEY": 'The shutdown key {} is not valid',
    "CANNOT_ASSIGN_ADMIN": 'Cannot assign Admin role during user creation'
}

# Error response constants

def api_error(code, msg_key, msg_text=None):
    """Provides a flask response in error conditions"""
    resp_obj = {
        'error_code': code,
        'key': msg_key
    }
    if msg_text:
        resp_obj['text'] = api_error_msg(msg_key, msg_text)
    resp = jsonify(resp_obj)
    resp.status_code = code
    return resp

def api_error_msg(msg_key, msg_text):
    """Formats error message with message text based on message key"""
    if msg_key in API_ERRORS:
        if '{}' in API_ERRORS[msg_key]:
            return API_ERRORS[msg_key].format(msg_text)
        return API_ERRORS[msg_key]
    return "Unknown error key: " + msg_key #pragma: no cover

def new_dm_object(dmo, body):
    new_record = dmo()
    new_record.apply_update(body)
    new_record._creator_user_id = g.user_id
    return new_record

def existing_dm_object(dmo, session, keys, ids):
    find_record = None
    if not isinstance(keys, list):
        find_record = session.query(dmo)\
                       .filter(keys == uuid.UUID(ids).bytes).one_or_none()
    else:
        bid1 = uuid.UUID(ids[0]).bytes
        bid2 = uuid.UUID(ids[1]).bytes
        find_record = session.query(dmo)\
                       .filter(keys[0] == bid1, keys[1] == bid2).one_or_none()
    return find_record

def persist_dm_object(obj, session):
    session.add(obj)
    session.commit()

def delete_dm_object(obj, session):
    session.delete(obj)
    session.commit()

def post_response(obj, keys):
    """Method to handle POST verbs for data model object APIs"""
    result = {}
    # Based on SMOACKS model assumptions, new IDs are generated only for
    # data model objects with a single primary key. Therefore, if keys is
    # a string rather than a list, we should return the object's UUID in
    # the response. For multiple-field primary key objects, the assumption
    # is that object creation requires providing existing keys
    if isinstance(keys, str):
        result[keys] = obj.get_uuid()
    return result, 201

def handle_search(dmo, search_field, session, search_text):
    """Method to handle GET verb with no URL parameters"""
    my_search = '%'
    if search_text:
        my_search = '%' + search_text + '%'
    search_list = session.query(dmo)\
                   .filter(search_field.like(my_search)).all()
    ret = []
    for item in search_list:
        ret.append(item.dump())
    return ret, 200