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
        # Check if complaint exists and get current status
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

        current_status = complaint_data.get('status')

        # Use SAME database connection pattern as update_complaint_status
        from app.config import DB_CONFIG
        import psycopg2
        from psycopg2.extras import RealDictCursor

        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        try:
            # Update complaint with rejection details
            complaint_updates = {
                "status": "Rejected",
                "rejection_reason": rejection_reason,
                "rejected_at": datetime.utcnow()
            }

            cursor.execute("""
                UPDATE complaints
                SET status = %s, rejection_reason = %s, rejected_at = %s, updated_at = NOW()
                WHERE id = %s
            """, ("Rejected", rejection_reason, datetime.utcnow(), complaint_id))

            # Log to status history FIRST before commit
            cursor.execute("""
                INSERT INTO complaint_status_history
                (complaint_id, old_status, new_status, remarks, actor_id, changed_at)
                VALUES (%s, %s, %s, %s, %s, NOW())
            """, (complaint_id, current_status, "Rejected", rejection_reason, rejected_by_id))

            # DEBUG: Log rejection audit
            print(f"AUDIT LOG: Rejection logged - complaint_id={complaint_id}, old_status='{current_status}', new_status='Rejected', actor_id={rejected_by_id}")

            # Single commit for both operations
            conn.commit()

            return jsonify({
                'success': True,
                'message': 'Complaint rejected successfully'
            }), 200

        except Exception as inner_error:
            conn.rollback()
            print(f"Error in reject complaint transaction: {inner_error}")
            return jsonify({
                'success': False,
                'error': 'Failed to reject complaint'
            }), 500
        finally:
            cursor.close()
            conn.close()

    except Exception as e:
        print(f"Error in reject complaint outer handler: {e}")
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
