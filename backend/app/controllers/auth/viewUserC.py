from flask import jsonify
from app.models.user import User

# ========================== 
# USER VIEW
# ==========
def view_user(user_id):
    user = User()         
    data = user.getID(user_id)  

    return data

def view_user_nameemail(user_id):
    user = User() 

    if "@" in user_id:
        data = user.getEmail(user_id)  
    else:
        data = user.getName(user_id)  

    return data

def view_role(user_id):
    user = User()
    user.getID(user_id)  
    role = user.user_role

    return jsonify({"role" : role}), 200