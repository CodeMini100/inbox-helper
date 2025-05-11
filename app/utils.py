"""
Utility functions for the Inbox Helper application.
"""
from typing import List, Dict, Optional
import re


def extract_email_address(email_string: str) -> Optional[str]:
    """Extract email address from a string like 'Name <email@example.com>'."""
    pattern = r'<([^>]+)>'
    match = re.search(pattern, email_string)
    
    if match:
        return match.group(1)
    
    # Check if the string is just an email
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if re.match(email_pattern, email_string.strip()):
        return email_string.strip()
    
    return None


def extract_name(email_string: str) -> str:
    """Extract name from a string like 'Name <email@example.com>'."""
    pattern = r'(.+?)\s*<'
    match = re.search(pattern, email_string)
    
    if match:
        return match.group(1).strip()
    
    # If no name found, use email address or original string
    email = extract_email_address(email_string)
    if email:
        return email.split('@')[0]  # Use part before @ as name
    
    return email_string.strip()


def truncate_text(text: str, max_length: int = 100) -> str:
    """Truncate text to the specified length."""
    if len(text) <= max_length:
        return text
    
    return text[:max_length - 3] + "..." 