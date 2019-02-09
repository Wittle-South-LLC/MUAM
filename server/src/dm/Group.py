"""Group.py - Module containing the group class for the data model"""
import uuid
import datetime
from sqlalchemy import Column, DateTime, Integer, JSON, String, text, Text
from sqlalchemy.dialects.mysql import BINARY
from sqlalchemy.orm import relationship
from .base import Base

class Group(Base):
    """Data model object representing a named group of users"""
    __tablename__ = 'Group'
    __table_args__ = {'mysql_charset':'utf8'}
    group_id = Column(BINARY(16), primary_key=True)
    gid = Column(Integer, unique=True, nullable=True)
    name = Column(String(80), index=True, unique=True)
    description = Column(Text)
    source = Column(String(32))     # One of Local, LDAP
    record_created = Column(DateTime,
                            server_default=text('CURRENT_TIMESTAMP'))
    record_updated = Column(DateTime,
                            server_default=text('CURRENT_TIMESTAMP'),
                            onupdate=datetime.datetime.now)
    user_groups = relationship('UserGroup', cascade='all, delete-orphan')

    def __init__(self, **kwargs):
        """Initializes the ID for newly constructed objects"""
        super(Group, self).__init__(**kwargs)
        self.group_id = uuid.uuid4().bytes

    def get_uuid(self):
        """Returns the text version of the UUID, the binary version is stored in the database"""
        return str(uuid.UUID(bytes=self.group_id))

    def dump(self, deep=False):
        """Returns dictionary of fields and values"""
        ret = {}
        for key, value in vars(self).items():
            if key == 'group_id':
                ret[key] = self.get_uuid()
            else:
                ret[key] = value
        return ret
