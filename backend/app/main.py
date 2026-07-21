from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes.registration import router as registration_router

app = FastAPI(
    title="AST Festival Registration Backend",
    description="FastAPI Backend integrating Google Sheets for AST Festival registration data.",
    version="1.0.0"
)

# CORS Middleware setup to connect frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=r"https://.*\.vercel\.app|http://localhost:.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routes
app.include_router(registration_router)

@app.get("/", tags=["Health Check"])
def health_check():
    """Health check endpoint to verify backend server status."""
    return {
        "status": "healthy",
        "message": "AST Registration Backend is online and active."
    }
