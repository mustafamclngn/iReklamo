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

def get_all_complaints():
    try:
        barangay = request.args.get('barangay')
        status = request.args.get('status')

        selector = Select()
        selector\
                    .table("complaints")
        
        if barangay and status:
            selector.search(search_mult={
                "barangay_id":barangay,
                "status":status
            })
        elif barangay:
            selector.search(tag="barangay_id", key=barangay)

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
    