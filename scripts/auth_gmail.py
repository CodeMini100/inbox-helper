#!/usr/bin/env python
"""
A simple script to authenticate with Gmail API and create a credentials file.
"""
import os
import pickle
from pathlib import Path

from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

# Define the scopes
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 
          'https://www.googleapis.com/auth/gmail.send']

# Path to credentials file
CREDENTIALS_FILE = Path('credentials.json')
TOKEN_FILE = Path.home() / '.credentials' / 'gmail.json'


def main():
    """Run the authentication flow."""
    if not CREDENTIALS_FILE.exists():
        print(f"Error: {CREDENTIALS_FILE} not found.")
        print("Please download your OAuth credentials from Google Cloud Console")
        print("and save them as 'credentials.json' in the project root.")
        return
    
    creds = None
    
    # Check if token file exists
    if TOKEN_FILE.exists():
        with open(TOKEN_FILE, 'rb') as token:
            creds = pickle.load(token)
    
    # If credentials don't exist or are invalid, let the user log in
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
        
        # Save the credentials for future use
        os.makedirs(TOKEN_FILE.parent, exist_ok=True)
        with open(TOKEN_FILE, 'wb') as token:
            pickle.dump(creds, token)
    
    print(f"Authentication successful! Credentials saved to {TOKEN_FILE}")


if __name__ == '__main__':
    main() 