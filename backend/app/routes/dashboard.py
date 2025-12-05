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

# Month names constant
MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]

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
        if role == "3" and barangay_id:
            conditions.append("barangay_id = %s")
            params.append(barangay_id)
        elif role == "4" and user_id:
            conditions.append("assigned_official_id = %s")
            params.append(user_id)
        elif role in ["1", "2"]:
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

        if role == "3" and barangay_id:
            conditions.append("barangay_id = %s")
            params.append(barangay_id)
        elif role == "4" and user_id:
            conditions.append("assigned_official_id = %s")
            params.append(user_id)
        elif role in ["1", "2"]:
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

        if role == "3" and barangay_id:
            conditions.append("barangay_id = %s")
            params.append(barangay_id)
        elif role == "4" and user_id: 
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
        if role == "3" and barangay_id:
            conditions.append("barangay_id = %s")
            params.append(barangay_id)
        elif role == "4" and user_id:
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
        if role == "3" and barangay_id:
            conditions.append("barangay_id = %s")
            params.append(barangay_id)
        elif role == "4" and user_id:
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
        if role == "3" and barangay_id:
            conditions.append("barangay_id = %s")
            params.append(barangay_id)
        elif role in ["1", "2"]:
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
    





#================================= FOR REPORTS PAGE =================================

# GET ANNOUAL COMPLAINT COUNT
@dashboard_bp.route('/annual_complaint_counts', methods=['GET'])
def get_annual_complaint_counts():
    """
    Returns the total number of complaints for a given year.
    Query params: year (e.g., '2025')
    Example response:
    [
        {"count": 186}
    ]
    """
    try:
        year = request.args.get('year', '2025')
        
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        query = f"""
            SELECT COUNT(*) as count
            FROM complaints
            WHERE created_at >= '{year}-01-01' AND created_at < '{int(year)+1}-01-01'
        """

        cursor.execute(query)
        result = cursor.fetchone()

        cursor.close()
        conn.close()

        return jsonify([result]), 200

    except Exception as e:
        print(f"Error fetching annual complaint counts: {e}")
        return jsonify({"success": False, "error": str(e)}), 500
    

# GET MONTHLY COMPLAINT COUNTS FOR YEAR
@dashboard_bp.route('/monthly_complaint_counts', methods=['GET'])
def get_monthly_complaint_counts():
    """
    Returns the number of complaints for each month in a given year.
    Query params: year (e.g., '2025')
    Example response:
    [
        {"month": "January", "count": 20},
        {"month": "February", "count": 15},
        ...
    ]
    """
    try:
        year = request.args.get('year', '2025')
        
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        query = f"""
            SELECT 
                TO_CHAR(created_at, 'Month') AS month,
                DATE_PART('month', created_at) AS month_num,
                COUNT(*) AS count
            FROM complaints
            WHERE created_at >= '{year}-01-01' AND created_at < '{int(year)+1}-01-01'
            GROUP BY month, month_num
            ORDER BY month_num;
        """

        cursor.execute(query)
        results = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(results), 200

    except Exception as e:
        print(f"Error fetching monthly complaint counts: {e}")
        return jsonify({"success": False, "error": str(e)}), 500
    

# GET THE TOP 3 COMPLAINTS BY CASE TYPE FOR YEAR
@dashboard_bp.route('/top_case_types', methods=['GET'])
def get_top_case_types():
    """
    Returns the top 3 most frequent case types in a given year.
    Query params: year (e.g., '2025')
    Example response:
    [
        {"case_type": "Noise Complaint", "count": 50},
        {"case_type": "Garbage Problem", "count": 30},
        {"case_type": "Street Light Outage", "count": 20}
    ]
    """
    try:
        year = request.args.get('year', '2025')
        
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        query = f"""
            SELECT 
                case_type,
                COUNT(*) AS count
            FROM complaints
            WHERE created_at >= '{year}-01-01' AND created_at < '{int(year)+1}-01-01'
            GROUP BY case_type
            ORDER BY count DESC
            LIMIT 3;
        """

        cursor.execute(query)
        results = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(results), 200

    except Exception as e:
        print(f"Error fetching top case types: {e}")
        return jsonify({"success": False, "error": str(e)}), 500
    

