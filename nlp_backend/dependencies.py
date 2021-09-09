from functools import lru_cache

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from config import Settings
from models import User
from services import get_cursor

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@lru_cache()
def get_settings():
    return Settings()


def get_user(user_id: str) -> User:
    with get_cursor() as cursor:
        cursor.execute(
            'SELECT * FROM "user" WHERE "id" = %(user_id)s;', {"user_id": user_id}
        )
        row = cursor.fetchone()
        if row is None:
            return None
        columns = [col[0] for col in cursor.description]
        data = dict(zip(columns, row))
        user = User(
            id=data["id"],
            name=data["name"],
            email=data["email"],
            password=data["password"],
        )
        return user


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    settings: Settings = Depends(get_settings),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET, algorithms=["HS256"])
        user_id: str = payload.get("userId")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user(user_id)
    if user is None:
        raise credentials_exception
    return user
