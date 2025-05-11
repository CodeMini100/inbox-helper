"""
Test fixtures for pytest.
"""
import asyncio
from typing import AsyncGenerator, Generator

import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from app.main import app as fastapi_app
from app.models import ThreadDraft


@pytest.fixture(name="engine")
def engine_fixture():
    """Create a SQLite in-memory database engine for testing."""
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    return engine


@pytest.fixture(name="session")
def session_fixture(engine):
    """Create a new database session for testing."""
    with Session(engine) as session:
        yield session


@pytest.fixture(name="app")
def app_fixture():
    """Create a FastAPI app for testing."""
    fastapi_app.dependency_overrides = {}  # Clear any existing overrides
    return fastapi_app


@pytest.fixture(name="client")
async def client_fixture(app: FastAPI) -> AsyncGenerator[AsyncClient, None]:
    """Create an async HTTP client for testing."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client
        
        
@pytest.fixture(name="sample_thread_data")
def sample_thread_data_fixture():
    """Sample thread data for testing."""
    return {
        "messages": [
            {
                "id": "msg1",
                "thread_id": "thread1",
                "date": "2023-01-01T12:00:00Z",
                "from": "Jane Smith <jane.smith@example.com>",
                "to": "test@example.com",
                "subject": "Meeting Request",
                "body": "Hi,\n\nCan we schedule a meeting tomorrow at 2 PM?\n\nThanks,\nJane"
            }
        ]
    }


@pytest.fixture(name="sample_draft")
def sample_draft_fixture(session):
    """Create a sample draft in the database."""
    draft = ThreadDraft(
        thread_id="thread1",
        draft_text="Hi Jane,\n\nYes, I'm available tomorrow at 2 PM for our meeting.\n\nBest,\nTest User"
    )
    session.add(draft)
    session.commit()
    session.refresh(draft)
    return draft 