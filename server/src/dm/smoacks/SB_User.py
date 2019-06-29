"""User.py - Module containing the User class"""
import uuid
import datetime
from sqlalchemy import Boolean, Column, ForeignKey, DateTime, Integer, JSON, String, text
from sqlalchemy.dialects.mysql import BINARY
from sqlalchemy.orm import relationship

from .base import Base

class SB_User(Base):
    """Data model object representing a User"""
    __tablename__ = 'User'
    __uuid_list__ = {'user_id'}
    __wo_fields__ = {'password'}
    __primary_key__ = 'user_id'
    user_id = Column(BINARY(16), primary_key=True)
    username = Column(String(32))
    email = Column(String(80))
    first_name = Column(String(80))
    full_name = Column(String(120))
    last_name = Column(String(80))
    phone = Column(String(20))
    source = Column(String(80))
    create_users = Column(Boolean)
    create_groups = Column(Boolean)
    grant_privs = Column(Boolean)
    
    memberships = relationship('Membership', back_populates='user')
    

    def __init__(self, **kwargs):
        """Initializes the ID for newly constructed objects"""
        super(SB_User, self).__init__(**kwargs)
        self.user_id = uuid.uuid4().bytes
