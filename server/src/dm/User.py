"""User.py - Module containing the user class for the data model"""
import logging
from sqlalchemy import Boolean, Column, DateTime, inspect, JSON, String
from sqlalchemy.dialects.mysql import BINARY
from sqlalchemy.orm import backref, relationship
from passlib.apps import custom_app_context as pwd_context
from .base import Base

LOGGER=logging.getLogger('appLogger')

class User(Base):
    """Data model object representing application user"""
    user_id = Column(BINARY(16), primary_key=True)
    username = Column(String(32), index=True, unique=True)
    first_name = Column(String(80)) # User first name
    last_name = Column(String(80)) # User last name
    full_name = Column(String(120)) # Full name of the person
    email = Column(String(80), index=True, unique=True) # Email address
    phone = Column(String(20), index=True, unique=True) # Phone
    password_hash = Column(String(128)) # Persistent encrypted password
    source = Column(String(32)) # One of Local, Facebook, LDAP currently
    create_users = Column(Boolean, default=False) # Can create other users if true
    create_groups = Column(Boolean, default=False) # Can create groups if true
    grant_privs = Column(Boolean, default=False) # Can change create_users or create_groups
    reset_code = Column(String(6)) # Code for resetting password
    reset_expires = Column(DateTime) # Expiration timestamp for refresh code
#    groups = relationship('UserGroup', backref=backref('user', cascade='all, delete'))
    groups = relationship('UserGroup', back_populates='user')

    def __init__(self, **kwargs):
        """Initializes the ID for newly constructed objects"""
        super().__init__(**kwargs)
        self.assign_id()

    def get_groups(self):
        result = []
        for ug in self.groups:
            result.append({
                'group_uuid': ug.group.get_uuid(),
                'gid': ug.group.gid,
                'group_name': ug.group.name
            })
        return result

    def dump(self, deep=False):
        """Returns dictionary of fields and values"""
        ret = {}
        for key, value in vars(self).items():
            if key == 'user_id':
                ret[key] = self.get_uuid()
            elif not (key.startswith('_') or
                      key in ['password_hash', 'reset_code', 'reset_expires', 'groups']):
                ret[key] = value
        if deep:
            ret['groups'] = []
            for ug in self.groups:
                ret['groups'].append({
                    'is_admin': ug.is_admin,
                    'is_owner': ug.is_owner,
                    'group_id': ug.group.get_uuid()
                })
        return ret

    def hash_password(self, password):
        """Create password hash from password string"""
        self.password_hash = pwd_context.encrypt(password)

    def verify_password(self, password):
        """Verify password from password string"""
        return pwd_context.verify(password, self.password_hash)
