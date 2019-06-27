# add-membership.py - Adds a Membership
import logging
import sys
from smoacks.cli_util import get_opts, get_session
from muam.Membership import Membership


logging.basicConfig(level=logging.DEBUG)
LOGGER = logging.getLogger()



def add():
    opts = get_opts('add_membership', 'Adds Membership to a muam',
                    { 'group_id': 'group_id',
                    'user_id': 'user_id',
                    'is_owner': 'is_owner',
                    'is_admin': 'is_admin',
                     })

    session = get_session(opts)
    if not session:
        sys.exit('Invalid username/password.')

    
    add_item = Membership(**vars(opts))
    success, resp = add_item.save_new(session)

    if success:
        print('Added Membership with id: {}'.format(','.join(add_item.get_ids())))
    else:
        print('Add failed with code {} and message: {}'.format(resp.status_code, resp.text))