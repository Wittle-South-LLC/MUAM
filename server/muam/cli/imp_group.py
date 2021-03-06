# import_groups.py - Reads a comma-separated list of Group and adds them
import csv
import logging
import os
import sys
from smoacks.api_util import get_id_from_name
from smoacks.cli_util import get_opts, get_session
from muam.Group import Group


logging.basicConfig(level=logging.DEBUG)
LOGGER = logging.getLogger()

def get_id(session, field, search_val):

    return False

def import_csv():
    opts = get_opts('import_group', 'Adds list of Group to a muam',
                    {'f': 'filename'})

    if not opts.filename or not os.path.isfile(opts.filename):
        sys.exit('Filename {} does not exist or is not a file.'.format(opts.filename))

    session = get_session(opts)

    field_map = {}

    with open(opts.filename, "r") as csvfile:
        tagreader = csv.reader(csvfile)
        rowcount = 0
        for row in tagreader:
            rowcount += 1
            if rowcount == 1:
                fieldcount = 0
                for field in row:
                    field_map[field] = fieldcount
                    fieldcount += 1
                continue
            obj_data = {}
            for field in field_map:
                if field == 'authorizations':
                    obj_data['authorizations'] = []
                    auth_list = row[field_map[field]].split(', ')
                    for auth_item in auth_list:
                        auth_data = auth_item.split(':')
                        auth_gid = get_id_from_name(session, auth_data[0])
                        obj_data['authorizations'].append({
                            'group_id': auth_gid,
                            'role': auth_data[1]
                        })
                else:
                    lookup_res = get_id(session, field, row[field_map[field]])
                    obj_data[field] = lookup_res if lookup_res else row[field_map[field]]
            new_obj = Group(**obj_data)
            success, resp = new_obj.save_new(session)
            if success:
                print('row {} id: {}'.format(str(rowcount), new_obj.get_ids()))
            else:
                sys.exit('Add failed, code: {}, text: {}'.format(resp.status_code, resp.text))