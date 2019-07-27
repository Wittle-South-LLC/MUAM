"""Add profile

Revision ID: b423627c6fe0
Revises: 
Create Date: 2019-07-27 04:54:41.373875

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'b423627c6fe0'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.add_column('User', sa.Column('profiles', sa.JSON))
    op.add_column('Group', sa.Column('profiles', sa.JSON))

def downgrade():
    op.drop_column('User', 'profiles')
    op.drop_column('Group', 'profiles')
