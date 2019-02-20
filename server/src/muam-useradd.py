# muam-useradd.py - Adds a user to the Multimode User Authentication
import argparse
import getpass
import os
import sys
from dm.DataModel import get_session
from dm.Group import Group
from dm.User import User
from dm.UserGroup import UserGroup

# Ensure we have a database session or exit
my_session = get_session()
if not my_session:
    # We are unable to get a dabase session for some reason
    sys.exit('Unable to create database session')

# Set up the argument parser for our command line options
parser = argparse.ArgumentParser(prog='muam-useradd',
                                 description='Add users to Multimode User Authentication for Microservices')
parser.add_argument('-u', dest='my_user')
parser.add_argument('-p', dest='my_pwd')
parser.add_argument('--first_name', required=True)
parser.add_argument('--last_name', required=True)
parser.add_argument('--full_name')
parser.add_argument('--email', required=True)
parser.add_argument('--phone')
parser.add_argument('--password', required=True)
parser.add_argument('--username', required=True)
parser.add_argument('--create_groups', action='store_const', const=True, default=False)
parser.add_argument('--create_users', action='store_const', const=True, default=False)
parser.add_argument('--grant_privs', action='store_const', const=True, default=False)
parser.add_argument('--groups', dest='group_list')

# Parse the actual arguments to this script
opts = parser.parse_args()

# Prompt for username and password to authenticate if needed
my_user = opts.my_user if 'my_user' in opts and opts.my_user != None else input("Username: ")
my_pwd = opts.my_pwd if 'my_pwd' in opts and opts.my_pwd != None else getpass.getpass("Password: ")

# If there are any users in the database, ensure the username/password we have is valid
user1 = my_session.query(User).first()
user = my_session.query(User).filter(User.username == my_user).one_or_none()
if user1:
     # Confirm authentication and privilege to add groups
    if not user or not user.verify_password(my_pwd):
        sys.exit('Invalid username/password.')
    if not user.create_users:
        sys.exit('Insufficient privileges for creating users')

new_user = User(username=opts.username, first_name=opts.first_name,\
                last_name=opts.last_name, source='Local', email=opts.email)
new_user.full_name = opts.full_name if 'full_name' in opts else None
new_user.phone = opts.phone if 'phone' in opts else None
new_user.hash_password(opts.password)
if not user1 or user.grant_privs:
    new_user.create_groups = opts.create_groups
    new_user.create_users = opts.create_users
    new_user.grant_privs = opts.grant_privs
if 'group_list' in opts and opts.group_list != None:
    group_list = opts.group_list.split(',')
    for group_name in group_list:
        group = my_session.query(Group).filter(Group.name == group_name).one_or_none()
        if group:
            new_user.groups.append(UserGroup(group=group))
my_session.add(new_user)
my_session.commit()
my_session.close()
print('Added user: {}'.format(opts.username))
