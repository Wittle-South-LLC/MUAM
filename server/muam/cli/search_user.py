# search-user.py - Searches for Users
import logging
import sys
from smoacks.cli_util import get_opts, get_session
from muam.User import User

logging.basicConfig(level=logging.DEBUG)
LOGGER = logging.getLogger()

def search():
    opts = get_opts('search_user', 'Searches for Users in a muam',
                    { 'search_text': 'search_text' })

    session = get_session(opts)
    if not session:
        sys.exit('Invalid username/password.')

    success, resp_list =User.search(session, opts.search_text)

    if success:
        for resp in resp_list:
            print('{} - {}'.format(resp.get_ids(), resp.full_name))
    else:
        print('Search failed with code {} and message: {}'.format(resp.status_code, resp.text))