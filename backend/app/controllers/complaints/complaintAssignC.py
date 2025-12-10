from flask import jsonify, request
from app.functions.Select import Select
from app.functions.Update import Update

def assign_complaint(complaint, assignee, actor_id=None):
    try:
        # Get official name for audit logging
        from app.config import DB_CONFIG
        import psycopg2
        from psycopg2.extras import RealDictCursor

        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        try:
            # Get official's name for remarks
            cursor.execute("""
                SELECT CONCAT(first_name, ' ', last_name) as official_name
                FROM users WHERE user_id = %s
            """, (assignee,))
            official_result = cursor.fetchone()
            official_name = official_result['official_name'] if official_result else 'Official'

            # Update complaint with assignment and status
            cursor.execute("""
                UPDATE complaints
                SET assigned_official_id = %s, status = 'In-Progress', updated_at = NOW()
                WHERE id = %s
            """, (assignee, complaint))

            # Log assignment action to status history
            remarks = f"Assigned to {official_name}"
            cursor.execute("""
                INSERT INTO complaint_status_history
                (complaint_id, old_status, new_status, remarks, actor_id, changed_at)
                VALUES (%s, 'Pending', 'In-Progress', %s, %s, NOW())
            """, (complaint, remarks, actor_id))

            conn.commit()

            return jsonify({
                'success': True,
                'message': 'Successfully assigned complaint to official.'
            }), 200

        except Exception as inner_error:
            conn.rollback()
            print(f"Error in assignment transaction: {inner_error}")
            return jsonify({
                'success': False,
                'error': 'Failed to assign complaint'
            }), 500
        finally:
            cursor.close()
            conn.close()

    except Exception as e:
        print(f"Error in assignment outer handler: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
