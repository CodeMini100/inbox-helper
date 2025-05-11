# Inbox Helper - Educational Guide

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install -e .
   ```
3. Set up environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `GMAIL_CREDENTIALS_PATH`: Path to store Gmail OAuth credentials

## Project Overview

Inbox Helper is a FastAPI application that helps manage and respond to emails using AI. The project is broken down into 17 tasks that build upon each other to create a complete email assistant.

## Task Breakdown

### Email Agent (Tasks 1-4)
- **Task-01**: Initialize OpenAI client and load system prompt
- **Task-02**: Load system prompt from file
- **Task-03**: Format email thread messages
- **Task-04**: Generate email drafts using OpenAI

### Gmail Client (Tasks 5-10)
- **Task-05**: Initialize Gmail client
- **Task-06**: Set up Gmail API authentication
- **Task-07**: Get Gmail thread by ID
- **Task-08**: Retrieve inbox emails
- **Task-09**: Extract thread content
- **Task-10**: Send email replies

### API Endpoints (Tasks 11-17)
- **Task-11**: Database initialization
- **Task-12**: Welcome endpoint
- **Task-13**: Inbox retrieval
- **Task-14**: Thread retrieval
- **Task-15**: Draft generation
- **Task-16**: Draft sending
- **Task-17**: Draft listing

## Implementation Workflow

1. Read the task banner in the code
2. Review the hints provided
3. Implement the functionality
4. Run tests to verify implementation
5. Commit your changes
6. Move to the next task

## Testing

Run tests with:
```bash
pytest
```

Tests are marked with `@pytest.mark.xfail` if they require future implementation.

## Completion Criteria

The project is complete when:
1. All tests pass
2. No linter errors
3. All tasks are implemented
4. The application can:
   - Retrieve emails from Gmail
   - Generate AI-powered replies
   - Send email responses
   - Manage email drafts

## Key Concepts

- FastAPI for web endpoints
- Gmail API for email operations
- OpenAI API for AI-powered responses
- SQLModel for database operations
- OAuth2 for Gmail authentication

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Gmail API Documentation](https://developers.google.com/gmail/api)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [SQLModel Documentation](https://sqlmodel.tiangolo.com/) 