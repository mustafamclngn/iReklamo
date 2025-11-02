from .dbconfig import DB_HOST, DB_DATABASE, DB_PASSWORD, DB_USER
from psycopg2 import pool

connection_pool =   pool.SimpleConnectionPool(
                    1, 10,
                    host=DB_HOST,
                    database=DB_DATABASE,
                    user=DB_USER,
                    password=DB_PASSWORD
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