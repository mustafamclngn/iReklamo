from flask import make_response, request, jsonify
from app.config import Config
from werkzeug.security import check_password_hash
import jwt
import datetime
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

# ========================== 
# USER LOGIN
# ==========
def login_user():
    # ===============
    # fetch: request
    data = request.get_json()
    print(request)

    # check: fields provided
    identity = data.get("identity")
    pwd = data.get("pwd")

    if not identity or not pwd:
        return jsonify({"error": "Missing username/email or password"}), 400

    # ===============
    # check: user existing
    user_data = view_user_nameemail(identity)

    if not user_data:
        return jsonify({"error": "User not found"}), 404

    # ===============
    # fetch: hashed password
    stored_hash = user_data.get("user_password")
    if not check_password_hash(stored_hash, pwd):
        return jsonify({"error": "Invalid password"}), 401
    
    # ===============
    # fetch: user_role
    roles = [user_data.get("user_role") or "user"]

    # ===============
    # create: access token
    access_token = jwt.encode(
        {
            "user_id": user_data["user_id"],
            "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=2)
        },
        Config.JWT_SECRET_KEY,
        algorithm="HS256"
    )

    # ===============
    # create: refresh token
    refresh_token = jwt.encode(
        {
            "user_id": user_data["user_id"],
            "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7)
        },
        Config.JWT_SECRET_KEY,
        algorithm="HS256"
    )

    # ===============
    # create: response
    response = make_response(jsonify({
        "message": "Login successful",
        "user": {
            "user_id": user_data["user_id"],
            "username": user_data["user_name"],
            "email": user_data["email"],
            "first_name": user_data["first_name"],
            "middle_name": user_data["middle_name"],
            "last_name": user_data["last_name"],
            "position": user_data["user_position"],
        },
        "roles": roles,
        "accessToken": access_token
        }))
    
    print(response)

    response.set_cookie(
        "refreshToken",
        value=refresh_token,
        httponly=True,
        secure=True,  
        samesite="None",  
        max_age=7 * 24 * 60 * 60
    )

    return response, 200
     
# ========================== 
# USER TOKEN REFRESH
# ==========
def refresh_token():
    refresh_token = request.cookies.get("refreshToken")

    if not refresh_token:
        return jsonify({"error": "No refresh token provided"}), 401

    try:
        decoded = jwt.decode(refresh_token, Config.JWT_SECRET_KEY, algorithms=["HS256"])
        user_id = decoded.get("user_id")

        user_data = view_user(user_id)
        if not user_data:
            return jsonify({"error": "User not found"}), 404

        new_access_token = jwt.encode(
            {
                "user_id": user_id,
                "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=2)
            },
            Config.JWT_SECRET_KEY,
            algorithm="HS256"
        )

        role = user_data.get("user_role") or "user"
        return jsonify({
            "accessToken": new_access_token,
            "roles": [role]
        }), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Refresh token expired"}), 403
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid refresh token"}), 403





