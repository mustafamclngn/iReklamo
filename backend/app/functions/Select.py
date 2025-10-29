from controllers.dbconnection import connection

class Select():
    def __init__(self):
        self.params         = []
        self.basequery      = f"SELECT "
        self.columnquery    = f""
        self.tablequery     = f""
        self.searchquery    = f""
        self.groupquery     = f""
        self.sortquery      = f""
        self.limitquery     = f""
        self.offsetquery = f""
        self.countquery = f""
        self.table_name = None
        self.columns = []
        self.rows = []
        self.aliascolumn = {}
    
    def table(self, table):
        self.table_name = table
        self.tablequery = f"FROM {table}"
        self.columns = connection.get_columns(f"{table}")
        self.columnquery = ", ".join([f"{table}.{col}" for col in self.columns])
        return self
    
    def limit(self, limit):
        self.limitquery = f"LIMIT {limit}"
        return self
    
    def offset(self, offset):
        self.offsetquery = f"OFFSET {offset*10}"
        return self

    def group(self, group):
        self.groupquery = f"GROUP BY {group}"
        return self
    
    def count(self, count):
        self.countquery = (f"COUNT {count}", "COUNT (*)")
        return self
    
    def sort(self, sort_column, sort_order):
        if sort_column == "name":
            self.sortquery = f"ORDER BY last_name {sort_order}"
        else:
            self.sortquery = f"ORDER BY {sort_column} {sort_order}"
        return self
    
    def special_col(self, spec_col):
        self.columnquery    = ", ".join([f"{col}" for col in spec_col])
        self.columns = [col.split(" AS ")[-1].split(".")[-1] for col in spec_col]
        return self
    
    def search(self, tag = None, key = None, table = None, search_mult = {}):
        self.searchquery = ""
        self.params = []

        if table is None:
            table = self.table_name

        if search_mult:
            conditions = []
            for col, val in search_mult.items():
                search_tag = self.aliascolumn.get(col, f"{table}.{col}")
                if col == "year_level":
                    conditions.append(f"{search_tag} = %s")
                    self.params.append(int(val))
                elif val == "Male":  
                    conditions.append(f"{search_tag} = %s")
                    self.params.append(val)
                else:
                    conditions.append(f"{search_tag} LIKE %s")
                    self.params.append(f"%{val}%")
            self.searchquery = "WHERE " + " OR ".join(conditions)

        elif tag and key:
            search_tag = self.aliascolumn.get(tag, f"{table}.{tag}")
            self.searchquery = f"WHERE {search_tag} LIKE %s "
            if tag == "year_level":
                self.searchquery = f"WHERE {search_tag} = %s"
                self.params.append(int(key))
            elif key == "Male":
                self.params.append(f"{key}")
            else:
                self.params.append(f"%{key}%")

        elif key:            
            searchAll = [f"{col} LIKE %s" for col in self.columns]
            self.params.extend([f"%{key}%"] * len(self.columns))
            self.searchquery = "WHERE " + " OR ".join(searchAll)
        
        return self
    
    def execute(self, params = None):
        if params is not None:
            self.params = params

        else:
            self.params = self.params or [] 
            
        self.query = " ".join([
                    self.basequery,
                    self.countquery,
                    self.columnquery,
                    self.tablequery,
                    self.searchquery,
                    self.groupquery,
                    self.sortquery,
                    self.limitquery,
                    self.offsetquery
                    ]).strip()
        print(self.query)
        print(self.params)

        conn = None
        try:
            conn = connection.get_conn()
            with conn.cursor() as cursor:
                cursor.execute(self.query, self.params)
                self.rows = cursor.fetchall()
                return self
        except Exception as exception:
            print(f"Error selecting : {exception}")
            if conn:
                conn.rollback()
        finally:
            if conn:
                connection.put_conn(conn)
                
            return self
        
    def retData(self):
        return self.rows
    
    def retCols(self):
        return self.columns
    
    def retAll(self):
        return self.rows, self.columns
    
    def retDict(self):
        return [dict(zip(self.columns, row)) for row in self.rows] 
    
    def tableCols(self):
        if not hasattr(self, "columns") or not self.columns:
            raise ValueError("Table is not initialized.")
        
        return [col for col in self.columns]