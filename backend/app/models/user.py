from app.functions import Insert, Select, Update, Delete

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
            .search(tag="user_id", key=user_id)
            .execute()
            .retDict()
        )
        return self.user

    def getName(self, user_name: str):
        self.user = (
            self.selector
            .table(self.table)
            .search(tag="user_name", key=user_name)
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
    def user_name(self):
        return self.user.get("user_name")

    @user_name.setter
    def user_name(self, value):
        self.user["user_name"] = value

    @property
    def first_name(self):
        return self.user.get("first_name")

    @first_name.setter
    def first_name(self, value):
        self.user["first_name"] = value

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
    def contact_number(self):
        return self.user.get("contact_number")

    @contact_number.setter
    def contact_number(self, value):
        self.user["contact_number"] = value

    @property
    def barangay(self):
        return self.user.get("barangay")

    @barangay.setter
    def barangay(self, value):
        self.user["barangay"] = value

    @property
    def role_id(self):
        return self.user.get("role_id")  # FIXED: database column is "role" not "user_role"

    @role_id.setter
    def role_id(self, value):
        self.user["role_id"] = value  # FIXED: database column is "role" not "user_role"

    @property
    def position(self):
        return self.user.get("position")  # FIXED: database column is "position" not "user_position"

    @position.setter
    def position(self, value):
        self.user["position"] = value  # FIXED: database column is "position" not "user_position"

    @property
    def user_password(self):
        return self.user.get("user_password")

    @user_password.setter
    def user_password(self, value):
        self.user["user_password"] = value

    # ====================
    # ACTIONS
    # ========
    
    def add(self, data: dict):
        self.insertor\
            .table("users")\
            .values(data)\
            .execute()
         
    def edit(self, user_id, updates: dict):
        self.editor\
            .table("users")\
            .set(updates)\
            .where("user_id", user_id)\
            .execute()
        
    def delete(self, user_id):
        self.deleter\
            .table("users")\
            .where("user_id", user_id)\
            .execute()