# GET MONTHLY CASE TYPE BREAKDOWN PER BARANGAY
@dashboard_bp.route('/monthly_case_type_per_barangay', methods=['GET'])
def get_monthly_case_type_per_barangay():
    """
    Returns case type counts for each barangay for a specific month.
    Query params: month (e.g., 'November'), year (e.g., '2025')
    Example response:
    {
        "case_types": ["Noise Complaint", "Garbage Issue", "Street Light"],
        "barangays": [
            {"barangay_id": 1, "barangay_name": "Abuno", "case_type_counts": [5, 3, 2]},
            {"barangay_id": 2, "barangay_name": "Dalipuga", "case_type_counts": [8, 4, 1]}
        ]
    }
    """
    try:
        month = request.args.get('month', 'November')  # Default to November
        year = request.args.get('year', '2025')  # Default to 2025
        
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # Get all case types
        cursor.execute("""
            SELECT DISTINCT case_type 
            FROM complaints 
            WHERE TRIM(TO_CHAR(created_at, 'Month')) = %s 
            AND EXTRACT(YEAR FROM created_at) = %s
            ORDER BY case_type
        """, (month.strip(), int(year)))
        case_types_result = cursor.fetchall()
        case_types = [ct['case_type'] for ct in case_types_result]

        # Get all barangays
        cursor.execute("SELECT id, name FROM barangays ORDER BY name")
        barangays_result = cursor.fetchall()

        # Build response
        barangay_data = []
        for brgy in barangays_result:
            counts = []
            for case_type in case_types:
                cursor.execute("""
                    SELECT COUNT(*) as count
                    FROM complaints
                    WHERE barangay_id = %s
                    AND case_type = %s
                    AND TRIM(TO_CHAR(created_at, 'Month')) = %s
                    AND EXTRACT(YEAR FROM created_at) = %s
                """, (brgy['id'], case_type, month.strip(), int(year)))
                result = cursor.fetchone()
                counts.append(result['count'] if result else 0)
            
            barangay_data.append({
                "barangay_id": brgy['id'],
                "barangay_name": brgy['name'],
                "case_type_counts": counts
            })

        cursor.close()
        conn.close()

        return jsonify({
            "case_types": case_types,
            "barangays": barangay_data
        }), 200

    except Exception as e:
        print(f"Error fetching monthly case type per barangay: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


# GET MONTHLY STATUS BREAKDOWN PER BARANGAY
@dashboard_bp.route('/monthly_status_per_barangay', methods=['GET'])
def get_monthly_status_per_barangay():
    """
    Returns status counts (Pending, In-Progress, Resolved) for each barangay for a specific month.
    Query params: month (e.g., 'November'), year (e.g., '2025')
    Example response:
    {
        "statuses": ["Pending", "In-Progress", "Resolved"],
        "barangays": [
            {"barangay_id": 1, "barangay_name": "Abuno", "status_counts": [5, 3, 12]},
            {"barangay_id": 2, "barangay_name": "Dalipuga", "status_counts": [8, 4, 20]}
        ]
    }
    """
    try:
        month = request.args.get('month', 'November')  # Default to November
        year = request.args.get('year', '2025')  # Default to 2025
        
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # Define statuses in order
        statuses = ['Pending', 'In-Progress', 'Resolved']

        # Get all barangays
        cursor.execute("SELECT id, name FROM barangays ORDER BY name")
        barangays_result = cursor.fetchall()

        # Build response
        barangay_data = []
        for brgy in barangays_result:
            counts = []
            for status in statuses:
                cursor.execute("""
                    SELECT COUNT(*) as count
                    FROM complaints
                    WHERE barangay_id = %s
                    AND status = %s
                    AND TRIM(TO_CHAR(created_at, 'Month')) = %s
                    AND EXTRACT(YEAR FROM created_at) = %s
                """, (brgy['id'], status, month.strip(), int(year)))
                result = cursor.fetchone()
                counts.append(result['count'] if result else 0)
            
            barangay_data.append({
                "barangay_id": brgy['id'],
                "barangay_name": brgy['name'],
                "status_counts": counts
            })

        cursor.close()
        conn.close()

        return jsonify({
            "statuses": statuses,
            "barangays": barangay_data
        }), 200

    except Exception as e:
        print(f"Error fetching monthly status per barangay: {e}")
        return jsonify({"success": False, "error": str(e)}), 500
    


# GET AVG RESOLUTION TIME PER BARANGAY FOR 2025
@dashboard_bp.route('/avg_resolution_time_per_barangay', methods=['GET'])
def get_avg_resolution_time_per_barangay():
    """
    Returns the average resolution time (in days) for each barangay for complaints resolved in 2025.
    Example response:
    [
        {"barangay_id": 1, "barangay_name": "Abuno", "avg_resolution_time_days": 5.2},
        {"barangay_id": 2, "barangay_name": "Dalipuga", "avg_resolution_time_days": 7.8}
    ]
    """
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        query = """
            SELECT 
                b.id AS barangay_id,
                b.name AS barangay_name,
                AVG(EXTRACT(EPOCH FROM (c.updated_at - c.created_at)) / 86400) AS avg_resolution_time_days
            FROM barangays b
            LEFT JOIN complaints c ON b.id = c.barangay_id 
                AND c.status = 'Resolved'
                AND c.updated_at IS NOT NULL
                AND c.created_at >= '2025-01-01' AND c.created_at < '2026-01-01'
            GROUP BY b.id, b.name
            ORDER BY b.name;
        """

        cursor.execute(query)
        results = cursor.fetchall()

        cursor.close()
        conn.close()

        # Format avg_resolution_time_days to 2 decimal places
        for row in results:
            if row['avg_resolution_time_days'] is not None:
                row['avg_resolution_time_days'] = round(row['avg_resolution_time_days'], 2)

        return jsonify(results), 200

    except Exception as e:
        print(f"Error fetching avg resolution time per barangay: {e}")
        return jsonify({"success": False, "error": str(e)}), 500
    


# GET TOP 3 BARANGAYS WITH MOST URGENT COMPLAINTS
@dashboard_bp.route('/top_urgent_barangays', methods=['GET'])
def get_top_urgent_barangays():
    """
    Returns the top 3 barangays with the highest number of urgent complaints.
    Example response:
    [
        {"barangay_name": "Abuno", "urgent_count": 15, "primary_case_type": "Infrastructure & Utilities"},
        {"barangay_name": "Dalipuga", "urgent_count": 12, "primary_case_type": "Peace & Order"}
    ]
    """
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        query = """
            WITH urgent_counts AS (
                SELECT 
                    b.name AS barangay_name,
                    COUNT(*) AS urgent_count,
                    c.case_type,
                    ROW_NUMBER() OVER (PARTITION BY b.id ORDER BY COUNT(*) DESC) AS rn
                FROM barangays b
                LEFT JOIN complaints c ON b.id = c.barangay_id 
                    AND c.priority = 'Urgent'
                    AND c.created_at >= '2025-01-01' 
                    AND c.created_at < '2026-01-01'
                GROUP BY b.id, b.name, c.case_type
            )
            SELECT 
                barangay_name,
                SUM(urgent_count) AS urgent_count,
                MAX(CASE WHEN rn = 1 THEN case_type END) AS primary_case_type
            FROM urgent_counts
            GROUP BY barangay_name
            HAVING SUM(urgent_count) > 0
            ORDER BY urgent_count DESC
            LIMIT 3;
        """

        cursor.execute(query)
        results = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(results), 200

    except Exception as e:
        print(f"Error fetching top urgent barangays: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@dashboard_bp.route('/top_moderate_barangays', methods=['GET'])
def get_top_moderate_barangays():
    """
    Get top 3 barangays with the most moderate priority complaints.
    """
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        query = """
            WITH moderate_counts AS (
                SELECT 
                    b.name AS barangay_name,
                    COUNT(*) AS moderate_count,
                    c.case_type,
                    ROW_NUMBER() OVER (PARTITION BY b.id ORDER BY COUNT(*) DESC) AS rn
                FROM barangays b
                LEFT JOIN complaints c ON b.id = c.barangay_id 
                    AND c.priority = 'Moderate'
                    AND c.created_at >= '2025-01-01' 
                    AND c.created_at < '2026-01-01'
                GROUP BY b.id, b.name, c.case_type
            )
            SELECT 
                barangay_name,
                SUM(moderate_count) AS moderate_count,
                MAX(CASE WHEN rn = 1 THEN case_type END) AS primary_case_type
            FROM moderate_counts
            GROUP BY barangay_name
            HAVING SUM(moderate_count) > 0
            ORDER BY moderate_count DESC
            LIMIT 3;
        """

        cursor.execute(query)
        results = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(results), 200

    except Exception as e:
        print(f"Error fetching top moderate barangays: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@dashboard_bp.route('/top_low_barangays', methods=['GET'])
def get_top_low_barangays():
    """
    Get top 3 barangays with the most low priority complaints.
    """
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        query = """
            WITH low_counts AS (
                SELECT 
                    b.name AS barangay_name,
                    COUNT(*) AS low_count,
                    c.case_type,
                    ROW_NUMBER() OVER (PARTITION BY b.id ORDER BY COUNT(*) DESC) AS rn
                FROM barangays b
                LEFT JOIN complaints c ON b.id = c.barangay_id 
                    AND c.priority = 'Low'
                    AND c.created_at >= '2025-01-01' 
                    AND c.created_at < '2026-01-01'
                GROUP BY b.id, b.name, c.case_type
            )
            SELECT 
                barangay_name,
                SUM(low_count) AS low_count,
                MAX(CASE WHEN rn = 1 THEN case_type END) AS primary_case_type
            FROM low_counts
            GROUP BY barangay_name
            HAVING SUM(low_count) > 0
            ORDER BY low_count DESC
            LIMIT 3;
        """

        cursor.execute(query)
        results = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(results), 200

    except Exception as e:
        print(f"Error fetching top low barangays: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@dashboard_bp.route('/priority_counts_per_barangay', methods=['GET'])
def get_priority_counts_per_barangay():
    """
    Get complaint counts by priority level (Urgent, Moderate, Low) for each barangay.
    
    Returns:
    {
        "barangays": ["Abuno", "Dalipuga", ...],
        "priorities": ["Urgent", "Moderate", "Low"],
        "data": [
            {"barangay_name": "Abuno", "priority_counts": [15, 8, 5]},
            {"barangay_name": "Dalipuga", "priority_counts": [12, 10, 3]}
        ]
    }
    """
    try:
        month = request.args.get('month', '')
        year = request.args.get('year', '2025')
        
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # Build date filter
        if month:
            month_num = MONTHS.index(month) + 1 if month in MONTHS else None
            if month_num:
                date_filter = f"""
                    WHERE c.priority IS NOT NULL
                    AND EXTRACT(MONTH FROM c.created_at) = {month_num} 
                    AND EXTRACT(YEAR FROM c.created_at) = {year}
                """
            else:
                date_filter = f"""
                    WHERE c.priority IS NOT NULL
                    AND c.created_at >= '{year}-01-01' 
                    AND c.created_at < '{int(year)+1}-01-01'
                """
        else:
            date_filter = f"""
                WHERE c.priority IS NOT NULL
                AND c.created_at >= '{year}-01-01' 
                AND c.created_at < '{int(year)+1}-01-01'
            """

        query = f"""
            SELECT 
                b.name AS barangay_name,
                c.priority,
                COUNT(*) AS count
            FROM barangays b
            LEFT JOIN complaints c ON b.id = c.barangay_id
            {date_filter}
            GROUP BY b.id, b.name, c.priority
            HAVING c.priority IS NOT NULL
            ORDER BY b.name, c.priority;
        """

        cursor.execute(query)
        results = cursor.fetchall()

        cursor.close()
        conn.close()

        # Get unique barangays and priorities
        barangays = []
        priority_data = {}
        
        for row in results:
            brgy = row['barangay_name']
            priority = row['priority']
            count = row['count']
            
            if brgy not in barangays:
                barangays.append(brgy)
                priority_data[brgy] = {'Urgent': 0, 'Moderate': 0, 'Low': 0}
            
            if priority in ['Urgent', 'Moderate', 'Low']:
                priority_data[brgy][priority] = count

        # Format data for frontend
        formatted_data = []
        for brgy in barangays:
            formatted_data.append({
                'barangay_name': brgy,
                'priority_counts': [
                    priority_data[brgy]['Urgent'],
                    priority_data[brgy]['Moderate'],
                    priority_data[brgy]['Low']
                ]
            })

        return jsonify({
            'barangays': barangays,
            'priorities': ['Urgent', 'Moderate', 'Low'],
            'data': formatted_data
        }), 200

    except Exception as e:
        print(f"Error fetching priority counts per barangay: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

