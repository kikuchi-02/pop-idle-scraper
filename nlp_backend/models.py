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


class DictionaryBody(BaseModel):
    newWords: List[WordInformationBody]
    updateWords: List[WordInformationBody]
    deleteIds: List[int]


class ScriptBody(BaseModel):
    text: str
