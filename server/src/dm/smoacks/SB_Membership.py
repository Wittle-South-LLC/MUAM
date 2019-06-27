"""Membership.py - Module containing the Membership class"""
import uuid
import datetime
from sqlalchemy import Boolean, Column, ForeignKey, DateTime, Integer, JSON, String, text
from sqlalchemy.dialects.mysql import BINARY
from sqlalchemy.orm import relationship

from .base import Base

class SB_Membership(Base):
    """Data model object representing a Membership"""
    __tablename__ = 'Membership'
    __uuid_list__ = {'group_id', 'user_id'}
    __primary_key__ = 'user_id'
    group_id = Column(BINARY(16), ForeignKey('Group.group_id'), primary_key=True)
    user_id = Column(BINARY(16), ForeignKey('User.user_id'), primary_key=True)
    is_owner = Column(Boolean)
    is_admin = Column(Boolean)
    
    user = relationship('User', back_populates='memberships')
    group = relationship('Group', back_populates='memberships')
    


    def dump(self, deep=False):
        """Returns dictionary of fields and values"""
        ret = {}
        for key, value in vars(self).items():
            if key in self.__uuid_list__ and value:
                ret[key] = str(uuid.UUID(bytes=value))
            elif not key.startswith('_'):
                ret[key] = value
        return ret