import math
from flask import request, jsonify
from app.functions import Select
from app.models.user import User
from app.controllers.auth.emailC import email_newpwd
from app.controllers.auth.revokeTokenC import generate_reset_token

# ========================== 
# USER LIST
# ==========
def userList(): 
    
    tag = request.args.get('tag', '')
    key = request.args.get('key', '')
    sort = request.args.get('sort') or "user_id"
    order = request.args.get('order', 'asc')
    limit = int(request.args.get('size', 10)) 
    page = int(request.args.get('page', 0))

    selector = Select()   

    total       = selector\
                        .table("user")\
                        .search(tag, key)\
                        .execute()\
                        .retDict()
    contents = selector\
                        .table("users")\
                        .search(tag, key)\
                        .limit(limit)\
                        .offset(page)\
                        .sort(sort, order)\
                        .execute()\
                        .retDict()

    return jsonify({
        "data": contents,
        "total": len(total),
        "page": page,
        "limit": limit,
        "totalPages": math.ceil(len(total) / limit)
    }), 200

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
    role = user.role

    return jsonify({"role" : role}), 200

# ========================== 
# USER PASSWORD FORGOT
# ==========
def user_forgot_pwd():
    
    data = request.get_json()
    identity = data.get("identity")

    user = view_user_nameemail(identity)
    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        reset_token = generate_reset_token(user["user_id"])
        print("RESET TOKEN", reset_token)
        user_name = user.get("user_name")
        user_email = user.get("email")

        reset_link = f"http://localhost:5173/auth/reset-password?token={reset_token}"

        email_newpwd(user_name, user_email, reset_link)

        return jsonify({
            "success":True,
            "message":"New temporary password has been sent to your email.",
        }), 200

    except Exception as err:
        return jsonify({
        "error": str(err),
    }), 500
