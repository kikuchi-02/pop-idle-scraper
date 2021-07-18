import secrets
from typing import List

import yaml
from fastapi import (APIRouter, Depends, FastAPI, HTTPException, Response,
                     status)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from pydantic import BaseModel

from lib import ConstituencyIn, ConstituencyOut, constituency_parse

with open("../envs.yaml", "r") as f:
    try:
        settings = yaml.safe_load(f)
    except yaml.YamlError as exc:
        raise Exception(f"yaml load error {exc}")

if not (settings.get("USERNAME") and settings.get("PASSWORD")):
    raise Exception("You must specify USERNAME, PASSWORD")

security = HTTPBasic()


def get_current_username(
        credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(credentials.username,
                                              settings["USERNAME"])
    correct_password = secrets.compare_digest(credentials.password,
                                              settings["PASSWORD"])
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username


router = APIRouter(prefix="/api/v2",
                   dependencies=[Depends(get_current_username)])


@router.get("/")
def read_root():
    return {"hello": "world"}


@router.get("/users/me")
def read_current_user(username: str = Depends(get_current_username)):
    return {"username": username}


@router.post("/constituency-parse", response_model=List[List[ConstituencyOut]])
def read_constituency_parse(item: ConstituencyIn):
    result = constituency_parse(item.textBlocks)
    return result


# uvicorn main:app --reload
app = FastAPI()
app.include_router(router)
