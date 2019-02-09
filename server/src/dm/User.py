"""User.py - Module containing the user class for the data model"""
import logging
from sqlalchemy import Column, DateTime, inspect, JSON, String
from sqlalchemy.dialects.mysql import BINARY
from sqlalchemy.orm import relationship
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
    email = Column(String(80), index=True, unique=True)
    phone = Column(String(20), index=True, unique=True)
    password_hash = Column(String(128))
    source = Column(String(32)) # One of Local, Facebook, LDAP currently
    reset_code = Column(String(6)) # Code for resetting password
    reset_expires = Column(DateTime) # Expiration timestamp for refresh code
    user_groups = relationship('UserGroup', cascade='all, delete-orphan')

    def __init__(self, **kwargs):
        """Initializes the ID for newly constructed objects"""
        super().__init__(**kwargs)
        self.assign_id()

    def get_groups(self):
        result = []
        for ug in self.user_groups:
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
                      key in ['password_hash', 'reset_code', 'reset_expires']):
                ret[key] = value
        return ret

    def hash_password(self, password):
        """Create password hash from password string"""
        self.password_hash = pwd_context.encrypt(password)

    def verify_password(self, password):
        """Verify password from password string"""
        return pwd_context.verify(password, self.password_hash)
