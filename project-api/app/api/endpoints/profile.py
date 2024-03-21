from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps
from app.core.config import settings


from postmarker.core import PostmarkClient
from fastapi.templating import Jinja2Templates


router = APIRouter()
templates = Jinja2Templates(directory="app/templates")


# get current user
@router.get("", response_model=schemas.User)
def read_user_me(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    return current_user


# update current user
@router.put("", response_model=schemas.User)
def update_user_me(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
    request: Request,
) -> Any:
    if user_in.email:
        user_in.email = user_in.email.lower()

    if user_in.email and crud.user.get_by_email(db, email=user_in.email):
        raise HTTPException(
            status_code=400,
            detail="Email already exists",
        )

    user = crud.user.update(db, db_obj=current_user, obj_in=user_in)
    db.add(user)
    db.commit()

    return user


# delete user by id
@router.delete("", response_model=schemas.User)
def delete_user(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    crud.user.remove(db, id=current_user.id)
    return {"message": "User deleted"}
