"""create pgvector extension

Revision ID: 5fdb5c5e03f6
Revises: 9b1553519e52
Create Date: 2025-08-11 10:57:33.461242

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5fdb5c5e03f6'
down_revision: Union[str, Sequence[str], None] = '9b1553519e52'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("CREATE EXTENSION IF NOT EXISTS vector;")


def downgrade() -> None:
    """Downgrade schema."""
    pass
