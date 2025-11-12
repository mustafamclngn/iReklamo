from flask import jsonify, request
from psycopg2 import IntegrityError
from app.models.user import User
from app.functions.Update import Update

# ========================== 
# USER DELETE
# ==========
def delete_user(user_id):
    user = User()   
    
    try: 
        existing_user = user.getID(user_id)

        if existing_user:

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
                "refresh_token": None,
                "token_version": existing_user.get("token_version", 0) + 1
            }

            user.edit(user_id, user_updates)

        user.delete(user_id)
        return jsonify({"message": "Account revoked successfully"}), 201
    
    except Exception as e:
        print(f"Server error: {e}")
        return jsonify({
            "error": "Server error. Please try again later."
        }), 500