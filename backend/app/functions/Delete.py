import psycopg2
from controllers.dbconnection import connection
from psycopg2 import errors

class Delete():
    def __init__(self):
        self.params         = []
        self.basequery     = f"DELETE"
        self.table_name   = None
        self.tablequery     = f""
        self.wherequery    = f""
    
    def table(self, table):
        self.table_name = table
        self.tablequery = f"FROM {table}"
        return self
    
    def where(self, whereCol, whereVal):
        self.params.append(whereVal)
        self.wherequery = f"WHERE {whereCol} = %s"
        return self
    
    def execute(self, params = None):
        if params is not None:
            self.params = params

        self.query = " ".join([
                    self.basequery,
                    self.tablequery,
                    self.wherequery
                    ]).strip()
        print("Query:", self.query)
        print("Params:", self.params)

        conn = None
        try:
            conn = connection.get_conn()
            with conn.cursor() as cursor:
                cursor.execute(self.query, self.params)
                conn.commit()
        except errors.ForeignKeyViolation as fke:
            print(f"Error selecting : {fke}")
            if conn:
                conn.rollback()
            raise fke
        except psycopg2.Error as pge:
            print(f"Error selecting : {pge}")
            if conn:
                conn.rollback()
            raise pge
        finally:
            if conn:
                connection.put_conn(conn)