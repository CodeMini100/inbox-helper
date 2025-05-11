"""
Database models using SQLModel (SQLAlchemy + Pydantic).
"""
from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel, create_engine, Session

from app.settings import settings


class ThreadDraft(SQLModel, table=True):
    """A draft reply generated for a Gmail thread."""
    
    id: Optional[int] = Field(default=None, primary_key=True)
    thread_id: str = Field(index=True)
    draft_text: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    sent: bool = Field(default=False)


# Initialize database engine
engine = create_engine(settings.database_url)


def init_db():
    """Create all tables."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Get a database session."""
    with Session(engine) as session:
        yield session 