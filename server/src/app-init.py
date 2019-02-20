# app-init.py - establishes initial user(s) and group(s), enables
#               API security to prevent privileged objects from being
#               created by doing so outside of security
#

import os
from dm.DataModel import get_session
from dm.Group import Group
from dm.User import User
from dm.UserGroup import UserGroup

my_session = get_session()
if not my_session:
    # We are unable to get a dabase session for some reason
    exit(1)

admin_user = User(username=os.environ['APP_ADMIN_USER_USERNAME'])
admin_user.first_name = 'Administrator'
admin_user.last_name = ''
admin_user.email = 'admin@wittlesouth.com'
admin_user.phone = '+1 (919) 929-4378'
admin_user.hash_password(os.environ['APP_ADMIN_USER_PASSWORD'])
user_create_group = Group(name=os.environ['APP_CREATE_USERS_NAME'], gid=os.environ['APP_CREATE_USERS_GID'])
group_create_group = Group(name=os.environ['APP_CREATE_GROUPS_NAME'], gid=os.environ['APP_CREATE_GROUPS_GID'])
au_ucg = UserGroup(user_id=admin_user.user_id, group_id = user_create_group.group_id, is_owner=True, is_admin=True)
au_gcg = UserGroup(user_id=admin_user.user_id, group_id = group_create_group.group_id, is_owner=True, is_admin=True)
my_session.add_all([admin_user, user_create_group, group_create_group, au_ucg, au_gcg])
my_session.commit()

my_session.close()
