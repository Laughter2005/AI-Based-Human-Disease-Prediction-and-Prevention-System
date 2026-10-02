"""Authentication and account schemas."""
from __future__ import annotations

from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


# ---------- Registration / Login ----------
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=72)
    full_name: str | None = Field(None, max_length=120)
    preferred_language: str = Field("en", pattern="^(en|ny)$")


class UserLogin(BaseModel):
    email: EmailStr
    password: str
    role: str = Field("user", pattern="^(user|admin)$")  # for login-page role selector


class UserRead(BaseModel):
    id: int
    email: EmailStr
    full_name: str | None
    role: str
    preferred_language: str
    avatar_url: str | None
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserRead  # include user so the frontend gets everything in one call


# ---------- Account management ----------
class UpdateProfile(BaseModel):
    full_name: str | None = Field(None, max_length=120)
    preferred_language: str | None = Field(None, pattern="^(en|ny)$")


class ChangeEmail(BaseModel):
    new_email: EmailStr
    password: str


class ChangePassword(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8, max_length=72)


# ---------- Admin ----------
class AdminUserUpdate(BaseModel):
    role: str | None = Field(None, pattern="^(user|admin)$")
    is_active: bool | None = None


class UserListResponse(BaseModel):
    total: int
    users: list[UserRead]