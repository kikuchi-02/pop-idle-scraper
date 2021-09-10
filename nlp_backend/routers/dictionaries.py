from itertools import chain
from typing import Optional

from fastapi import APIRouter, Body
from models import DictionaryBody, WordInformation
from services import get_cursor
from utils.tokens import refresh_tokenizer

router = APIRouter()


@router.get("/dictionary")
def get_dictionary(
    pageIndex: int = 0, pageSize: int = 10, search: Optional[str] = None
):
    if search is not None:
        with get_cursor() as cursor:
            cursor.execute(
                """
                SELECT COUNT(*) FROM "word_information" WHERE "word" LIKE %s
                """,
                (f"%{search}%",),
            )
            count = cursor.fetchone()[0]

            cursor.execute(
                """
                SELECT * FROM "word_information" WHERE "word" LIKE %s ORDER BY id DESC LIMIT %s OFFSET %s
                """,
                (f"%{search}%", pageSize, pageSize * pageIndex),
            )
            rows = cursor.fetchall()
            columns = [col[0] for col in cursor.description]
    else:
        with get_cursor() as cursor:
            cursor.execute('SELECT COUNT(*) FROM "word_information"')
            count = cursor.fetchone()[0]

            cursor.execute(
                cursor.mogrify(
                    'SELECT * FROM "word_information" ORDER BY id DESC LIMIT %s OFFSET %s',
                    (pageSize, pageSize * pageIndex),
                )
            )
            rows = cursor.fetchall()
            columns = [col[0] for col in cursor.description]

    dictionary = [
        WordInformation(**{key: value for key, value in zip(columns, row)})
        for row in rows
    ]

    return {
        "data": dictionary,
        "count": count,
        "pageIndex": pageIndex,
        "pageSize": pageSize,
    }


@router.put("/dictionary")
def put_dictionary(body: DictionaryBody = Body(..., embedded=True)):
    delete_ids = body.deleteIds
    create_or_update_words = []

    for word in [*body.newWords, *body.updateWords]:
        create_or_update_words.append((word.word, word.pronunciation))

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
