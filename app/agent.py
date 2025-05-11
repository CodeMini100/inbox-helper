"""
Agent module for generating email replies using OpenAI's API.
"""
import os
from pathlib import Path
from typing import Dict, List

from openai import OpenAI

from app.settings import settings


class EmailAgent:
    """Agent to generate email reply drafts using OpenAI."""
    
    def __init__(self, system_prompt_file: Path = None):
        """Initialize the email agent."""
        # === Task-01 =============================
        # Initialize OpenAI client and load system prompt
        # Hints: Use settings.openai_api_key for authentication
        raise NotImplementedError("Student TODO - Initialize OpenAI client and load system prompt")
        
    def _load_system_prompt(self, prompt_file: Path = None) -> str:
        """Load the system prompt from a file."""
        # === Task-02 =============================
        # Load system prompt from file or use default
        # Hints: Check if file exists, handle default path
        raise NotImplementedError("Student TODO - Load system prompt from file")
    
    def format_thread_for_context(self, messages: List[Dict]) -> str:
        """Format email thread for context."""
        # === Task-03 =============================
        # Format email thread messages into a readable context
        # Hints: Include subject, from, to, and body for each message
        raise NotImplementedError("Student TODO - Format thread messages")
    
    def generate_draft(self, thread_context: str) -> str:
        """Generate a draft reply using the OpenAI API."""
        # === Task-04 =============================
        # Generate email draft using OpenAI API
        # Hints: Use chat completions API with system and user messages
        raise NotImplementedError("Student TODO - Generate email draft") 