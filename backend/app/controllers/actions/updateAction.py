from flask import Blueprint, jsonify, request
from psycopg2 import IntegrityError
from app.models.user import User

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