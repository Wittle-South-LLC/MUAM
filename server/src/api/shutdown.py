"""shutdown.py - Implements API endpoint for /shutdown"""
import logging
import os
from flask import request
from util.api_util import api_error

LOGGER=logging.getLogger('appLogger')

def post(body):
    """Method to handle POST verb for /shutdown API endpoint"""
    if 'key' in body and body['key'] == os.environ['APP_SHUTDOWN_KEY']:
        shutdown_server()
        return 'Server shutting down...\n'
    LOGGER.error("ERROR: Post made to /shutdown endpoint without required key value")
    return api_error(400, 'INVALID_SHUTDOWN_KEY', body['key'])

# Code here to ensure that the test scripts can shut down
# the server once it is launched
def shutdown_server():
    """Method to shut down the server"""
    func = request.environ.get('werkzeug.server.shutdown')
    func()