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
    __uuid_list__ = {'user_id', 'group_id'}
    __wo_fields__ = set()
    __primary_key__ = 'user_id'
    group_id = Column(BINARY(16), ForeignKey('Group.group_id'), primary_key=True)
    user_id = Column(BINARY(16), ForeignKey('User.user_id'), primary_key=True)
    is_owner = Column(Boolean)
    is_admin = Column(Boolean)
    
    user = relationship('User', back_populates='memberships')
    group = relationship('Group', back_populates='memberships')
    
