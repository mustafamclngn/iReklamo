from flask import jsonify, request
from app.functions.Select import Select
from app.functions.Update import Update

def assign_complaint(complaint, assignee):
    try:
        updator = Update()
        print(assignee)
        print(complaint)
        updator\
            .table("complaints")\
            .set({
                "assigned_official_id": assignee,
                "status": "in-progress"
            })\
            .where("id", complaint)\
            .execute()

        return jsonify({
            'success': True,
            'message': 'Successfully assigned complaint to official.'
        }), 200

    except Exception as e:
        print(f"Error updating complaint: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
    

    
        
    