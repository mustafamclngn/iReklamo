from flask import Blueprint, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, timedelta
from app.config import DB_CONFIG
from app.functions.Select import Select
from app.functions.Update import Update
from app.functions.Delete import Delete

# Blueprint
dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

@dashboard_bp.route('/counts', methods=['GET'])
def get_dashboard_counts():
    """
    Returns complaint counts for dashboard analytics, filtered by role and barangay_id.
    
    Examples:
    - /api/dashboard/counts?role=superadmin
    - /api/dashboard/counts?role=city_admin
    - /api/dashboard/counts?role=brgy_cap&barangay_id=9
    - /api/dashboard/counts?role=brgy_off&user_id=5
    """
    try:
        role = request.args.get('role')
        barangay_id = request.args.get('barangay_id')
        user_id = request.args.get('user_id')  

        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        conditions = []
        params = []

        # Apply filters based on role
        if role == "brgy_cap" and barangay_id:
            conditions.append("barangay_id = %s")
            params.append(barangay_id)
        elif role == "brgy_off" and user_id:
            conditions.append("assigned_official_id = %s")
            params.append(user_id)
        elif role in ["superadmin", "city_admin"]:
            pass
        else:
            pass

        where_clause = ""
        if conditions:
            where_clause = "WHERE " + " AND ".join(conditions)

        # OVERALL COUNTS QUERY
        query_overall = f"""
            SELECT
                COUNT(*) FILTER (WHERE status = 'Pending') AS pending,
                COUNT(*) FILTER (WHERE status = 'In-Progress') AS in_progress,
                COUNT(*) FILTER (WHERE status = 'Resolved') AS resolved,
                COUNT(*) AS total
            FROM complaints
            {where_clause}
        """

        # PAST MONTH COUNTS QUERY
        query_past_month = f"""
            SELECT
                COUNT(*) FILTER (WHERE status = 'Pending') AS pending,
                COUNT(*) FILTER (WHERE status = 'In-Progress') AS in_progress,
                COUNT(*) FILTER (WHERE status = 'Resolved') AS resolved,
                COUNT(*) AS total
            FROM complaints
            {where_clause} {"AND" if where_clause else "WHERE"} created_at >= %s
        """

        one_month_ago = datetime.now() - timedelta(days=30)

        # Execute queries
        cursor.execute(query_overall, params)
        overall_counts = cursor.fetchone()

        cursor.execute(query_past_month, params + [one_month_ago])
        past_month_counts = cursor.fetchone()

        cursor.close()
        conn.close()

        # Return JSON response
        return jsonify({
            "overall": {
                "Pending": overall_counts["pending"] or 0,
                "In-Progress": overall_counts["in_progress"] or 0,
                "Resolved": overall_counts["resolved"] or 0,
                "Total": overall_counts["total"] or 0
            },
            "past_month": {
                "Pending": past_month_counts["pending"] or 0,
                "In-Progress": past_month_counts["in_progress"] or 0,
                "Resolved": past_month_counts["resolved"] or 0,
                "Total": past_month_counts["total"] or 0
            }
        }), 200

    except Exception as e:
        print(f"Error fetching dashboard counts: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500



#F OR FETCHING COMPLAINTS COUNT BY CASE_TYPE
@dashboard_bp.route('/case_type_breakdown', methods=['GET'])
def get_case_type_breakdown():
    """
    Returns the count for each identical 'case_type',
    filtered by the user's role and barangay_id/user_id.
    """
    try:
        role = request.args.get('role')
        barangay_id = request.args.get('barangay_id')
        user_id = request.args.get('user_id')

        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        conditions = []
        params = []

        if role == "brgy_cap" and barangay_id:
            conditions.append("barangay_id = %s")
            params.append(barangay_id)
        elif role == "brgy_off" and user_id:
            conditions.append("assigned_official_id = %s")
            params.append(user_id)
        elif role in ["superadmin", "city_admin"]:
            pass
        else:
            pass

        where_clause = ""
        if conditions:
            where_clause = "WHERE " + " AND ".join(conditions)

        query_case_breakdown = f"""
            SELECT
                case_type,
                COUNT(*) AS count
            FROM
                complaints
            {where_clause}
            GROUP BY
                case_type
            ORDER BY
                count DESC;
        """

        cursor.execute(query_case_breakdown, params)
        case_breakdown = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(case_breakdown), 200

    except Exception as e:
        print(f"Error fetching case type breakdown: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
    



# FOR FETCHING COUNTS FOR PIE CHART
@dashboard_bp.route('/priority_breakdown', methods=['GET'])
def get_priority_breakdown():
    """
    Returns the count for each 'priority' (High, Medium, Low),
    filtered by the user's role.
    """
    try:
        role = request.args.get('role')
        barangay_id = request.args.get('barangay_id')
        user_id = request.args.get('user_id')

        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        conditions = []
        params = []

        if role == "brgy_cap" and barangay_id:
            conditions.append("barangay_id = %s")
            params.append(barangay_id)
        elif role == "brgy_off" and user_id: 
            conditions.append("assigned_official_id = %s")
            params.append(user_id)
        
        where_clause = ""
        if conditions:
            where_clause = "WHERE " + " AND ".join(conditions)

        query_priority_breakdown = f"""
            SELECT
                priority,
                COUNT(*) AS count
            FROM
                complaints
            {where_clause}
            GROUP BY
                priority
            ORDER BY
                priority;
        """
        
        cursor.execute(query_priority_breakdown, params)
        priority_breakdown = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(priority_breakdown), 200

    except Exception as e:
        print(f"Error fetching priority breakdown: {e}")
        return jsonify({"success": False, "error": str(e)}), 500
    



#FOR LISTING URGENT COMPLAINTS

@dashboard_bp.route('/urgent_complaints', methods=['GET'])
def get_urgent_complaints():
    """
    Returns the top 5 most recent 'Urgent' complaints,
    filtered by the user's role.
    """
    try:
        # 1. Get query params
        role = request.args.get('role')
        barangay_id = request.args.get('barangay_id')
        user_id = request.args.get('user_id')

        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # 2. Build filter logic (re-used from other endpoints)
        # --- THIS IS THE KEY ---
        # We add the priority filter *first*
        conditions = ["priority = 'Urgent'"]
        params = []

        # (Make sure to use 'brgy_off' to match your React app)
        if role == "brgy_cap" and barangay_id:
            conditions.append("barangay_id = %s")
            params.append(barangay_id)
        elif role == "brgy_off" and user_id:
            conditions.append("assigned_official_id = %s")
            params.append(user_id)
        
        where_clause = "WHERE " + " AND ".join(conditions)

        # 3. The SQL query
        query_urgent = f"""
            SELECT id, title, complaint_code, created_at
            FROM complaints
            {where_clause}
            ORDER BY
                created_at DESC
            LIMIT 5;
        """
        
        cursor.execute(query_urgent, params)
        urgent_complaints = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(urgent_complaints), 200

    except Exception as e:
        print(f"Error fetching urgent complaints: {e}")
        return jsonify({"success": False, "error": str(e)}), 500
    




# FOR RECENTLY SUBMITTED COMPLAINTS
@dashboard_bp.route('/recent_complaints', methods=['GET'])
def get_recent_complaints():
    """
    Returns the top 5 most recent complaints (by created_at),
    filtered by the user's role.
    """
    try:
        # 1. Get query params
        role = request.args.get('role')
        barangay_id = request.args.get('barangay_id')
        user_id = request.args.get('user_id')

        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # 2. Build filter logic (re-used from other endpoints)
        conditions = [] # Start with an empty list
        params = []

        # --- IMPORTANT ---
        # Make sure this matches your React app's role name!
        # (e.g., 'brgy_off' or 'brgy_official')
        if role == "brgy_cap" and barangay_id:
            conditions.append("barangay_id = %s")
            params.append(barangay_id)
        elif role == "brgy_off" and user_id:
            conditions.append("assigned_official_id = %s")
            params.append(user_id)
        
        where_clause = ""
        if conditions:
            where_clause = "WHERE " + " AND ".join(conditions)

        # 3. The SQL query
        # We select a few more fields to make the list useful
        query_recent = f"""
            SELECT id, title, complaint_code, created_at, status
            FROM complaints
            {where_clause}
            ORDER BY
                created_at DESC
            LIMIT 10;
        """
        
        cursor.execute(query_recent, params)
        recent_complaints = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(recent_complaints), 200

    except Exception as e:
        print(f"Error fetching recent complaints: {e}")
        return jsonify({"success": False, "error": str(e)}), 500
    


# FOR UNASSIGNED OFFICIALS LIST
@dashboard_bp.route('/unassigned_officials', methods=['GET'])
def get_unassigned_officials():
    """
    Returns a list of barangay officials (role_id 4) who have no
    complaints assigned to them.
    
    - Brgy. Captain: Sees unassigned officials in their barangay.
    - Super Admin/City Admin: Sees all unassigned officials.
    """
    try:
        # 1. Get query params
        role = request.args.get('role')
        barangay_id = request.args.get('barangay_id')

        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # 2. Build filter logic
        # Base condition: Must be a Brgy. Official (role_id 4)
        conditions = ["role_id = 4"] 
        params = []

        # 3. Add role-based filtering (who is *viewing* this)
        # Make sure 'brgy_cap' matches your app's role name!
        if role == "brgy_cap" and barangay_id:
            conditions.append("barangay_id = %s")
            params.append(barangay_id)
        elif role in ["superadmin", "city_admin"]:
            # No extra filter needed, they see all
            pass
        else:
            # Other roles (like brgy_off) should not see this.
            return jsonify([]), 200

        where_clause = "WHERE " + " AND ".join(conditions)

        # 4. The SQL query
        # This finds officials who are NOT IN the list of
        # officials who have assigned complaints.
        query = f"""
            SELECT user_id, first_name, last_name, "position"
            FROM users
            {where_clause}
            AND user_id NOT IN (
                SELECT DISTINCT assigned_official_id 
                FROM complaints 
                WHERE assigned_official_id IS NOT NULL
            )
            ORDER BY
                last_name ASC;
        """
        
        cursor.execute(query, params)
        unassigned_officials = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(unassigned_officials), 200

    except Exception as e:
        print(f"Error fetching unassigned officials: {e}")
        return jsonify({"success": False, "error": str(e)}), 500