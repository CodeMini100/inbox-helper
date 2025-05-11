# Inbox Helper

A lightweight agentic email assistant that generates polite, context-aware draft replies to Gmail threads.

## Features

- Read the latest Gmail thread for the authenticated user
- Generate a polite, context-aware draft reply using OpenAI
- Copy-paste or auto-send the draft reply

## Setup

### Prerequisites

- Python 3.10+
- Poetry
- Gmail API credentials

### Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd inbox-helper
   ```

2. Install dependencies:
   ```bash
   poetry install
   ```

3. Set up Gmail API credentials:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable the Gmail API
   - Create OAuth 2.0 credentials (Desktop application)
   - Download the credentials JSON file and save it as `credentials.json` in the project root

4. Set up environment variables:
   - Copy `.env.example` to `.env` and fill in your OpenAI API key:
     ```bash
     cp .env.example .env
     # Edit .env with your API keys
     ```

5. Run the Gmail authentication flow:
   - The first time you run the application, it will prompt you to authenticate with Gmail
   - Follow the instructions to authorize the application
   - This will create a token file at `~/.credentials/gmail.json`

## Running the application

```bash
poetry run uvicorn app.main:app --reload
```

Or using Docker:

```bash
docker-compose up
```

## Usage

1. Get a draft reply for a thread:
   ```bash
   curl -X POST 'http://127.0.0.1:8000/draft?thread_id=YOUR_THREAD_ID'
   ```

2. Send a draft reply:
   ```bash
   curl -X POST 'http://127.0.0.1:8000/send/DRAFT_ID'
   ```

3. List all drafts:
   ```bash
   curl 'http://127.0.0.1:8000/drafts'
   ```

## Testing

```bash
poetry run pytest
poetry run pytest --cov=app
```

## Project Structure

- `app/`: Main application code
  - `main.py`: FastAPI app and routes
  - `settings.py`: Environment settings using Pydantic
  - `gmail_client.py`: Gmail API wrapper
  - `agent.py`: OpenAI integration for generating replies
  - `models.py`: SQLModel tables for SQLite database
  - `utils.py`: Utility functions
- `prompts/`: System prompts for OpenAI
- `tests/`: Test files

## License

MIT 