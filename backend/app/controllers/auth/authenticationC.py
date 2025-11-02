from flask import make_response, request, jsonify
from app.config import Config
from werkzeug.security import check_password_hash
import jwt
import datetime
from app.models.user import User
from backend.app.controllers.auth.viewUserC import view_user, view_user_nameemail
from backend.app.functions.Update import Update

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
    # fetch: user_role, token_version, id
    roles = [user_data.get("role") or "user"]  
    user_id = user_data.get("user_id")
    token_version = user_data.get("token_version", 0)

    # ===============
    # create: access token
    access_token = jwt.encode(
        {
            "user_id": user_id,
            "user_role": roles,
            "token_version":token_version,
            "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=2)
        },
        Config.JWT_SECRET_KEY,
        algorithm="HS256"
    )

    # ===============
    # create: refresh token
    refresh_token = jwt.encode(
        {
            "user_id": user_id,
            "token_version":token_version,
            "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7)
        },
        Config.JWT_SECRET_KEY,
        algorithm="HS256"
    )

    # ===============
    # store refresh token in db
    updater = Update()
    updater.table("users").set({
        "refresh_token": refresh_token
        }).where(whereCol="user_id", whereVal=user_id).execute()

    # ===============
    # create: response
    response = make_response(jsonify({
        "message": "Login successful",
        "user": {
            "user_id": user_data["user_id"],
            "username": user_data["user_name"],
            "email": user_data["email"],
            "first_name": user_data["first_name"],
            "last_name": user_data["last_name"],
            "position": user_data.get("position"),  # FIXED: changed from "user_position" to "position"
            "contact_number": user_data.get("contact_number"),
            "barangay": user_data.get("barangay")
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
        token_version = decoded.get("token_version")

        user_data = view_user(user_id)
        
        if not user_data:
            return jsonify({"error": "User not found"}), 404
        
        if user_data.get("token_version") != token_version:
            return jsonify({"message": "Token revoked or invalid"}), 403
        
        role = user_data.get("role") or "user"

        new_access_token = jwt.encode(
            {
            "user_id": user_id,
            "user_role": role,
            "token_version":token_version,
            "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=2)
        },
        Config.JWT_SECRET_KEY,
        algorithm="HS256"
    )

        return jsonify({
            "accessToken": new_access_token,
            "roles": [role]
        }), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Refresh token expired"}), 403
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid refresh token"}), 403