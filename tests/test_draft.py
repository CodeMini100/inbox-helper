"""
Tests for the draft functionality.
"""
import pytest
from unittest.mock import patch, MagicMock

from app.agent import EmailAgent
from app.gmail_client import GmailClient


@pytest.mark.asyncio
async def test_get_thread(client, sample_thread_data):
    """Test getting a thread."""
    with patch.object(GmailClient, 'get_thread', return_value=sample_thread_data), \
         patch.object(GmailClient, 'extract_thread_content', return_value=sample_thread_data["messages"]):
        
        response = await client.get("/thread/thread1")
        
        assert response.status_code == 200
        data = response.json()
        assert data["thread_id"] == "thread1"
        assert len(data["messages"]) == 1
        assert data["messages"][0]["from"] == "Jane Smith <jane.smith@example.com>"


@pytest.mark.asyncio
async def test_generate_draft(client, sample_thread_data):
    """Test generating a draft reply."""
    draft_text = "Hi Jane, I'm available at 2 PM tomorrow. See you then!"
    
    with patch.object(GmailClient, 'get_thread', return_value=sample_thread_data), \
         patch.object(GmailClient, 'extract_thread_content', return_value=sample_thread_data["messages"]), \
         patch.object(EmailAgent, 'format_thread_for_context', return_value="Thread context"), \
         patch.object(EmailAgent, 'generate_draft', return_value=draft_text):
        
        response = await client.post("/draft?thread_id=thread1")
        
        assert response.status_code == 200
        assert response.text == draft_text


@pytest.mark.asyncio
async def test_generate_draft_empty_thread(client):
    """Test generating a draft for an empty thread."""
    with patch.object(GmailClient, 'get_thread', return_value={"messages": []}), \
         patch.object(GmailClient, 'extract_thread_content', return_value=[]):
        
        response = await client.post("/draft?thread_id=empty_thread")
        
        assert response.status_code == 404
        data = response.json()
        assert "Thread has no messages" in data["detail"]


@pytest.mark.asyncio
async def test_send_draft(client, sample_draft):
    """Test sending a draft."""
    sample_thread_data = {
        "messages": [
            {
                "id": "msg1",
                "threadId": "thread1",
                "payload": {
                    "headers": [
                        {"name": "From", "value": "Jane Smith <jane.smith@example.com>"},
                        {"name": "Subject", "value": "Meeting Request"}
                    ]
                }
            }
        ]
    }
    
    with patch.object(GmailClient, 'get_thread', return_value=sample_thread_data), \
         patch.object(GmailClient, 'extract_thread_content') as mock_extract, \
         patch.object(GmailClient, 'send_reply', return_value={"id": "msg2"}):
        
        # Mock the extract_thread_content method
        mock_extract.return_value = [
            {
                "id": "msg1",
                "thread_id": "thread1",
                "from": "Jane Smith <jane.smith@example.com>",
                "subject": "Meeting Request"
            }
        ]
        
        response = await client.post(f"/send/{sample_draft.id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Draft sent successfully"
        assert data["message_id"] == "msg2"


@pytest.mark.asyncio
async def test_send_nonexistent_draft(client):
    """Test sending a non-existent draft."""
    response = await client.post("/send/999")
    
    assert response.status_code == 404
    data = response.json()
    assert "Draft not found" in data["detail"]


@pytest.mark.asyncio
async def test_list_drafts(client, sample_draft):
    """Test listing all drafts."""
    response = await client.get("/drafts")
    
    assert response.status_code == 200
    data = response.json()
    assert len(data["drafts"]) == 1
    assert data["drafts"][0]["thread_id"] == "thread1"


@pytest.mark.asyncio
async def test_list_drafts_by_thread(client, sample_draft):
    """Test listing drafts for a specific thread."""
    response = await client.get("/drafts?thread_id=thread1")
    
    assert response.status_code == 200
    data = response.json()
    assert len(data["drafts"]) == 1
    assert data["drafts"][0]["thread_id"] == "thread1"
    
    # Test with a non-existent thread
    response = await client.get("/drafts?thread_id=nonexistent")
    
    assert response.status_code == 200
    data = response.json()
    assert len(data["drafts"]) == 0 