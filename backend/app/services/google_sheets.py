import os
import json
import datetime
from typing import List, Dict, Any
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from app.config import settings

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
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
    "Registration Date",
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
                raise ValueError(
                    "GOOGLE_SHEET_ID is not configured in the environment."
                )

            credentials_raw = os.getenv("GOOGLE_CREDENTIALS_JSON", "").strip()

            if credentials_raw:
                # Remove surrounding quotes if env var was wrapped in single or double quotes
                if (credentials_raw.startswith('"') and credentials_raw.endswith('"')) or (credentials_raw.startswith("'") and credentials_raw.endswith("'")):
                    credentials_raw = credentials_raw[1:-1].strip()

                try:
                    credentials_info = json.loads(credentials_raw)
                    if isinstance(credentials_info, str):
                        credentials_info = json.loads(credentials_info)
                except Exception as json_err:
                    # Fallback: extract the JSON object within curly braces if extra characters exist
                    start_idx = credentials_raw.find('{')
                    end_idx = credentials_raw.rfind('}')
                    if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
                        clean_json = credentials_raw[start_idx : end_idx + 1]
                        credentials_info = json.loads(clean_json)
                    else:
                        raise ValueError(f"Failed to parse GOOGLE_CREDENTIALS_JSON environment variable: {json_err}")

                creds = service_account.Credentials.from_service_account_info(
                    credentials_info,
                    scopes=SCOPES,
                )
            else:
                if not os.path.exists(self.creds_file):
                    raise FileNotFoundError(
                        f"Google credentials file not found: {self.creds_file}"
                    )

                creds = service_account.Credentials.from_service_account_file(
                    self.creds_file,
                    scopes=SCOPES,
                )

            self._service = build("sheets", "v4", credentials=creds)

        return self._service

    def initialize_headers_if_empty(self):
        """Checks if the sheet is empty and writes headers if necessary."""
        try:
            service = self.get_service()
            sheet = service.spreadsheets()

            result = sheet.values().get(
                spreadsheetId=self.sheet_id,
                range=f"'{self.sheet_name}'!A1:J1",
            ).execute()

            rows = result.get("values", [])

            if not rows or len(rows[0]) == 0:
                body = {"values": [HEADERS]}
                sheet.values().update(
                    spreadsheetId=self.sheet_id,
                    range=f"'{self.sheet_name}'!A1:J1",
                    valueInputOption="RAW",
                    body=body,
                ).execute()

        except HttpError as err:
            if err.resp.status == 400 and "parse" in str(err):
                try:
                    self.create_tab()
                except Exception:
                    pass
            raise err

    def create_tab(self):
        """Creates worksheet if it doesn't exist."""
        service = self.get_service()

        body = {
            "requests": [
                {
                    "addSheet": {
                        "properties": {
                            "title": self.sheet_name
                        }
                    }
                }
            ]
        }

        service.spreadsheets().batchUpdate(
            spreadsheetId=self.sheet_id,
            body=body,
        ).execute()

        headers_body = {"values": [HEADERS]}

        service.spreadsheets().values().update(
            spreadsheetId=self.sheet_id,
            range=f"'{self.sheet_name}'!A1:J1",
            valueInputOption="RAW",
            body=headers_body,
        ).execute()

    def append_registration(self, reg_data: Dict[str, Any]) -> Dict[str, Any]:
        service = self.get_service()

        try:
            self.initialize_headers_if_empty()
        except Exception as e:
            print(f"Header initialization warning: {e}")

        members = reg_data.get("members", [])
        team_leader = members[0] if members else {}
        other_member_names = [m.get("name") for m in members[1:]]
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
            reg_data.get("additional_notes", ""),
            datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        ]

        body = {"values": [row_values]}

        try:
            return service.spreadsheets().values().append(
                spreadsheetId=self.sheet_id,
                range=f"'{self.sheet_name}'!A:J",
                valueInputOption="RAW",
                insertDataOption="INSERT_ROWS",
                body=body,
            ).execute()

        except HttpError as err:
            raise RuntimeError(
                f"Google Sheets API Error: {err.reason if hasattr(err,'reason') else err}"
            )

    def get_registrations(self) -> List[Dict[str, Any]]:
        service = self.get_service()

        try:
            self.initialize_headers_if_empty()
        except Exception:
            pass

        try:
            result = service.spreadsheets().values().get(
                spreadsheetId=self.sheet_id,
                range=f"'{self.sheet_name}'!A:J",
            ).execute()

            rows = result.get("values", [])

            if not rows or len(rows) <= 1:
                return []

            headers = rows[0]
            registrations = []

            for idx, row in enumerate(rows[1:], start=1):
                row_padded = row + [""] * (len(headers) - len(row))

                member_names = (
                    [x.strip() for x in row_padded[6].split(",")]
                    if row_padded[6]
                    else []
                )

                registrations.append(
                    {
                        "id": idx,
                        "robot_name": row_padded[0],
                        "division": (
                            "junior"
                            if row_padded[4].startswith("junior-")
                            else "senior"
                        ),
                        "category": row_padded[4],
                        "team_leader": row_padded[1],
                        "leader_email": row_padded[2],
                        "leader_phone": row_padded[3],
                        "member_count": (
                            int(row_padded[5])
                            if row_padded[5].isdigit()
                            else 1
                        ),
                        "member_names": member_names,
                        "school_university": row_padded[7],
                        "additional_notes": row_padded[8],
                        "registration_date": row_padded[9],
                    }
                )

            return registrations

        except HttpError as err:
            raise RuntimeError(
                f"Google Sheets API Error: {err.reason if hasattr(err,'reason') else err}"
            )


google_sheets_service = GoogleSheetsService()
