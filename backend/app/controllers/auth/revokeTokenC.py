import datetime
from flask import jsonify, request, make_response
import jwt
from app.functions.Select import Select
from app.functions.Update import Update
from app.config import Config
from app.models.user import User


# ========================== 
# REVOKE TOKEN
# ==========
def revoke_token(existing_user): 

    # ==============
    # user details
    user = User()
    user_id = existing_user.get("user_id")

    try: 

        # ==============
        # updated detalls
        user_updates = {
            "refresh_token": None,
            "token_version": existing_user.get("token_version", 0) + 1
        }

        user.edit(user_id, user_updates)
            
    except Exception as e:
        print(f"Server error: {e}")
        return jsonify({
            "error": "Server error. Please try again later."
        }), 500

# ========================== 
# USER LOGOUT
# ==========
def logout_user():

    # ==============
    # functions
    selector = Select()
    
    # ==============
    # check refresh token
    refresh_token = request.cookies.get('refreshToken')
    if not refresh_token:
        return ('', 204) 

    # ==============
    # fetch user data dict
    existing_user = ( selector
                            .table("users")
                            .search(tag="refresh_token", key=refresh_token)
                            .execute()
                            .retDict())

    # ==============
    # user not found
    if not existing_user:
        response = make_response('', 204)
        response.set_cookie('refreshToken', '', httponly=True, samesite='None', secure=True, max_age=0)
        return response

    # ==============
    # update token status
    revoke_token(existing_user)

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
            "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=5)
        },
        Config.JWT_SECRET_KEY,
        algorithm="HS256"
    )
