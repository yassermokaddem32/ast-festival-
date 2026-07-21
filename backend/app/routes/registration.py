from fastapi import APIRouter, HTTPException, status
from typing import List
from app.schemas import RegistrationCreate, RegistrationResponse
from app.services.google_sheets import google_sheets_service

router = APIRouter(
    tags=["Registrations"]
)

@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    summary="Register a team for the AST Festival",
    response_model=dict
)
def register_team(payload: RegistrationCreate):
    try:
        # Convert schema model to dictionary
        reg_dict = payload.model_dump()
        
        # Append to Google Sheet
        google_sheets_service.append_registration(reg_dict)
        
        return {
            "status": "success",
            "message": "Team registration successfully submitted to AST Central Database.",
            "team_leader": payload.members[0].name,
            "robot_name": payload.robot_name
        }
    except FileNotFoundError as fnf_err:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(fnf_err)
        )
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit registration: {str(err)}"
        )

@router.get(
    "/registrations",
    response_model=List[RegistrationResponse],
    summary="Retrieve all registrations from Google Sheet"
)
def get_all_registrations():
    try:
        registrations = google_sheets_service.get_registrations()
        return registrations
    except FileNotFoundError as fnf_err:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(fnf_err)
        )
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch registrations: {str(err)}"
        )
