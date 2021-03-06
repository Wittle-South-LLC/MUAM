"""base.py - Module creating shared declarative base for object-relational model"""
import datetime
import re
import logging
import uuid
from sqlalchemy.ext.declarative import declarative_base, declared_attr
from sqlalchemy import Column, inspect, text
from sqlalchemy.dialects.mysql import BINARY, DATETIME

LOGGER=logging.getLogger('appLogger')

def to_snakecase(value):
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', value)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()

class Base(object):
    @declared_attr
    def __tablename__(cls):
        return cls.__name__
    @declared_attr
    def __primary_key__(cls):
        return to_snakecase(cls.__name__) + '_id'
    __uuid_list__ = {'_creator_user_id'}
    __wo_fields__ = set()
    __table_args__ = {'mysql_charset':'utf8'}
    record_created = Column(DATETIME,
                            server_default=text('CURRENT_TIMESTAMP'))
    record_updated = Column(DATETIME,
                            server_default=text('CURRENT_TIMESTAMP'),
                            onupdate=datetime.datetime.now)
    _creator_user_id = Column(BINARY(16))

    def is_uuid(self, field_name):
        return field_name in self.__uuid_list__

    def assign_id(self):
        """Initializes the object"""
        LOGGER.info('assign_id for {}'.format(type(self).__name__))
        setattr(self, self.__primary_key__, uuid.uuid4().bytes)

    def apply_update(self, fields):
        """Applies a dict to the fields in this object"""
        mapper = inspect(type(self))
        for column in mapper.attrs:
            # Skip columns that are relationships
            if type(column.class_attribute.property).__name__ == 'RelationshipProperty':
                continue
            # If the column exists in the field dictionary, update its value
            if column.key in fields:
                if self.is_uuid(column.key):
                    setattr(self, column.key, uuid.UUID(fields[column.key]).bytes)
                elif type(column.columns[0].type) == DATETIME:
                    setattr(self, column.key, datetime.datetime.fromisoformat(fields[column.key].replace("Z","+00:00")))
                else:
                    setattr(self, column.key, fields[column.key])

    def get_uuid(self):
        """Returns the text version of the UUID, the binary version is stored in the database"""
        return str(uuid.UUID(bytes=getattr(self, self.__primary_key__)))

    def dump(self, deep=False):
        """Returns dictionary of fields and values"""
        ret = {}
        mapper = inspect(type(self))
        for key, value in vars(self).items():
            column = mapper.attrs.get(key)
            if column and type(column).__name__ == 'RelationshipProperty': continue
            if key in self.__uuid_list__ and value:
                ret[key] = str(uuid.UUID(bytes=value))
            elif column and value and type(column.columns[0].type) == DATETIME:
                # Hacky way of delivering date in iso format in UTC that aligns with Javascript
                ret[key] = value.isoformat()[:-3] + "Z"
            elif not key.startswith('_') and not key in self.__wo_fields__:
                ret[key] = value
        return ret

Base = declarative_base(cls=Base)