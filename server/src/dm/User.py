"""User.py - Module containing the User class"""
from sqlalchemy import Column, DateTime, String
from passlib.apps import custom_app_context as pwd_context
from .smoacks.SB_User import SB_User

class User(SB_User):
    __table_args__ = {'extend_existing': True}
    __wo_fields__ = {'reset_code', 'reset_expires', 'password_hash'}
    reset_code = Column(String(6)) # Code for resetting password
    reset_expires = Column(DateTime) # Expiration timestamp for refresh code
    password_hash = Column(String(128)) # Persistent encrypted password
    pass

    def get_groups(self):
        result = {}
        for membership in self.memberships:
            result[membership.group.get_uuid()] = {
                'gid': membership.group.gid,
                'name': membership.group.name
            }
        return result

    def hash_password(self, password):
        """Create password hash from password string"""
        self.password_hash = pwd_context.encrypt(password)

    def verify_password(self, password):
        """Verify password from password string"""
        return pwd_context.verify(password, self.password_hash)