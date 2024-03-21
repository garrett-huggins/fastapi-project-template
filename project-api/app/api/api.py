from fastapi import APIRouter

from app.api.endpoints import (
    auth,
    admin,
    profile,
)


api_router = APIRouter()
api_router.include_router(auth.router, tags=["Auth"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin Only"])
api_router.include_router(profile.router, prefix="/profile", tags=["Profile"])
