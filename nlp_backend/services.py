from contextlib import contextmanager
from typing import ContextManager

from psycopg2.pool import SimpleConnectionPool

connection_pool: SimpleConnectionPool = None


def create_connection(
    host: str, port: int, db_name: str, username: str, password: str
) -> SimpleConnectionPool:
    global connection_pool
    connection_pool = SimpleConnectionPool(
        minconn=2,
        maxconn=5,
        host=host,
        port=port,
        dbname=db_name,
        user=username,
        password=password,
    )


@contextmanager
def get_cursor() -> ContextManager:
    connection = connection_pool.getconn()
    try:
        with connection:
            with connection.cursor() as cursor:
                yield cursor
    finally:
        connection_pool.putconn(connection)
