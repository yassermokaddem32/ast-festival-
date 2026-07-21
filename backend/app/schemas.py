import re
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field, model_validator, field_validator

# Competition limits mapping
COMPETITION_LIMITS = {
    # Senior Categories
    "line-follower": 3,
    "all-terrain": 4,
    "rocket-league": 4,
    "maze-solver": 3,
    "autonomous-sumo": 4,
    "robot-fighter": 6,
    "aqua-ter-claw": 6,
    # Junior Categories
    "junior-all-terrain": 4,
    "junior-rocket-league": 4,
    "junior-line-follower": 4,
    "junior-dodgeball": 4
}

class MemberSchema(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Full Name of the member")
    phone: str = Field(..., description="Phone number of the member")
    email: EmailStr = Field(..., description="Email address of the member")

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        # Simple phone validation: allows numbers, spaces, dashes, parentheses and a leading plus
        cleaned = re.sub(r'[\s\-()]', '', v)
        if not re.match(r'^\+?[0-9]{7,15}$', cleaned):
            raise ValueError("Phone number must contain between 7 and 15 digits and can optionally start with '+'")
        return v

class RegistrationCreate(BaseModel):
    robot_name: str = Field(..., min_length=2, max_length=100, description="Robot Name (Team Name)")
    division: str = Field(..., description="Competition Division ('senior' or 'junior')")
    category: str = Field(..., description="Competition Category ID")
    school_university: str = Field(..., min_length=2, max_length=150, description="School or University Name")
    additional_notes: Optional[str] = Field(None, max_length=1000, description="Any additional notes or comments")
    members: List[MemberSchema] = Field(..., description="List of team members. The first member is the Team Leader.")

    @field_validator("division")
    @classmethod
    def validate_division(cls, v: str) -> str:
        if v.lower() not in ["senior", "junior"]:
            raise ValueError("Division must be either 'senior' or 'junior'")
        return v.lower()

    @model_validator(mode="after")
    def validate_team_limit(self) -> 'RegistrationCreate':
        cat = self.category.lower()
        div = self.division.lower()
        member_count = len(self.members)

        if member_count < 1:
            raise ValueError("A team must have at least 1 member (the Team Leader)")

        # Determine the maximum crew limit for the category
        limit = COMPETITION_LIMITS.get(cat)
        
        # Fallback if category name doesn't match directly, or starts with junior-
        if limit is None:
            if div == "junior" or cat.startswith("junior-"):
                limit = 4
            else:
                limit = 4  # Default limit fallback

        if member_count > limit:
            raise ValueError(
                f"The maximum member limit for category '{cat}' is {limit}. "
                f"You provided {member_count} members."
            )
        
        return self

class RegistrationResponse(BaseModel):
    id: int
    robot_name: str
    division: str
    category: str
    team_leader: str
    leader_email: str
    leader_phone: str
    member_count: int
    member_names: List[str]
    school_university: str
    additional_notes: Optional[str]
    registration_date: str
