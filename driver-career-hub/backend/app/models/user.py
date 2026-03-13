from pydantic import BaseModel


class CurrentUser(BaseModel):
    """Authenticated user extracted from Cognito JWT."""

    cognito_sub: str
    email: str
    name: str


class UserProfile(BaseModel):
    """Public user profile."""

    cognito_sub: str
    email: str
    name: str
    display_name: str | None = None
    bio: str | None = None
    avatar_url: str | None = None
    platforms: list[str] = []  # e.g. ["uber", "didi", "ola"]
    joined_at: str | None = None


class UserProfileUpdate(BaseModel):
    """Fields allowed when updating a profile."""

    display_name: str | None = None
    bio: str | None = None
    avatar_url: str | None = None
    platforms: list[str] | None = None
