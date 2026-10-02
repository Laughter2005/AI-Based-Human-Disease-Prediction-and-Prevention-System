"""Authentication and account-management routes."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from core.deps import get_current_user
from core.security import create_access_token, hash_password, verify_password
from db.session import get_db
from models.user import User
from schemas.auth import (
    ChangeEmail,
    ChangePassword,
    Token,
    UpdateProfile,
    UserCreate,
    UserLogin,
    UserRead,
)


router = APIRouter(prefix="/auth", tags=["auth"])


# ---------- Registration / Login ----------
@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = Depends(get_db)) -> User:
    existing = db.scalar(select(User).where(User.email == payload.email.lower()))
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    # New registrations are always "user" — admin accounts must be promoted in DB
    user = User(
        email=payload.email.lower(),
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name,
        preferred_language=payload.preferred_language,
        role="user",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)) -> Token:
    user = db.scalar(select(User).where(User.email == payload.email.lower()))
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is disabled")

    # Verify the user selected the correct role
    if user.role != payload.role:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"This account is not registered as {payload.role}. Please select the correct role.",
        )

    token, expires_in = create_access_token(user.id)
    return Token(access_token=token, expires_in=expires_in, user=UserRead.model_validate(user))


@router.get("/me", response_model=UserRead)
def me(current_user: User = Depends(get_current_user)) -> User:
    return current_user


# ---------- Account management ----------
@router.patch("/me/profile", response_model=UserRead)
def update_profile(
    payload: UpdateProfile,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> User:
    """Update name and preferred language."""
    if payload.full_name is not None:
        current_user.full_name = payload.full_name
    if payload.preferred_language is not None:
        current_user.preferred_language = payload.preferred_language
    db.commit()
    db.refresh(current_user)
    return current_user


@router.patch("/me/email", response_model=UserRead)
def change_email(
    payload: ChangeEmail,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> User:
    """Change the account email (requires current password)."""
    if not verify_password(payload.password, current_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")

    new_email = payload.new_email.lower()
    existing = db.scalar(select(User).where(User.email == new_email, User.id != current_user.id))
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already in use")

    current_user.email = new_email
    db.commit()
    db.refresh(current_user)
    return current_user


@router.patch("/me/password")
def change_password(
    payload: ChangePassword,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    """Change password (requires current password)."""
    if not verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")

    current_user.hashed_password = hash_password(payload.new_password)
    db.commit()
    return {"detail": "Password updated successfully"}