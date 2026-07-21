import os
import datetime
from typing import List, Dict, Any
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from app.config import settings

SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
]

HEADERS = [
    "Team Name",
    "Team Leader",
    "Leader Email",
    "Leader Phone",
    "Competition",
    "Number of Members",
    "Member Names",
    "School / University",
    "Additional Notes",
    "Registration Date"
]

class GoogleSheetsService:
    def __init__(self):
        self.sheet_id = settings.GOOGLE_SHEET_ID
        self.sheet_name = settings.GOOGLE_SHEET_NAME
        self.creds_file = settings.GOOGLE_CREDENTIALS_FILE
        self._service = None

    def get_service(self):
        """Initializes and returns the Google Sheets API client."""
        if self._service is None:
            if not self.sheet_id:
                raise ValueError("GOOGLE_SHEET_ID is not configured in the environment settings (.env).")
            
            if not os.path.exists(self.creds_file):
                raise FileNotFoundError(
                    f"Google Service Account credentials file not found at '{self.creds_file}'. "
                    f"Please place your credentials.json file in the backend directory."
                )
            
            creds = service_account.Credentials.from_service_account_file(
                self.creds_file, scopes=SCOPES
            )
            self._service = build('sheets', 'v4', credentials=creds)
        return self._service

    def initialize_headers_if_empty(self):
        """Checks if the sheet is empty and writes headers if necessary."""
        try:
            service = self.get_service()
            sheet = service.spreadsheets()
            
            # Read first row
            result = sheet.values().get(
                spreadsheetId=self.sheet_id,
                range=f"'{self.sheet_name}'!A1:J1"
            ).execute()
            
            rows = result.get('values', [])
            if not rows or len(rows[0]) == 0:
                # Write headers
                body = {'values': [HEADERS]}
                sheet.values().update(
                    spreadsheetId=self.sheet_id,
                    range=f"'{self.sheet_name}'!A1:J1",
                    valueInputOption="RAW",
                    body=body
                ).execute()
        except HttpError as err:
            # If tab doesn't exist, we try to create it or raise
            if err.resp.status == 400 and "parse" in str(err):
                # Tab might not exist, attempt to add sheet
                try:
                    self.create_tab()
                except Exception:
                    pass
            raise err

    def create_tab(self):
        """Attempts to create a worksheet tab with the specified sheet_name."""
        service = self.get_service()
        body = {
            'requests': [
                {
                    'addSheet': {
                        'properties': {
                            'title': self.sheet_name
                        }
                    }
                }
            ]
        }
        service.spreadsheets().batchUpdate(
            spreadsheetId=self.sheet_id,
            body=body
        ).execute()
        
        # Write headers to new tab
        headers_body = {'values': [HEADERS]}
        service.spreadsheets().values().update(
            spreadsheetId=self.sheet_id,
            range=f"'{self.sheet_name}'!A1:J1",
            valueInputOption="RAW",
            body=headers_body
        ).execute()

    def append_registration(self, reg_data: Dict[str, Any]) -> Dict[str, Any]:
        """Appends a single registration row to the Google Sheet."""
        service = self.get_service()
        
        # Ensure headers exist
        try:
            self.initialize_headers_if_empty()
        except Exception as e:
            # Log header check failure but proceed
            print(f"Header initialization warning: {e}")

        # Map reg_data dict to flat row array matching headers
        members = reg_data.get("members", [])
        team_leader = members[0] if len(members) > 0 else {}
        other_member_names = [m.get("name") for m in members[1:]] if len(members) > 1 else []
        member_names_str = ", ".join(other_member_names)

        row_values = [
            reg_data.get("robot_name", ""),
            team_leader.get("name", ""),
            team_leader.get("email", ""),
            team_leader.get("phone", ""),
            reg_data.get("category", ""),
            len(members),
            member_names_str,
            reg_data.get("school_university", ""),
            reg_data.get("additional_notes", "") or "",
            datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        ]

        body = {
            'values': [row_values]
        }
        
        try:
            result = service.spreadsheets().values().append(
                spreadsheetId=self.sheet_id,
                range=f"'{self.sheet_name}'!A:J",
                valueInputOption="RAW",
                insertDataOption="INSERT_ROWS",
                body=body
            ).execute()
            return result
        except HttpError as err:
            raise RuntimeError(f"Google Sheets API Error: {err.reason if hasattr(err, 'reason') else err}")

    def get_registrations(self) -> List[Dict[str, Any]]:
        """Reads all rows from the Google Sheet and maps them to a list of dicts."""
        service = self.get_service()
        
        # Make sure headers exist
        try:
            self.initialize_headers_if_empty()
        except Exception:
            pass

        try:
            result = service.spreadsheets().values().get(
                spreadsheetId=self.sheet_id,
                range=f"'{self.sheet_name}'!A:J"
            ).execute()
            
            rows = result.get('values', [])
            if not rows or len(rows) <= 1:
                return []
            
            # Map rows (excluding header A1:J1)
            registrations = []
            headers = rows[0]
            
            for idx, row in enumerate(rows[1:], start=1):
                # Handle cases where some row fields are empty (Google Sheets returns shorter arrays)
                row_padded = row + [""] * (len(headers) - len(row))
                
                # Split other member names back to list of strings
                member_names_raw = row_padded[6]
                member_names = [name.strip() for name in member_names_raw.split(",")] if member_names_raw else []

                reg = {
                    "id": idx,
                    "robot_name": row_padded[0],
                    "division": "junior" if row_padded[4].startswith("junior-") else "senior",
                    "category": row_padded[4],
                    "team_leader": row_padded[1],
                    "leader_email": row_padded[2],
                    "leader_phone": row_padded[3],
                    "member_count": int(row_padded[5]) if row_padded[5].isdigit() else 1,
                    "member_names": member_names,
                    "school_university": row_padded[7],
                    "additional_notes": row_padded[8],
                    "registration_date": row_padded[9]
                }
                registrations.append(reg)
            
            return registrations
        except HttpError as err:
            raise RuntimeError(f"Google Sheets API Error: {err.reason if hasattr(err, 'reason') else err}")

google_sheets_service = GoogleSheetsService()
