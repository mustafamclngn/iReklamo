from flask import request, jsonify
from app.config import Config
from werkzeug.security import check_password_hash
import jwt
import datetime
from models.user import User

# ========================== 
# USER VIEW
# ==========
def view_user(user_id):
    user = User()         
    data = user.getID(user_id)  

    if not data:
        return jsonify({"error": "User not found"}), 404

    return jsonify(data), 200

def view_user_nameemail(user_id):
    user = User() 

    if "@" in user_id:
        data = user.getEmail(user_id)  
    else:
        data = user.getName(user_id)  

    if not data:
        return jsonify({"error": "User not found"}), 404

    return jsonify(data), 200

def view_role(user_id):
    user = User()
    user.getID(user_id)  
    role = user.role

    return jsonify({"role" : role}), 200

def login():
    data = request.get_json()

    identity = data.get("identity")
    pwd = data.get("pwd")

    if not identity or not pwd:
        return jsonify({"error": "Missing username/email or password"}), 400

    user_data = view_user_nameemail(identity)

    stored_hash = user_data.get("password")
    if not check_password_hash(stored_hash, pwd):
        return jsonify({"error": "Invalid password"}), 401
    
    token = jwt.encode(
        {
            "user_id": user_data["id"],
            "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=2)
        },
        Config.JWT_SECRET_KEY,
        algorithm="HS256"
    )

    roles = user_data.get("role") or "user"

    return jsonify({
        "message": "Login successful",
        "user": {
            "user_id": user_data["user_id"],
            "username": user_data["username"],
            "email": user_data["email"],
            "first_name": user_data["first_name"],
            "middle_name": user_data["middle_name"],
            "last_name": user_data["last_name"],
            "position": user_data["position"],
        },
        "roles": roles,
        "accessToken": token
    }), 200
    





