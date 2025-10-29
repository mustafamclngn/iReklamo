from functions import Insert, Select, Update, Delete

class User():
    def __init__(self, table="users", tag = None, key = None, limit = None, offset = None):
        self.table = table
        self.tag = tag
        self.key = key
        self.limit = limit
        self.offset = offset        
        self.selector = Select.Select()
        self.insertor = Insert.Insert()
        self.editor    = Update.Update()
        self.deleter  = Delete.Delete()
        self.user = {}  

    # ====================
    # GETTERS
    # ========
    def getID(self, user_id: int):
        self.user = (
            self.selector
            .table(self.table)
            .search(tag="id", key=user_id)
            .execute()
            .retDict()
        )
        return self.user

    def getName(self, user_name: str):
        self.user = (
            self.selector
            .table(self.table)
            .search(tag="username", key=user_name)
            .execute()
            .retDict()
        )
        return self.user
    
    def getEmail(self, user_email: str):
        self.user = (
            self.selector
            .table(self.table)
            .search(tag="email", key=user_email)
            .execute()
            .retDict()
        )
        return self.user

    # ====================
    # PROPERTIES
    # ========
    @property
    def user_id(self):
        return self.user.get("user_id")

    @property
    def username(self):
        return self.user.get("username")

    @username.setter
    def username(self, value):
        self.user["username"] = value

    @property
    def first_name(self):
        return self.user.get("first_name")

    @first_name.setter
    def first_name(self, value):
        self.user["first_name"] = value

    @property
    def middle_name(self):
        return self.user.get("middle_name")

    @middle_name.setter
    def middle_name(self, value):
        self.user["middle_name"] = value

    @property
    def last_name(self):
        return self.user.get("last_name")

    @last_name.setter
    def last_name(self, value):
        self.user["last_name"] = value

    @property
    def email(self):
        return self.user.get("email")

    @email.setter
    def email(self, value):
        self.user["email"] = value

    @property
    def role(self):
        return self.user.get("role")

    @role.setter
    def role(self, value):
        self.user["role"] = value

    @property
    def position(self):
        return self.user.get("position")

    @position.setter
    def position(self, value):
        self.user["position"] = value

    @property
    def password(self):
        return self.user.get("password")

    @password.setter
    def password(self, value):
        self.user["password"] = value

    # ====================
    # ACTIONS
    # ========
    
    def add(self, data: dict):
        self.insertor\
            .table("users")\
            .values(data)\
            .execute()
         
    def edit(self, user_code, updates: dict):
        self.editor\
            .table("users")\
            .set(updates)\
            .where("user_code", user_code)\
            .execute()
        
    def delete(self, user_code):
        self.deleter\
            .table("users")\
            .where("user_code", user_code)\
            .execute()
