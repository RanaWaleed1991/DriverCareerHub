import time
from typing import Annotated

import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from jose.utils import base64url_decode

from app.config import Settings, get_settings
from app.models.user import CurrentUser

_bearer = HTTPBearer()

# JWKS cache
_jwks: dict | None = None
_jwks_fetched_at: float = 0
_JWKS_CACHE_TTL = 86400  # 24 hours


def _get_jwks(settings: Settings) -> dict:
    """Fetch and cache Cognito JWKS keys. Refreshes every 24 hours."""
    global _jwks, _jwks_fetched_at
    now = time.time()
    if _jwks is None or (now - _jwks_fetched_at) > _JWKS_CACHE_TTL:
        response = httpx.get(settings.cognito_jwks_url, timeout=10)
        response.raise_for_status()
        _jwks = response.json()
        _jwks_fetched_at = now
    return _jwks


def _find_key(jwks: dict, kid: str) -> dict | None:
    """Find the matching key in the JWKS by key ID."""
    for key in jwks.get("keys", []):
        if key["kid"] == kid:
            return key
    return None


def _verify_cognito_token(token: str, settings: Settings) -> dict:
    """Verify a Cognito JWT and return its claims."""
    try:
        unverified_header = jwt.get_unverified_header(token)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token header",
        )

    kid = unverified_header.get("kid")
    if not kid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing key ID",
        )

    jwks = _get_jwks(settings)
    key = _find_key(jwks, kid)
    if key is None:
        # Key not found — force refresh JWKS once in case keys rotated
        global _jwks_fetched_at
        _jwks_fetched_at = 0
        jwks = _get_jwks(settings)
        key = _find_key(jwks, kid)
        if key is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token signing key not found",
            )

    try:
        claims = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            audience=settings.COGNITO_CLIENT_ID,
            issuer=settings.cognito_issuer,
            options={"verify_at_hash": False},
        )
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token verification failed: {e}",
        )

    return claims


def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(_bearer)],
    settings: Annotated[Settings, Depends(get_settings)],
) -> CurrentUser:
    """FastAPI dependency — extracts and verifies the Bearer token, returns CurrentUser."""
    claims = _verify_cognito_token(credentials.credentials, settings)
    return CurrentUser(
        cognito_sub=claims["sub"],
        email=claims.get("email", ""),
        name=claims.get("name", ""),
    )
