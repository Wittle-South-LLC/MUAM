# muam-groupadd.py - Adds a group to the Multimode User Authentication
import argparse
import getpass
import os
import sys
from dm.DataModel import get_session
from dm.Group import Group
from dm.User import User
from dm.Membership import Membership

# Ensure we have a database session or exit
my_session = get_session()
if not my_session:
    # We are unable to get a dabase session for some reason
    sys.exit('Unable to create database session')

# Set up the argument parser for our command line options
parser = argparse.ArgumentParser(prog='muam-groupadd',
                                 description='Add groups to Multimode User Authentication for Microservices')
parser.add_argument('-u', dest='my_user')
parser.add_argument('-p', dest='my_pwd')
parser.add_argument('--gid', required=True)
parser.add_argument('--name', required=True)
parser.add_argument('--description')
parser.add_argument('--users', dest='user_list')
parser.add_argument('--admins', dest='admin_list')
parser.add_argument('--owners', dest='owner_list')

# Parse the actual arguments to this script
opts = parser.parse_args()

# Prompt for username and password to authenticate if needed
my_user = opts.my_user if 'my_user' in opts and opts.my_user != None else input("Username: ")
my_pwd = opts.my_pwd if 'my_pwd' in opts and opts.my_pwd != None else getpass.getpass("Password: ")

# Confirm authentication and privilege to add groups
user = my_session.query(User).filter(User.username == my_user).one_or_none()
if not user or not user.verify_password(my_pwd):
    sys.exit('Invalid username/password.')
if not user.create_groups:
    sys.exit('Insufficient privileges for creating groups')

# Create the new group from the options passed on the command line
new_group = Group(name=opts.name, gid=opts.gid, source='Local')
new_group.description = opts.description if 'description' in opts else None
if 'user_list' in opts and opts.user_list != None:
    user_list = opts.user_list.split(',')
    for user_name in user_list:
        user = my_session.query(User).filter(User.username == user_name).one_or_none()
        if user:
            new_group.users.append(Membership(user=user))
if 'owner_list' in opts and opts.owner_list != None:
    owner_list = opts.owner_list.split(',')
    for user_name in owner_list:
        user = my_session.query(User).filter(User.username == user_name).one_or_none()
        if user:
            new_group.users.append(Membership(user=user, is_owner=True))
else:
    new_group.users.append(Membership(user=user, is_owner=True))
if 'admin_list' in opts and opts.admin_list != None:
    admin_list = opts.admin_list.split(',')
    for user_name in admin_list:
        user = my_session.query(User).filter(User.username == user_name).one_or_none()
        if user:
            new_group.users.append(Membership(user=user, is_admin=True))
my_session.add(new_group)
my_session.commit()
my_session.close()
print('Added group: {}'.format(opts.name))
