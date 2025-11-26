from flask import current_app, make_response, request, jsonify
from flask_mail import Message
from app.config import Config
from werkzeug.security import check_password_hash, generate_password_hash
import random
import string
import jwt
import datetime
from app.models.user import User
from app.controllers.auth.viewUserC import view_user, view_user_nameemail
from app.functions.Update import Update
from app.controllers.auth.emailC import email_details

# ========================== 
# USER REGISTER
# ==========
def register_user():
    # ===============
    # fetch: request
    data = request.get_json()

    username = data.get('user')
    email = data.get('email')
    barangay = data.get('barangay')
    position = data.get('position')
    role = data.get('role')

    # check: fields provided
    if not username or not email:
        return jsonify({"error": "Missing username or emailquired fields"}), 400
    
    # ===============
    # generate random password
    random_str = ''.join(random.choices(string.ascii_letters, k=15))
    random_pwd = generate_password_hash(random_str)

    # ===============
    # check for duplicates
    existing_username = view_user_nameemail(username)

    if existing_username:
        return jsonify({"error": "User already exists"}), 409
    
    existing_email = view_user_nameemail(email)

    if existing_email:
        return jsonify({"error": "Email already in use"}), 409
    
    # ===============
    # insert new user
    user = User()
    user.add({
        "user_name": username,
        "email": email,
        "first_name": "N/A",
        "last_name": "N/A",
        "barangay_id": int(barangay),
        "position": position,
        "role_id": int(role),
        # "user_password": generate_password_hash("admin123")
        "user_password": random_pwd # Uncomment for randomized password, email notification system
    })

    email_details(username, email, random_str)

    return jsonify({
        "message": "User registered successfully",
        "username": username,
        "email": email,
        # "temporary_password": random_str
    }), 201

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

    print("User data:", user_data)
    print("Stored hash:", stored_hash)
    print("pwd:", pwd)

    if not check_password_hash(stored_hash, pwd):
        return jsonify({"error": "Invalid password"}), 401
    
    # ===============
    # fetch: role, token_version, id
    role = [user_data.get("role_id")]  
    user_id = user_data.get("user_id")
    token_version = user_data.get("token_version", 0)

    # ===============
    # create: access token
    access_token = jwt.encode(
        {
            "user_id": user_id,
            "role": role,
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
            "role": role,
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
        
        "accessToken": access_token,
        "role": role,
        "user": {
            "user_id": user_data["user_id"],
            "username": user_data["user_name"],
            "email": user_data["email"],
            "first_name": user_data["first_name"],
            "last_name": user_data["last_name"],
            "position": user_data.get("position"),  # FIXED: changed from "user_position" to "position"
            "contact_number": user_data.get("contact_number"),
            "barangay_id": user_data.get("barangay_id")
        },
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
        
        role = [user_data.get("role_id")]  

        new_access_token = jwt.encode(
            {
            "user_id": user_id,
            "role": role,
            "token_version":token_version,
            "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=2)
        },
        Config.JWT_SECRET_KEY,
        algorithm="HS256"
    )
        
        return jsonify({
            "accessToken": new_access_token,
            "role": role,
            "user": {
                "user_id": user_data["user_id"],
                "username": user_data["user_name"],
                "email": user_data["email"],
                "first_name": user_data["first_name"],
                "last_name": user_data["last_name"],
                "position": user_data.get("position"),  # FIXED: changed from "user_position" to "position"
                "barangay_id": user_data.get("barangay_id")
            }
        }), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Refresh token expired"}), 403
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid refresh token"}), 403