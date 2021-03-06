"""Group.py - Module containing the Group class"""
import uuid
import datetime
from sqlalchemy import Boolean, Column, Float, ForeignKey, Integer, JSON, String, text
from sqlalchemy.dialects.mysql import BINARY, DATETIME
from sqlalchemy.orm import relationship

from .base import Base

class SB_Group(Base):
    """Data model object representing a Group"""
    __tablename__ = 'Group'
    __uuid_list__ = {'group_id'}
    __wo_fields__ = set()
    __primary_key__ = 'group_id'
    description = Column(String(3000))
    source = Column(String(80))
    profiles = Column(JSON)
    group_id = Column(BINARY(16), primary_key=True)
    gid = Column(Integer)
    name = Column(String(80))
    
    memberships = relationship('Membership', back_populates='group', cascade='all, delete-orphan')
    

    def __init__(self, **kwargs):
        """Initializes the ID for newly constructed objects"""
        super(SB_Group, self).__init__(**kwargs)
        self.group_id = uuid.uuid4().bytes
