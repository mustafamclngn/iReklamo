from flask import jsonify, request
from app.functions.Select import Select

def list_by_assignee(assignee):
    try:
        selector = Select()
        print(assignee)
        result = selector\
                    .table("complaints")\
                    .search(search_mult={
                        "assigned_official_id": assignee,
                        "status": "in-progress"
                    })\
                    .execute().retDict()
        
        print(result)

        return jsonify({
            'success': True,
            'data': result
        }), 200

    except Exception as e:
        print(f"Error fetching complaints: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
