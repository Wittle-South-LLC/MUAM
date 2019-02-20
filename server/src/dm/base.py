"""base.py - Module creating shared declarative base for object-relational model"""
import datetime
import re
import logging
import uuid
from sqlalchemy.ext.declarative import declarative_base, declared_attr
from sqlalchemy import Column, DateTime, inspect, text

LOGGER=logging.getLogger('appLogger')

def to_snakecase(value):
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', value)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()

class Base(object):
    @declared_attr
    def __tablename__(cls):
        return cls.__name__

    __table_args__ = {'mysql_charset':'utf8'}
    record_created = Column(DateTime,
                            server_default=text('CURRENT_TIMESTAMP'))
    record_updated = Column(DateTime,
                            server_default=text('CURRENT_TIMESTAMP'),
                            onupdate=datetime.datetime.now)

    def assign_id(self):
        """Initializes the object"""
        LOGGER.info('assign_id for {}'.format(type(self).__name__))
        setattr(self, to_snakecase(type(self).__name__) + '_id', uuid.uuid4().bytes)

    def apply_update(self, fields):
        """Applies a dict to the fields in this object"""
        mapper = inspect(type(self))
        for column in mapper.attrs:
            # Skip columns that are relationships
            if type(column.class_attribute.property).__name__ == 'RelationshipProperty':
                continue
            # If the column exists in the field dictionary, update its value
            if column.key in fields:
                setattr(self, column.key, fields[column.key])

    def get_uuid(self):
        """Returns the text version of the UUID, the binary version is stored in the database"""
        return str(uuid.UUID(bytes=getattr(self, to_snakecase(type(self).__name__) + '_id')))

Base = declarative_base(cls=Base)

