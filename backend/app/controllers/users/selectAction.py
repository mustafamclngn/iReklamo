import math
from flask import make_response, request, jsonify
from app.functions import Select
from app.models.user import User
from app.controllers.auth.emailC import email_newpwd
from werkzeug.security import check_password_hash, generate_password_hash
import random
import string

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
def userForgotPwd(identity):
    user_details = view_user_nameemail(identity)

    try:
        user_name = user_details.get("user_name")
        user_email = user_details.get("email")

        # ===============
        # generate random password
        random_str = ''.join(random.choices(string.ascii_letters, k=15))
        random_pwd = generate_password_hash(random_str)

        email_newpwd(user_name, user_email, random_str)

        return jsonify({
            "message": "New temporary password has been sent to your email.",
        }), 200

    except Exception as err:
        return jsonify({
        "error": str(err),
    }), 500
