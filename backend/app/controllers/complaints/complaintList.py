from flask import jsonify, request
from datetime import datetime
from app.functions.Select import Select
from app.functions.Update import Update

def list_by_assignee(assignee):
    try:
        selector = Select()
        print(assignee)
        result = selector\
                    .table("complaints")\
                    .search(search_mult={
                        "assigned_official_id": assignee,
                        "status": "In-Progress"
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

def reject_complaint(complaint_id, rejected_by_id, rejection_reason):
    try:
        # Check if complaint exists
        complaint_selector = Select()
        complaint_data = complaint_selector\
            .table("complaints")\
            .search("id", complaint_id)\
            .execute().retDict()

        if not complaint_data:
            return jsonify({
                'success': False,
                'error': 'Complaint not found'
            }), 404

        # Check if complaint is already rejected
        if complaint_data.get('status') == 'Rejected':
            return jsonify({
                'success': False,
                'error': 'Complaint is already rejected'
            }), 400

        # Update complaint with rejection details
        complaint_updates = {
            "status": "Rejected",
            "rejection_reason": rejection_reason,
            "rejected_by_id": rejected_by_id,
            "rejected_at": datetime.utcnow()
        }

        complaint_update = Update()
        complaint_update.table("complaints")\
            .set(complaint_updates)\
            .where("id", complaint_id)\
            .execute()

        return jsonify({
            'success': True,
            'message': 'Complaint rejected successfully'
        }), 200

    except Exception as e:
        print(f"Error rejecting complaint: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to reject complaint'
        }), 500
    
def activeCases_official(assignee):
    try:
        selector = Select()
        result = selector\
                    .table("complaints")\
                    .search(search_mult={
                        "assigned_official_id": assignee,
                        "status": "In-Progress"
                    })\
                    .execute().retDict()
        
        print(result)

        return jsonify({
            'success': True,
            'complaints': result
        }), 200

    except Exception as e:
        print(f"Error fetching complaints: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def resolvedCases_official(assignee):
    try:
        selector = Select()
        result = selector\
                    .table("complaints")\
                    .search(search_mult={
                        "assigned_official_id": assignee,
                        "status": "Resolved"
                    })\
                    .execute().retDict()
        
        print(result)

        return jsonify({
            'success': True,
            'complaints': result
        }), 200

    except Exception as e:
        print(f"Error fetching complaints: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def get_all_unfiltered_complaints():
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
