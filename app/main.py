"""
FastAPI application for Inbox Helper.
"""
from typing import Dict, List, Optional

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.responses import PlainTextResponse
from sqlmodel import Session, select

from app.agent import EmailAgent
from app.gmail_client import GmailClient
from app.models import ThreadDraft, get_session, init_db
from app.utils import extract_email_address, extract_name


app = FastAPI(
    title="Inbox Helper",
    description="A lightweight agentic email assistant",
    version="0.1.0",
)


@app.on_event("startup")
def on_startup():
    """Initialize the database on startup."""
    # === Task-11 =============================
    # Initialize database on startup
    # Hints: Use init_db() function
    raise NotImplementedError("Student TODO - Initialize database")


@app.get("/")
async def root():
    """Root endpoint."""
    # === Task-12 =============================
    # Return welcome message
    # Hints: Return a simple dictionary with a message
    raise NotImplementedError("Student TODO - Return welcome message")


@app.get("/inbox")
async def get_inbox(max_results: int = Query(10, ge=1, le=50, description="Maximum number of emails to return")):
    """Get top emails from the inbox."""
    # === Task-13 =============================
    # Get inbox emails using GmailClient
    # Hints: Use GmailClient.get_inbox_emails()
    raise NotImplementedError("Student TODO - Get inbox emails")


@app.get("/thread/{thread_id}")
async def get_thread(thread_id: str):
    """Get a Gmail thread by ID."""
    # === Task-14 =============================
    # Get thread and extract content
    # Hints: Use GmailClient.get_thread() and extract_thread_content()
    raise NotImplementedError("Student TODO - Get thread")


@app.post("/draft", response_class=PlainTextResponse)
async def generate_draft(
    thread_id: str = Query(..., description="Gmail thread ID"),
    db: Session = Depends(get_session)
):
    """Generate a draft reply for a Gmail thread."""
    # === Task-15 =============================
    # Generate email draft using EmailAgent
    # Hints: Get thread, format context, generate draft, save to database
    raise NotImplementedError("Student TODO - Generate draft")


@app.post("/send/{draft_id}")
async def send_draft(
    draft_id: int,
    db: Session = Depends(get_session)
):
    """Send a draft reply to the email thread."""
    # === Task-16 =============================
    # Send draft reply using GmailClient
    # Hints: Get draft from DB, get thread, send reply, update draft status
    raise NotImplementedError("Student TODO - Send draft")


@app.get("/drafts")
async def list_drafts(
    thread_id: Optional[str] = None,
    db: Session = Depends(get_session)
):
    """List all drafts or drafts for a specific thread."""
    # === Task-17 =============================
    # List drafts from database
    # Hints: Use SQLModel select() with optional thread_id filter
    raise NotImplementedError("Student TODO - List drafts") 