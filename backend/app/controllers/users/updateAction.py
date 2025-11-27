from flask import Blueprint, jsonify, request
from psycopg2 import IntegrityError
from app.models.user import User
from app.functions.Update import Update

# ========================== 
# USER UPDATE
# ==========
def update_user(user_id):
    user = User()         
    data = user.get(user_id)  
    
    if not data:
        return jsonify({"error": "User not found"}), 404
    
    updates = request.json
    if not updates: 
        return jsonify({"error": "No data provided"})

    try:
        user.edit(user_id, updates)
        return jsonify({"message": "User updated successfully"}), 200

    except Exception as e:
        print(f"Server error: {e}")
        return jsonify({
            "error": "Server error. Please try again later."
        }), 500
    
# ========================== 
# USER ROLE REVOKED
# ==========
def revoke_permissions(user_id):
    user = User()
    data = user.getID(user_id)  
    
    if not data:
        return jsonify({"error": "User not found"}), 404
    
    # update complaints
    complaint_updates = {
        "status": "Pending",
        "assigned_official_id": None
    }

    complaint_update = Update()

    complaint_update.table("complaints")\
                                .set(complaint_updates)\
                                .where(whereCol="assigned_official_id", whereVal=user_id)\
                                .execute()
    
    user_updates = {
        "role_id":5,
        "refresh_token": "",
        "token_version": data.get("token_version", 0) + 1
    }
    
    try:
        user.edit(user_id, user_updates)
        return jsonify({"message": "User permissions revoked and tokens invalidated"}), 200

    except Exception as e:
        print(f"Server error: {e}")
        return jsonify({
            "error": "Server error. Please try again later."
        }), 500
    