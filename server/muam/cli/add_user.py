# add-user.py - Adds a User
import logging
import sys
from smoacks.cli_util import get_opts, get_session
from muam.User import User


logging.basicConfig(level=logging.DEBUG)
LOGGER = logging.getLogger()



def add():
    opts = get_opts('add_user', 'Adds User to a muam',
                    { 'username': 'username',
                    'email': 'email',
                    'first_name': 'first_name',
                    'full_name': 'full_name',
                    'last_name': 'last_name',
                    'phone': 'phone',
                    'create_users': 'create_users',
                    'create_groups': 'create_groups',
                    'grant_privs': 'grant_privs',
                     })

    session = get_session(opts)
    if not session:
        sys.exit('Invalid username/password.')

    
    add_item = User(**vars(opts))
    success, resp = add_item.save_new(session)

    if success:
        print('Added User with id: {}'.format(','.join(add_item.get_ids())))
    else:
        print('Add failed with code {} and message: {}'.format(resp.status_code, resp.text))