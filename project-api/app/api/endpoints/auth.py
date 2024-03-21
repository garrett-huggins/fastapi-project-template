from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Body, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.core import security
from app.core.config import settings
from app.core.security import get_password_hash
from app.utils import (
    generate_password_reset_token,
    verify_password_reset_token,
)

from postmarker.core import PostmarkClient


router = APIRouter()
templates = Jinja2Templates(directory="app/templates")


# register
@router.post("/user/register", response_model=schemas.User)
def create_user(
    *, db: Session = Depends(deps.get_db), user_in: schemas.UserCreate
) -> Any:
    user_in.email = user_in.email.lower()
    user = crud.user.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="A user with this email already exists in the system.",
        )
    user = crud.user.create(db, obj_in=user_in)
    return user


# log in with email and password (not OAuth2)
@router.post("/user/login", response_model=schemas.Token)
def login_access_token(
    email: str = Body(...),
    password: str = Body(...),
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Login endpoint to get an access token for future requests. Accepts application/json.
    """
    user = crud.user.authenticate(db, email=email, password=password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif crud.user.is_disabled(user):
        raise HTTPException(status_code=400, detail="Disabled user")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "refresh_token": security.create_refresh_token(
            user.id, expires_delta=refresh_token_expires
        ),
        "token_type": "bearer",
    }


# refresh access token
@router.post("/token/refresh", response_model=schemas.Token)
def refresh_access_token(
    obj_in: schemas.RefreshToken,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Refreshes access token with refresh token from Authorization header
    """
    user_id = security.decode_refresh_token(obj_in.refresh_token)
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            current_user.id, expires_delta=access_token_expires
        ),
        "refresh_token": security.create_refresh_token(
            current_user.id, expires_delta=refresh_token_expires
        ),
        "token_type": "bearer",
    }


# log in with OAuth2
@router.post("/docs/login", response_model=schemas.Token)
def login_access_token(
    db: Session = Depends(deps.get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token and refresh token for future requests. Accepts application/x-www-form-urlencoded and is for using the docs authorize feature.
    """
    user = crud.user.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif crud.user.is_disabled(user):
        raise HTTPException(status_code=400, detail="Disabled user")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "refresh_token": security.create_refresh_token(
            user.id, expires_delta=refresh_token_expires
        ),
        "token_type": "bearer",
    }


# password recovery to send email
@router.post("/user/password/forgot")
def recover_password(
    *, email: str, request: Request, db: Session = Depends(deps.get_db)
) -> Any:
    user = crud.user.get_by_email(db, email=email)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this email does not exist in the system.",
        )
    password_reset_token = generate_password_reset_token(email=email)
    template = templates.TemplateResponse(
        "forgot_password.html",
        {
            "request": request,
            "PASSWORD_RESET_TOKEN": password_reset_token,
            "PROJECT_NAME": settings.PROJECT_NAME,
            "COMPANY_ADDRESS": settings.COMPANY_ADDRESS,
            "SUPPORT_EMAIL": settings.SUPPORT_EMAIL,
            "name": user.first_name,
        },
    )
    html_body = template.body.decode("utf-8")

    postmark = PostmarkClient(server_token=settings.POSTMARK_TOKEN)
    postmark.emails.send(
        From="noreply@COMPANY.com",
        To=user.email,
        Subject="COMPANY NAME Password Recovery",
        HtmlBody=html_body,
    )
    return {"msg": "A password recovery email was sent to your email"}


# reset password
@router.post("/user/password/reset", response_model=schemas.Msg)
def reset_password(
    token: str = Body(...),
    new_password: str = Body(...),
    db: Session = Depends(deps.get_db),
) -> Any:
    email = verify_password_reset_token(token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid token")
    user = crud.user.get_by_email(db, email=email)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this email does not exist in the system.",
        )
    elif crud.user.is_disabled(user):
        raise HTTPException(status_code=400, detail="Disabled user")
    hashed_password = get_password_hash(new_password)
    user.hashed_password = hashed_password
    db.add(user)
    db.commit()
    return {"msg": "Password updated successfully"}


# change password
@router.put("/user/password/change", response_model=schemas.Msg)
def change_password(
    *,
    db: Session = Depends(deps.get_db),
    current_password: str = Body(...),
    new_password: str = Body(...),
    current_user: models.User = Depends(deps.get_current_active_user),
    request: Request,
) -> Any:
    if not crud.user.authenticate(
        db, email=current_user.email, password=current_password
    ):
        raise HTTPException(status_code=400, detail="Incorrect current password")
    elif crud.user.is_disabled(current_user):
        raise HTTPException(status_code=400, detail="Disabled user")
    hashed_password = get_password_hash(new_password)
    current_user.hashed_password = hashed_password
    db.add(current_user)
    db.commit()
    template = templates.TemplateResponse(
        "password_change_email.html",
        {
            "request": request,
            "name": current_user.first_name,
            "PROJECT_NAME": settings.PROJECT_NAME,
            "COMPANY_ADDRESS": settings.COMPANY_ADDRESS,
            "SUPPORT_EMAIL": settings.SUPPORT_EMAIL,
        },
    )
    html_body = template.body.decode("utf-8")
    postmark = PostmarkClient(server_token=settings.POSTMARK_TOKEN)
    postmark.emails.send(
        From="noreply@COMPANY.com",
        To=current_user.email,
        Subject="Password Change Confirmation",
        HtmlBody=html_body,
    )

    return {"msg": "Password updated successfully"}
