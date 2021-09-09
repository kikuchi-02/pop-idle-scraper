from functools import lru_cache

from fastapi import APIRouter, Depends, FastAPI

from config import Settings
from dependencies import User, get_current_user
from routers import dictionaries, texts
from services import create_connection
from utils.tokens import refresh_tokenizer


@lru_cache()
def get_settings():
    return Settings()


settings = get_settings()
create_connection(
    host=settings.DATABASE.HOST,
    port=settings.DATABASE.PORT,
    db_name=settings.DATABASE.NAME,
    username=settings.DATABASE.USER,
    password=settings.DATABASE.PASSWORD,
)
refresh_tokenizer()

router = APIRouter(prefix="/api/v2")

router.include_router(texts.router, dependencies=[Depends(get_current_user)])
router.include_router(dictionaries.router, dependencies=[Depends(get_current_user)])


@router.get("/")
def read_root():
    return {"hello": "world"}


@router.get("/users/me")
def read_current_user(user: User = Depends(get_current_user)):
    return {"username": user.email}


# uvicorn main:app --reload
app = FastAPI()
app.include_router(router)
