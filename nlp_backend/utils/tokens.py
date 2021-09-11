import os
from typing import List

from janome.tokenizer import Tokenizer
from models import WordInformation
from services import get_cursor

_tokenizer: Tokenizer = None


def refresh_tokenizer(dictionary: List[WordInformation] = None):
    global _tokenizer

    if dictionary is None:
        with get_cursor() as cursor:
            cursor.execute('SELECT * FROM "word_information"')
            rows = cursor.fetchall()
            columns = [col[0] for col in cursor.description]
            dictionary = [
                WordInformation(**{key: value for key, value in zip(columns, row)})
                for row in rows
            ]

    if dictionary:
        # 東京スカイツリー,カスタム名詞,トウキョウスカイツリー
        udic_path = os.path.join(os.getcwd(), "data", "udic.csv")
        with open(udic_path, "w") as f:
            f.writelines(
                (f"{token.word},カスタム名詞,{token.pronunciation}\n" for token in dictionary)
            )
        _tokenizer = Tokenizer(udic=udic_path, udic_type="simpledic")
    else:
        _tokenizer = Tokenizer()


def get_tokenizer():
    global _tokenizer
    return _tokenizer
