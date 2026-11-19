from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session
from jose import jwt, JWTError
import os
from dotenv import load_dotenv

from database import get_db
import models

load_dotenv()

# No fallback: refuse to start without a real secret.
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY or len(SECRET_KEY) < 32:
    raise RuntimeError("SECRET_KEY must be set in .env and be at least 32 characters")
ALGORITHM = "HS256"


def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(
            token, SECRET_KEY, algorithms=[ALGORITHM], options={"require_exp": True}
        )
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    if not payload.get("sub"):
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload


def require_role(allowed_roles: list[str]):
    def role_checker(user: dict = Depends(get_current_user)):
        if user.get("role") not in allowed_roles:
            raise HTTPException(status_code=403, detail=f"Forbidden: Role {user.get('role')} not allowed")
        return user
    return role_checker


def require_page(page: str):
    def page_checker(user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
        db_user = db.query(models.User).filter(models.User.email == user.get("sub")).first()
        if not db_user:
            raise HTTPException(status_code=401, detail="User no longer exists")
        assigned = (
            db.query(models.UserPage.id)
            .filter(models.UserPage.user_id == db_user.id, models.UserPage.page == page)
            .first()
        )
        if not assigned:
            raise HTTPException(status_code=403, detail=f"Forbidden: page '{page}' is not assigned to your account")
        return user
    return page_checker
