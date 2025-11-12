import os
from psycopg2 import pool
from dotenv import load_dotenv

load_dotenv()

DB_CONFIG = {
    "host": os.getenv("DATABASE_HOST", "localhost"),
    "port": int(os.getenv("DATABASE_PORT", 5432)),
    "database": os.getenv("DATABASE_NAME"),
    "user": os.getenv("DATABASE_USER"),
    "password": os.getenv("DATABASE_PASSWORD")
}

connection_pool = pool.SimpleConnectionPool(
    1, 10, **DB_CONFIG
)

def get_conn():
    return connection_pool.getconn()

def put_conn(conn):
    if conn:
        connection_pool.putconn(conn)

def get_columns(table, schema="public"):
    
    query = """
        SELECT a.attname
        FROM pg_attribute a
        JOIN pg_class c ON a.attrelid = c.oid
        JOIN pg_namespace n ON c.relnamespace = n.oid
        WHERE n.nspname = %s
          AND c.relname = %s
          AND a.attnum > 0
          AND NOT a.attisdropped
        ORDER BY a.attnum;
    """
    conn = None
    try:
        conn = get_conn()
        with conn.cursor() as cursor:
            cursor.execute(query, (schema, table))
            return [row[0] for row in cursor.fetchall()]
    finally:
        put_conn(conn)