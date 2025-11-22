"""
API Dependencies
Common dependencies for FastAPI routes.
"""
from typing import Optional
from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from models.database import get_db
from utils.geofencing import GeoFencingService
from core.config import get_settings
import logging

settings = get_settings()
logger = logging.getLogger(__name__)


async def verify_geo_location(request: Request) -> bool:
    """
    Dependency to verify user's geographic location.
    Ensures compliance with state-specific betting laws.

    Args:
        request: FastAPI request object

    Returns:
        True if location is approved

    Raises:
        HTTPException: If location is not approved
    """
    # Get client IP address
    client_ip = request.client.host

    # Check X-Forwarded-For header if behind proxy
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        client_ip = forwarded.split(",")[0].strip()

    logger.info(f"Geo-fencing check for IP: {client_ip}")

    # Check geo-fencing
    geo_service = GeoFencingService()
    is_allowed, reason = geo_service.check_access(client_ip)

    if not is_allowed:
        logger.warning(f"Geo-fence violation: {client_ip} - {reason}")
        raise HTTPException(
            status_code=status.HTTP_451_UNAVAILABLE_FOR_LEGAL_REASONS,
            detail={
                "error": "Location not approved",
                "message": reason,
                "approved_states": geo_service.get_approved_states()
            }
        )

    return True


async def get_current_user(
    db: AsyncSession = Depends(get_db),
    # In production, add token authentication here
    # token: str = Depends(oauth2_scheme)
) -> Optional[dict]:
    """
    Dependency to get current authenticated user.

    TODO: Implement proper authentication with JWT tokens.

    For now, returns None (unauthenticated access allowed for public data).

    Args:
        db: Database session
        token: JWT token (to be implemented)

    Returns:
        User object or None
    """
    # Placeholder for authentication
    # In production, decode JWT token and fetch user from database
    return None


def get_rate_limit_key(request: Request) -> str:
    """
    Get rate limiting key for a request.

    Uses IP address as the key. In production, consider using
    user ID for authenticated users.

    Args:
        request: FastAPI request object

    Returns:
        Rate limit key (IP address)
    """
    return request.client.host
