from typing import List, Optional

from pydantic import BaseModel
from typing_extensions import Literal


class User(BaseModel):
    id: int
    name: str
    email: str
    password: str


class WordInformation(BaseModel):
    id: int
    word: str
    pronunciation: str


class WordInformationBody(WordInformation):
    id: Optional[int]
    change: Optional[Literal["create", "update", "delete"]] = None


class DictionaryBody(BaseModel):
    dictionary: List[WordInformationBody]


class ScriptBody(BaseModel):
    text: str
