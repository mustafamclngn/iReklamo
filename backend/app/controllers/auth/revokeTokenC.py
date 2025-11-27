import datetime
from flask import jsonify, request, make_response
import jwt
from app.functions.Select import Select
from app.functions.Update import Update
from app.config import Config

# ========================== 
# USER LOGOUT
# ==========
def revoke_token():

    # ==============
    # functions
    selector = Select()
    updater = Update()
    
    # ==============
    # check refresh token
    refresh_token = request.cookies.get('refreshToken')
    if not refresh_token:
        return ('', 204) 

    # ==============
    # fetch user data dict
    user = ( selector
                    .table("users")
                    .search(tag="refresh_token", key=refresh_token)
                    .execute()
                    .retDict()
            )

    # ==============
    # user not found
    if not user:
        response = make_response('', 204)
        response.set_cookie('refreshToken', '', httponly=True, samesite='None', secure=True, max_age=0)
        return response

    # ==============
    # user found
    user_id = user["user_id"]
    token_version = user.get("token_version", 0) + 1

    # ==============
    # update token status
    updater.table("users").set({
        "refresh_token": None,
        "token_version": token_version,
    }).where(whereCol="user_id", whereVal=user_id).execute()

    # ==============
    # update cookie
    response = make_response(jsonify({"message": "User logged out and tokens revoked"}), 200)
    response.set_cookie('refreshToken', '', httponly=True, samesite='None', secure=True, max_age=0)
    return response




















































  
# ========================== 
# FORGOTTEN PASSWORD RESET TOKEN
# ==========
def generate_reset_token(user_id):
    return jwt.encode(
        {
            "user_id": user_id,
            "type": "password_reset",
            "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=30)
        },
        Config.JWT_SECRET_KEY,
        algorithm="HS256"
    )
