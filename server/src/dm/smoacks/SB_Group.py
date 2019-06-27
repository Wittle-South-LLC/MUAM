"""Group.py - Module containing the Group class"""
import uuid
import datetime
from sqlalchemy import Boolean, Column, ForeignKey, DateTime, Integer, JSON, String, text
from sqlalchemy.dialects.mysql import BINARY
from sqlalchemy.orm import relationship

from .base import Base

class SB_Group(Base):
    """Data model object representing a Group"""
    __tablename__ = 'Group'
    __uuid_list__ = {'group_id'}
    __primary_key__ = 'group_id'
    description = Column(String(3000))
    source = Column(String(80))
    group_id = Column(BINARY(16), primary_key=True)
    gid = Column(Integer)
    name = Column(String(80))
    
    memberships = relationship('Membership', back_populates='group', cascade='all, delete-orphan')
    

    def __init__(self, **kwargs):
        """Initializes the ID for newly constructed objects"""
        super(SB_Group, self).__init__(**kwargs)
        self.group_id = uuid.uuid4().bytes


    def dump(self, deep=False):
        """Returns dictionary of fields and values"""
        ret = {}
        for key, value in vars(self).items():
            if key in self.__uuid_list__ and value:
                ret[key] = str(uuid.UUID(bytes=value))
            elif not key.startswith('_'):
                ret[key] = value
        return ret