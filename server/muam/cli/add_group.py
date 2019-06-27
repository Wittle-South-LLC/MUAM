# add-group.py - Adds a Group
import logging
import sys
from smoacks.cli_util import get_opts, get_session
from muam.Group import Group


logging.basicConfig(level=logging.DEBUG)
LOGGER = logging.getLogger()



def add():
    opts = get_opts('add_group', 'Adds Group to a muam',
                    { 'description': 'description',
                    'gid': 'gid',
                    'name': 'name',
                     })

    session = get_session(opts)
    if not session:
        sys.exit('Invalid username/password.')

    
    add_item = Group(**vars(opts))
    success, resp = add_item.save_new(session)

    if success:
        print('Added Group with id: {}'.format(','.join(add_item.get_ids())))
    else:
        print('Add failed with code {} and message: {}'.format(resp.status_code, resp.text))