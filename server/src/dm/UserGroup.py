"""UserGroup.py - Module containing the class that links users to groups"""
import uuid
import datetime
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, JSON, String, text
from sqlalchemy.dialects.mysql import BINARY
from sqlalchemy.orm import relationship
from .base import Base

class UserGroup(Base):
    """Data model object containing the link between a user and a group"""
    __tablename__ = 'UserGroup'
    __table_args__ = {'mysql_charset':'utf8'}
    group_id = Column(BINARY(16), ForeignKey('Group.group_id'), primary_key=True)
    user_id = Column(BINARY(16), ForeignKey('User.user_id'), primary_key=True)
    is_owner = Column(Boolean)
    is_admin = Column(Boolean)
    record_created = Column(DateTime,
                            server_default=text('CURRENT_TIMESTAMP'))
    record_updated = Column(DateTime,
                            server_default=text('CURRENT_TIMESTAMP'),
                            onupdate=datetime.datetime.now)
    user = relationship('User', back_populates='user_groups',
                        primaryjoin="UserGroup.user_id == User.user_id",
                        foreign_keys="UserGroup.user_id")
    group = relationship('Group', back_populates='user_groups',
                         primaryjoin="UserGroup.group_id == Group.group_id",
                         foreign_keys="UserGroup.group_id")

    def dump(self, parent):
        """Returns dictionary of fields and values"""
        ret = {}
        for key, value in vars(self).items():
            if key == 'group_id' or key == 'user_id':
                if parent == 'User' and key == 'group_id':
                    ret[key] = str(uuid.UUID(bytes=self.group_id))
                elif parent == 'Group' and key == 'user_id':
                    ret[key] = str(uuid.UUID(bytes=self.user_id))
            elif key not in ['user', 'group']:
                ret[key] = value
        return ret
