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

## Core
The **Core module** (`app/main.py`) serves as the main entry point for the FastAPI application. It initializes the database, sets up API endpoints, and coordinates between the email agent and Gmail client modules. This module is responsible for handling HTTP requests and managing the application's state.

### How It Fits into the Overall Architecture
- **Entry Point**: Initializes FastAPI application and database
- **Request Handling**: Processes HTTP requests and coordinates responses
- **State Management**: Manages database sessions and application state
- **Error Handling**: Provides consistent error responses across endpoints

Below are the key tasks within this module.

### Task: Database Initialization
The `on_startup` function is responsible for initializing the database when the application starts.

- **Inputs**: None
- **Outputs**: None
- **Expected Behavior**: Database tables are created and ready for use

Conceptual approach:
1. Call the database initialization function
2. Ensure tables are created
3. Handle any initialization errors

<details>
<summary>Hint: Database Initialization Pattern</summary>

```python
def on_startup():
    init_db()  # Initialize database tables
```
</details>

### Task: Welcome Endpoint
The `root` endpoint provides a simple welcome message to verify the application is running.

- **Inputs**: None
- **Outputs**: JSON response with welcome message
- **Expected Behavior**: Returns a simple welcome message

Conceptual approach:
1. Create a dictionary with welcome message
2. Return the dictionary as JSON response

<details>
<summary>Hint: Welcome Endpoint Pattern</summary>

```python
@app.get("/")
async def root():
    return {"message": "Welcome to Inbox Helper"}
```
</details>

## Email Agent
The **Email Agent module** (`app/agent.py`) is responsible for generating AI-powered email responses using OpenAI's API. It handles the formatting of email threads and manages the interaction with the language model.

### How It Fits into the Overall Architecture
- **AI Integration**: Manages OpenAI API interactions
- **Context Processing**: Formats email threads for AI processing
- **Response Generation**: Creates appropriate email responses
- **Prompt Management**: Handles system prompts for the AI

### Task: Initialize Agent
The `__init__` function sets up the OpenAI client and loads the system prompt.

- **Inputs**: Optional system prompt file path
- **Outputs**: None
- **Expected Behavior**: OpenAI client is initialized and system prompt is loaded

Conceptual approach:
1. Initialize OpenAI client with API key
2. Load system prompt from file
3. Store both for later use

<details>
<summary>Hint: Agent Initialization Pattern</summary>

```python
def __init__(self, system_prompt_file: Path = None):
    self.client = OpenAI(api_key=settings.openai_api_key)
    self.system_prompt = self._load_system_prompt(system_prompt_file)
```
</details>

## Gmail Client
The **Gmail Client module** (`app/gmail_client.py`) handles all interactions with the Gmail API, including authentication, email retrieval, and sending responses.

### How It Fits into the Overall Architecture
- **Gmail Integration**: Manages Gmail API interactions
- **Authentication**: Handles OAuth2 flow and token management
- **Email Operations**: Retrieves and sends emails
- **Thread Management**: Processes email threads and messages

### Task: Initialize Gmail Client
The `__init__` function sets up the Gmail API client and handles authentication.

- **Inputs**: Optional credentials path
- **Outputs**: None
- **Expected Behavior**: Gmail service is initialized and authenticated

Conceptual approach:
1. Store credentials path
2. Get Gmail service
3. Handle authentication flow

<details>
<summary>Hint: Gmail Client Initialization Pattern</summary>

```python
def __init__(self, credentials_path: Optional[Path] = None):
    self.credentials_path = credentials_path or settings.gmail_credentials_path
    self.service = self._get_gmail_service()
```
</details>

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

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Gmail API Documentation](https://developers.google.com/gmail/api)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [SQLModel Documentation](https://sqlmodel.tiangolo.com/) 