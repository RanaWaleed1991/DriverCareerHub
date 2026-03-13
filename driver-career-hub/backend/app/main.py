from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import feed, shifts, profiles, notifications

app = FastAPI(
    title="Driver Career Hub API",
    version="0.1.0",
    description="Backend API for the Driver Career Hub PWA — Melbourne gig-economy drivers",
)

# CORS — allow Amplify + local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://localhost:3000",
        "https://*.amplifyapp.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(feed.router)
app.include_router(shifts.router)
app.include_router(profiles.router)
app.include_router(notifications.router)


@app.get("/health", tags=["system"])
def health_check():
    """Health check endpoint for Railway and monitoring."""
    return {"status": "ok", "service": "driver-career-hub-api"}
