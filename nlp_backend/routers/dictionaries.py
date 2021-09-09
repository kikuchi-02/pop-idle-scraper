from itertools import chain

from fastapi import APIRouter, Body
from models import DictionaryBody, WordInformation
from services import get_cursor
from utils.tokens import refresh_tokenizer

router = APIRouter()


@router.get("/dictionary")
def get_dictionary():
    with get_cursor() as cursor:
        cursor.execute('SELECT * FROM "word_information"')
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]
        dictionary = [
            WordInformation(**{key: value for key, value in zip(columns, row)})
            for row in rows
        ]

    return {"dictionary": dictionary}


@router.put("/dictionary")
def put_dictionary(body: DictionaryBody = Body(..., embedded=True)):
    delete_ids = []
    create_or_update_words = []
    for token in body.dictionary:
        if token.change == "delete" and token.id is not None:
            delete_ids.append(token.id)
        elif (
            token.change in ["create", "update"]
            and token.word is not None
            and token.pronunciation is not None
        ):
            create_or_update_words.append((token.word, token.pronunciation))

    if delete_ids or create_or_update_words:
        with get_cursor() as cursor:
            if delete_ids:
                sql = cursor.mogrify(
                    'DELETE FROM "word_information" WHERE id IN %s;',
                    (tuple(delete_ids),),
                )
                cursor.execute(sql)

            if create_or_update_words:
                sql = cursor.mogrify(
                    'INSERT INTO "word_information" ("word", "pronunciation")'
                    + " VALUES "
                    + ",".join(("(%s, %s)" for _ in range(len(create_or_update_words))))
                    + ' ON CONFLICT ("word") '
                    + " DO UPDATE SET "
                    + '"pronunciation" = EXCLUDED."pronunciation"',
                    tuple(chain.from_iterable(create_or_update_words)),
                )
                cursor.execute(sql)

    with get_cursor() as cursor:
        cursor.execute('SELECT * FROM "word_information"')
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]
        dictionary = [
            WordInformation(**{key: value for key, value in zip(columns, row)})
            for row in rows
        ]

    if delete_ids or create_or_update_words:
        refresh_tokenizer(dictionary)

    return {"dictionary": dictionary}
