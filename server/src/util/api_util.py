"""api_util.py - Utility functions to share across APIs"""
# The intent of this module is to provide shared utility code that works across APIs
# api_error - Enables internationalization / localization of error messages in the UI by
#             returning a set of error codes as well as default english error messages

from flask import jsonify

API_ERRORS = {
    "MISSING_USERNAME_API_KEY": "Either username or api_key is required, neither were provided",
    "INVALID_USERNAME_PASSWORD": "Invalid username / password combination",
    "INSUFFICIENT_PRIVILEGES": "User {} does not have required privileges for this operation",
    "EMAIL_NOT_FOUND": 'Email {} not found',
    "REGISTERED_USER_EXISTS": 'A different user is already registered for {}',
    "RESET_CODE_CURRENT": 'There is already a valid reset code for this user',
    "RESET_CODE_INVALID_OR_EXIRED": 'The reset code provided is invalid or expired',
    "RESET_EMAIL_MISMATCH": 'The email provided for reset does not match the email of the user',
    "INVALID_SHUTDOWN_KEY": 'The shutdown key {} is not valid',
    "DUPLICATE_USER_NAME": 'User name {} is already in use',
    "DUPLICATE_USER_KEY": 'Key value (e.g. email, phone) is already in use for another user',
    "DUPLICATE_GROUP_NAME": 'Group name {} is already in use',
    "DUPLICATE_GID": 'GID {} is already in use',
    "DUPLICATE_GROUP_KEY": 'Key value is already in use for another group',
    "CANNOT_ASSIGN_ADMIN": 'Cannot assign Admin role during user creation',
    "API_RECAPTCHA_FAILS": 'ReCaptcha check failed',
    "USER_ID_NOT_FOUND": 'User ID {} not found',
    "GROUP_ID_NOT_FOUND": 'Group ID {} not found',
    "MISSING_PASSWORD_EDIT": 'Current password must be provided to edit user data',
    "UNAUTHORIZED_USER_EDIT": 'Cannot edit other users data unless you have the Admin role'
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
