from flask import jsonify, request
from app.functions.Select import Select

def list_by_assignee(assignee):
    try:
        selector = Select()
        result = selector\
                    .table("complaints")\
                    .search(search_mult={
                        "assigned_official_id": assignee,
                        "status": "in-progress"
                    })\
                    .execute().retDict()
        print("backend reached")

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

def get_all_complaints():
    try:
        barangay = request.args.get('barangay')

        selector = Select()
        selector\
                    .table("complaints")
        
        if barangay:
            selector.search({
                "barangay_id": barangay
            })

        result = selector.sort("complaint_code", "DESC").execute().retDict()

        if result is None:
            complaints = []
        elif isinstance(result, dict):
            complaints = [result]
        else:
            complaints = result

        return jsonify({
            'success': True,
            'data': complaints
        }), 200

    except Exception as e:
        print(f"Error fetching complaints: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
    