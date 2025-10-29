from controllers.dbconnection import connection

class Update():
    def __init__(self):
        self.params         = []
        self.basequery      = f"UPDATE"
        self.tablequery  = f""
        self.setquery     = f""
        self.wherequery    = f""
        self.table_name = None
        self.columns = []
        self.rows = []
        self.aliascolumn = {}

    def table(self, table):
        self.table_name = table
        self.tablequery = f"{table}"
        return self
    
    def set(self, set):
        self.setquery = ""
        self.params = []
        clauses = []

        for key, val in set.items():
            self.params.append(f"{val}")
            clauses.append(f"{key} = %s")
            self.setquery = "SET " + ", ".join(clauses)

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
                    self.setquery,
                    self.wherequery
                    ]).strip()
        print(self.query)

        conn = None
        try:
            conn = connection.get_conn()
            with conn.cursor() as cursor:
                cursor.execute(self.query, self.params)
                conn.commit()
                return self
        except Exception as exception:
            print(f"Error selecting : {exception}")
            if conn:
                conn.rollback()
        finally:
            if conn:
                connection.put_conn(conn)
            return self