from flask import jsonify, request
from psycopg2 import IntegrityError
from app.models.user import User

# ========================== 
# USER INSERT
# ==========
def delete_user():
    user = User()   
    data = request.json

    if not data: 
        return jsonify({"error": "No data provided"})

    try: 
        user.add(data)
        return jsonify({"message": "User added successfully"}), 201
    
    except IntegrityError as ie:
        err_msg =  str(ie).split('\n')[0]
        user_id = data.get('user_id')
        print(err_msg)

        if "users_pkey" in err_msg:
            err_msg = f"User of ID Number: {user_id} already exists."

        return jsonify({
            "error": "Integrity failed",
            "details": err_msg
        }), 409

    except Exception as e:
        print(f"Server error: {e}")
        return jsonify({
            "error": "Server error. Please try again later."
        }), 500