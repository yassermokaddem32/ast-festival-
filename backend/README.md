# AST Festival Landing Page - Backend API

This is the FastAPI backend service for the **AST Festival** landing page. It manages team registrations, validates constraints, and stores records in Google Sheets using the official Google Sheets API.

---

## Features

- **Google Sheets Database:** No SQL database setup required. All data is appended to Google Sheets in real-time.
- **Strict Validations:** Validates email and phone number formats, required fields, and crew size constraints based on the selected competition category.
- **FastAPI Endpoints:**
  - `GET /`: Health check.
  - `POST /register`: Accepts and validates registration form payloads.
  - `GET /registrations`: Retrieves all registrants currently in the Google Sheet.
- **Automated Headers:** Automatically creates the worksheet tab and sets up required headers if the worksheet is empty.

---

## Project Structure

```
backend/
├── app/
│   ├── main.py              # Application entrypoint (CORS & routers)
│   ├── config.py            # Environment configurations loader
│   ├── schemas.py           # Pydantic validation schemas
│   ├── routes/
│   │   └── registration.py  # API route definitions
│   └── services/
│       └── google_sheets.py # Google Sheets integration service
├── .env.example             # Environment template file
├── credentials.json.example # Google service account key template
├── requirements.txt         # Package dependencies
└── README.md                # Setup documentation
```

---

## Setup Instructions

### 1. Python & Virtual Environment Setup
Ensure you have Python 3.9+ installed.

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - **Windows PowerShell:**
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **Windows CMD:**
     ```cmd
     .\venv\Scripts\activate.bat
     ```
   - **macOS / Linux:**
     ```bash
     source venv/bin/activate
     ```

4. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

---

### 2. Google Cloud Platform & Google Sheets Setup

To write registrations into a Google Sheet, you need a Service Account credentials file (`credentials.json`) and an active Google Sheet.

#### Step A: Enable API & Create Service Account
1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new Google Cloud Project (or select an existing one).
3. In the Left Menu, search for **APIs & Services** > **Library**. Search for **Google Sheets API** and click **Enable**.
4. Search for **Google Drive API** and click **Enable** (optional, recommended).
5. Go to **APIs & Services** > **Credentials**.
6. Click **+ CREATE CREDENTIALS** at the top, and select **Service account**.
7. Provide a name (e.g. `ast-sheets-service`), then click **Create and Continue**. Skip the optional role assignments and click **Done**.
8. In the Service Accounts list, click on the newly created Service Account email address.
9. Go to the **Keys** tab, click **ADD KEY** > **Create new key**. Select **JSON** format, and click **Create**.
10. A JSON file will be downloaded to your computer. Rename this file to `credentials.json` and place it inside the `backend/` root directory.

#### Step B: Set Up Your Google Sheet
1. Create a new sheet in Google Sheets (or use an existing one).
2. Copy the Spreadsheet ID from the URL. The URL format is:
   `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit`
3. Click the **Share** button in the top-right corner of your Google Sheet.
4. Paste your Service Account's email address (found in your `credentials.json` as `client_email`) and grant it **Editor** permissions. This allows the backend to write to your Sheet.

---

### 3. Environment Variables
1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open the `.env` file and replace the values:
   - Set `GOOGLE_SHEET_ID` to the Spreadsheet ID copied from your Google Sheet URL.
   - Set `GOOGLE_SHEET_NAME` to your worksheet tab (e.g. `Sheet1`).
   - If needed, adjust `CORS_ORIGINS_RAW` to match your frontend server URL.

---

## Running the API Server

Start the local server using Uvicorn with auto-reload:

```bash
uvicorn app.main:app --reload --port 8000
```

Once running:
- **Interactive Documentation:** Visit `http://127.0.0.1:8000/docs` to view the Swagger API UI and test the endpoints directly.
- **Health Check:** Open `http://127.0.0.1:8000/` in your browser.

---

## Competition Crew Limits

The backend automatically rejects registrations exceeding the following constraints:
- **Line Follower:** Max 3 members
- **All Terrain:** Max 4 members
- **Rocket League:** Max 4 members
- **Maze Solver:** Max 3 members
- **Autonomous Sumo:** Max 4 members
- **Robot Fighter:** Max 6 members
- **Aqua Ter Claw:** Max 6 members
- **Junior Categories:** Max 4 members
