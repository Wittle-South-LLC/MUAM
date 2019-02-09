"""Group.py - Module containing the group class for the data model"""
from sqlalchemy import Column, Integer, JSON, String, Text
from sqlalchemy.dialects.mysql import BINARY
from sqlalchemy.orm import relationship
from .base import Base

class Group(Base):
    """Data model object representing a named group of users"""
    group_id = Column(BINARY(16), primary_key=True)
    gid = Column(Integer, unique=True, nullable=True)
    name = Column(String(80), index=True, unique=True)
    description = Column(Text)
    source = Column(String(32))     # One of Local, LDAP
    user_groups = relationship('UserGroup', cascade='all, delete-orphan')

    def __init__(self, **kwargs):
        """Initializes the ID for newly constructed objects"""
        super().__init__(**kwargs)
        self.assign_id()

    def dump(self, deep=False):
        """Returns dictionary of fields and values"""
        ret = {}
        for key, value in vars(self).items():
            if key == 'group_id':
                ret[key] = self.get_uuid()
            elif not key.startswith('_'):
                ret[key] = value
        return ret
