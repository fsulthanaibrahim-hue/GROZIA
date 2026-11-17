from fastapi import Depends, HTTPException, Request
from jose import jwt
import os

SECRET_KEY = os.getenv("SECRET_KEY", "fallback-dev-key-do-not-use-in-prod")
ALGORITHM = "HS256"

def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

def require_role(allowed_roles: list[str]):
    def role_checker(user: dict = Depends(get_current_user)):
        if user.get("role") not in allowed_roles:
            raise HTTPException(status_code=403, detail="Forbidden: Insufficient permissions")
        return user
    return role_checker