"""User.py - Module containing the user class for the data model"""
import uuid
import datetime
from sqlalchemy import Column, DateTime, JSON, String, text
from sqlalchemy.dialects.mysql import BINARY
from sqlalchemy.orm import relationship
from passlib.apps import custom_app_context as pwd_context
from .base import Base

class User(Base):
    """Data model object representing application user"""
    __tablename__ = 'User'
    __table_args__ = {'mysql_charset':'utf8'}
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
    record_created = Column(DateTime,
                            server_default=text('CURRENT_TIMESTAMP'))
    record_updated = Column(DateTime,
                            server_default=text('CURRENT_TIMESTAMP'),
                            onupdate=datetime.datetime.now)
    user_groups = relationship('UserGroup', cascade='all, delete-orphan')

    def __init__(self, **kwargs):
        """Initializes the ID for newly constructed objects"""
        super(User, self).__init__(**kwargs)
        self.user_id = uuid.uuid4().bytes

    def get_uuid(self):
        """Returns the text version of the UUID, the binary version is stored in the database"""
        return str(uuid.UUID(bytes=self.user_id))

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
