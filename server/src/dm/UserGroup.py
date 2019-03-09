"""UserGroup.py - Module containing the class that links users to groups"""
import uuid
import logging
from sqlalchemy import Boolean, Column, ForeignKey, Integer, JSON, String
from sqlalchemy.dialects.mysql import BINARY
from sqlalchemy.orm import relationship
from .base import Base

LOGGER=logging.getLogger('appLogger')

class UserGroup(Base):
    """Data model object containing the link between a user and a group"""
    group_id = Column(BINARY(16), ForeignKey('Group.group_id'), primary_key=True)
    user_id = Column(BINARY(16), ForeignKey('User.user_id'), primary_key=True)
    is_owner = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    user = relationship('User', back_populates='groups')
    group = relationship('Group', back_populates='users')

    def dump(self, parent = None):
        """Returns dictionary of fields and values"""
        ret = {}
        for key, value in vars(self).items():
            if key == 'group_id' or key == 'user_id':
                if parent != 'Group' and key == 'group_id':
                    ret[key] = str(uuid.UUID(bytes=self.group_id))
                elif parent != 'User' and key == 'user_id':
                    ret[key] = str(uuid.UUID(bytes=self.user_id))
            elif not (key.startswith('_') or
                      key in ['user', 'group']):
                ret[key] = value
        return ret
