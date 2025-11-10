from flask import Blueprint, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from app.config import DB_CONFIG
from app.functions.Select import Select
from app.functions.Update import Update
from app.functions.Delete import Delete

# Create blueprint
complaints_bp = Blueprint('complaints', __name__, url_prefix='/api/complaints')

# FOR GENERATING TRACKING ID
def generate_complaint_id(cursor):
    today = datetime.now().strftime("%Y%m%d")  # YYYYMMDD
    # Count how many complaints exist today
    cursor.execute("SELECT COUNT(*) FROM complaints WHERE created_at::date = CURRENT_DATE;")
    count_today = cursor.fetchone()['count'] + 1  # Start from 1
    sequential = str(count_today).zfill(4)  # Pad to 4 digits, e.g., 0001
    return f"CMP-{today}-{sequential}"


# LIST OF ALL COMPLAINTS
@complaints_bp.route('/all_complaints', methods=['GET'])
def get_complaints():
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("SELECT * FROM complaints;")

    results = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(results)


# GET ALL COMPLAINTS WITH OPTIONAL FILTERS
@complaints_bp.route('/', methods=['GET'])
def get_all_complaints():
    """
    Get all complaints with optional filters: ?barangay=X&status=Y&priority=Z
    """
    try:
        # Get query parameters
        barangay_filter = request.args.get('barangay')
        status_filter = request.args.get('status')
        priority_filter = request.args.get('priority')

        # Use raw SQL with proper JOINs to resolve foreign keys
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # Build the query with JOINs
        query = """
            SELECT
                complaints.id,
                complaints.complaint_code,
                complaints.title,
                complaints.case_type,
                complaints.description,
                complaints.full_address,
                complaints.specific_location,
                complaints.status,
                complaints.priority,
                complaints.barangay_id,
                complaints.assigned_official_id,
                complaints.created_at,
                complaints.updated_at,
                barangays.name as barangay,
                CASE
                    WHEN users.first_name IS NOT NULL AND users.last_name IS NOT NULL
                    THEN CONCAT(users.first_name, ' ', users.last_name)
                    ELSE 'Unassigned'
                END as "assignedOfficial"
            FROM complaints
            LEFT JOIN barangays ON complaints.barangay_id = barangays.id
            LEFT JOIN users ON complaints.assigned_official_id = users.user_id
        """

        # Add WHERE conditions based on filters
        conditions = []
        params = []

        if barangay_filter:
            conditions.append("barangays.name = %s")
            params.append(barangay_filter)

        if status_filter:
            conditions.append("complaints.status = %s")
            params.append(status_filter)

        if priority_filter:
            conditions.append("complaints.priority = %s")
            params.append(priority_filter)

        if conditions:
            query += " WHERE " + " AND ".join(conditions)

        query += " ORDER BY complaints.created_at DESC"

        cursor.execute(query, params)
        results = cursor.fetchall()
        cursor.close()
        conn.close()

        # Convert RealDictCursor results to list of dicts
        formatted_results = []
        for row in results:
            complaint_dict = dict(row)
            formatted_results.append(complaint_dict)

        return jsonify({
            'success': True,
            'data': formatted_results,
            'count': len(formatted_results)
        }), 200

    except Exception as e:
        print(f"Error fetching complaints: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# LIST OF ALL BARANGAYS
@complaints_bp.route('/barangays', methods=['GET'])
def get_barangays():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            SELECT id, name
            FROM barangays
            ORDER BY name;
        """)

        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        return jsonify(rows)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# GET COMPLAINTS BY BARANGAY NAME
@complaints_bp.route('/barangay/<string:barangay_name>', methods=['GET'])
def get_complaints_by_barangay(barangay_name):
    """
    Get complaints for a specific barangay by name
    """
    try:
        # Use raw SQL for join query
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            SELECT
                complaints.id,
                complaints.complaint_code,
                complaints.title,
                complaints.case_type,
                complaints.description,
                complaints.full_address,
                complaints.specific_location,
                complaints.status,
                complaints.priority,
                complaints.barangay_id,
                complaints.assigned_official_id,
                complaints.created_at,
                complaints.updated_at,
                barangays.name as barangay_name
            FROM complaints
            INNER JOIN barangays ON complaints.barangay_id = barangays.id
            WHERE barangays.name = %s
            ORDER BY complaints.created_at DESC;
        """, (barangay_name,))

        results = cursor.fetchall()
        cursor.close()
        conn.close()

        return jsonify({
            'success': True,
            'data': results,
            'count': len(results),
            'barangay': barangay_name
        }), 200

    except Exception as e:
        print(f"Error fetching complaints for barangay {barangay_name}: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@complaints_bp.route('/track/<string:complaint_code>', methods=['GET'])
def track_complaint(complaint_code):
    """
    Track a complaint by its complaint_code (e.g., CMP-20241110-0001)
    This endpoint is public and doesn't require authentication
    """
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        query = """
            SELECT
                complaints.id,
                complaints.complaint_code,
                complaints.title,
                complaints.case_type,
                complaints.description,
                complaints.full_address,
                complaints.specific_location,
                complaints.status,
                complaints.priority,
                complaints.created_at,
                complaints.updated_at,
                barangays.name as barangay_name,
                CONCAT(complainants.first_name, ' ', complainants.last_name) as complainant_name,
                CASE
                    WHEN users.first_name IS NOT NULL AND users.last_name IS NOT NULL
                    THEN CONCAT(users.first_name, ' ', users.last_name)
                    ELSE NULL
                END as assigned_official
            FROM complaints
            LEFT JOIN barangays ON complaints.barangay_id = barangays.id
            LEFT JOIN complainants ON complaints.complainant_id = complainants.id
            LEFT JOIN users ON complaints.assigned_official_id = users.user_id
            WHERE complaints.complaint_code = %s
        """

        cursor.execute(query, (complaint_code,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()

        if not result:
            return jsonify({
                'success': False,
                'message': 'Complaint not found. Please check your Complaint ID and try again.'
            }), 404

        complaint_data = dict(result)

        return jsonify({
            'success': True,
            'data': complaint_data
        }), 200

    except Exception as e:
        print(f"Error tracking complaint: {e}")
        return jsonify({
            'success': False,
            'message': 'An error occurred while tracking your complaint.'
        }), 500


# GET COMPLAINTS ASSIGNED TO AN OFFICIAL
@complaints_bp.route('/assigned/<int:official_id>', methods=['GET'])
def get_assigned_complaints(official_id):
    """
    Get complaints assigned to a specific official
    """
    try:
        # Define columns to select
        columns = [
            "complaints.id",
            "complaints.complaint_code",
            "complaints.title",
            "complaints.case_type",
            "complaints.description",
            "complaints.full_address",
            "complaints.specific_location",
            "complaints.status",
            "complaints.priority",
            "complaints.barangay_id",
            "complaints.assigned_official_id",
            "complaints.created_at",
            "complaints.updated_at"
        ]

        selector = Select().table("complaints").special_col(columns)
        selector.search("assigned_official_id", official_id)
        selector.sort("created_at", "DESC")

        results = selector.execute().retData()

        return jsonify({
            'success': True,
            'data': results,
            'count': len(results),
            'official_id': official_id
        }), 200

    except Exception as e:
        print(f"Error fetching assigned complaints for official {official_id}: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500



@complaints_bp.route('/create_complaint', methods=['POST'])
def create_complaint():
    try:
        data = request.get_json()
        print("Received complaint:", data)

        conn = psycopg2.connect(
            host=DB_CONFIG['host'],
            port=DB_CONFIG['port'],
            database=DB_CONFIG['database'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password']
        )

        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            complaint_id_str = generate_complaint_id(cursor)

            #insert complainant info
            cursor.execute("""
                INSERT INTO complainants (first_name, last_name, sex, age, contact_number, email, barangay_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id;
            """, (
                data['first_name'],         
                data['last_name'], 
                data['sex'], 
                data['age'],
                data['contact_number'], 
                data['email'], 
                int(data.get('barangay'))
            ))
            complainant_id = cursor.fetchone()['id']

            #insert complaint
            cursor.execute("""
                INSERT INTO complaints (
                    complaint_code, title, case_type, description, full_address, specific_location,
                    complainant_id, barangay_id, assigned_official_id
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id;
            """, (
                complaint_id_str,              # tracking id
                data['complaint_title'],       # title
                data['case_type'],             # case_type
                data['description'],           # description
                data['full_address'],          # full_address
                data['specific_location'],     # specific_location
                complainant_id,                # complainant_id FK
                int(data.get('barangay')),     # barangay_id FK
                1                              # assigned_official_id NULL
            ))
            complaint_id = cursor.fetchone()['id']


            conn.commit()


        # Save data to DB here
        return jsonify({
            "success": True, 
            "message": "Complaint created!",
            'complainant_id': complainant_id,
            'complaint_id': complaint_id,
        }), 201
    except Exception as e:
        print("Error:", e)
        return jsonify({"success": False, "error": str(e)}), 500





@complaints_bp.route('/<int:complaint_id>', methods=['GET'])
def get_complaint(complaint_id):
    """
    Get a specific complaint by ID with joined data
    """
    try:
        # Use raw SQL with JOINs to get complete complaint data
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        query = """
            SELECT
                complaints.id,
                complaints.complaint_code,
                complaints.title,
                complaints.case_type,
                complaints.description,
                complaints.full_address,
                complaints.specific_location,
                complaints.status,
                complaints.priority,
                complaints.barangay_id,
                complaints.assigned_official_id,
                complaints.created_at,
                complaints.updated_at,
                complaints.complainant_id,
                -- Joined barangay data
                barangays.name as barangay,
                -- Joined complainant data
                complainants.first_name as complainant_first_name,
                complainants.last_name as complainant_last_name,
                complainants.sex as complainant_sex,
                complainants.age as complainant_age,
                complainants.contact_number as complainant_contact_number,
                complainants.email as complainant_email,
                -- Joined assigned official data
                CASE
                    WHEN users.first_name IS NOT NULL AND users.last_name IS NOT NULL
                    THEN CONCAT(users.first_name, ' ', users.last_name)
                    ELSE 'Unassigned'
                END as assignedOfficial
            FROM complaints
            LEFT JOIN barangays ON complaints.barangay_id = barangays.id
            LEFT JOIN complainants ON complaints.complainant_id = complainants.id
            LEFT JOIN users ON complaints.assigned_official_id = users.user_id
            WHERE complaints.id = %s
        """

        cursor.execute(query, (complaint_id,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()

        if not result:
            return jsonify({
                'success': False,
                'error': 'Complaint not found'
            }), 404

        # Convert RealDictCursor result to regular dict
        complaint_data = dict(result)

        return jsonify({
            'success': True,
            'data': complaint_data
        }), 200

    except Exception as e:
        print(f"Error fetching complaint: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500




@complaints_bp.route('/<int:complaint_id>', methods=['PUT'])
def update_complaint(complaint_id):
    """
    Update a complaint
    """
    try:
        data = request.get_json()

        # Check if complaint exists
        selector = Select().table("complaints").search("id", complaint_id).execute().retDict()
        if not selector:
            return jsonify({
                'success': False,
                'error': 'Complaint not found'
            }), 404

        # Update allowed fields
        allowed_fields = [
            'title', 'case_type', 'description', 'full_address', 'specific_location',
            'status', 'priority', 'assigned_official_id'
        ]

        update_data = {}
        for field in allowed_fields:
            if field in data:
                update_data[field] = data[field]

        if update_data:
            updater = Update().table("complaints").set(update_data).where("id", complaint_id).execute()

        return jsonify({
            'success': True,
            'message': 'Complaint updated successfully'
        }), 200

    except Exception as e:
        print(f"Error updating complaint: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500





@complaints_bp.route('/<int:complaint_id>', methods=['DELETE'])
def delete_complaint(complaint_id):
    """
    Delete a complaint by ID
    """
    try:
        # Check if complaint exists
        selector = Select().table("complaints").search("id", complaint_id).execute().retDict()
        if not selector:
            return jsonify({
                'success': False,
                'error': 'Complaint not found'
            }), 404

        deleter = Delete().table("complaints").where("id", complaint_id).execute()

        return jsonify({
            'success': True,
            'message': 'Complaint deleted successfully'
        }), 200

    except Exception as e:
        print(f"Error deleting complaint: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500






# ROLE-BASED COMPLAINTS ENDPOINTS

@complaints_bp.route('/barangay-captain/<int:user_id>', methods=['GET'])
def get_barangay_captain_complaints(user_id):
    """
    Get complaints for a barangay captain - only complaints from their barangay
    """
    try:
        # Get user's barangay_id from users table
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # First get the user's barangay_id
        cursor.execute("SELECT barangay_id FROM users WHERE user_id = %s", (user_id,))
        user_result = cursor.fetchone()

        if not user_result or not user_result['barangay_id']:
            cursor.close()
            conn.close()
            return jsonify({
                'success': False,
                'error': 'User not found or not assigned to a barangay'
            }), 404

        user_barangay_id = user_result['barangay_id']

        # Get complaints for this barangay with official names resolved
        query = """
            SELECT
                complaints.id,
                complaints.complaint_code,
                complaints.title,
                complaints.case_type,
                complaints.description,
                complaints.full_address,
                complaints.specific_location,
                complaints.status,
                complaints.priority,
                complaints.barangay_id,
                complaints.assigned_official_id,
                complaints.created_at,
                complaints.updated_at,
                barangays.name as barangay,
                CASE
                    WHEN users.first_name IS NOT NULL AND users.last_name IS NOT NULL
                    THEN CONCAT(users.first_name, ' ', users.last_name)
                    ELSE 'Unassigned'
                END as "assignedOfficial"
            FROM complaints
            LEFT JOIN barangays ON complaints.barangay_id = barangays.id
            LEFT JOIN users ON complaints.assigned_official_id = users.user_id
            WHERE complaints.barangay_id = %s
            ORDER BY complaints.created_at DESC
        """

        cursor.execute(query, (user_barangay_id,))
        results = cursor.fetchall()
        cursor.close()
        conn.close()

        # Convert RealDictCursor results to list of dicts
        formatted_results = []
        for row in results:
            complaint_dict = dict(row)
            formatted_results.append(complaint_dict)

        return jsonify({
            'success': True,
            'data': formatted_results,
            'count': len(formatted_results),
            'barangay_id': user_barangay_id
        }), 200

    except Exception as e:
        print(f"Error fetching barangay captain complaints: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@complaints_bp.route('/barangay-official/<int:user_id>', methods=['GET'])
def get_barangay_official_complaints(user_id):
    """
    Get complaints assigned to a barangay official (WHERE complaints.assigned_official_id = user_id)
    """
    try:
        # Get complaints assigned to this official with barangay and official names resolved
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # Get complaints assigned to this specific official
        query = """
            SELECT
                complaints.id,
                complaints.complaint_code,
                complaints.title,
                complaints.case_type,
                complaints.description,
                complaints.full_address,
                complaints.specific_location,
                complaints.status,
                complaints.priority,
                complaints.barangay_id,
                complaints.assigned_official_id,
                complaints.created_at,
                complaints.updated_at,
                barangays.name as barangay,
                CASE
                    WHEN users.first_name IS NOT NULL AND users.last_name IS NOT NULL
                    THEN CONCAT(users.first_name, ' ', users.last_name)
                    ELSE 'Unassigned'
                END as "assignedOfficial"
            FROM complaints
            LEFT JOIN barangays ON complaints.barangay_id = barangays.id
            LEFT JOIN users ON complaints.assigned_official_id = users.user_id
            WHERE complaints.assigned_official_id = %s
            ORDER BY complaints.created_at DESC
        """

        cursor.execute(query, (user_id,))
        results = cursor.fetchall()
        cursor.close()
        conn.close()

        # Convert RealDictCursor results to list of dicts
        formatted_results = []
        for row in results:
            complaint_dict = dict(row)
            formatted_results.append(complaint_dict)

        return jsonify({
            'success': True,
            'data': formatted_results,
            'count': len(formatted_results),
            'official_id': user_id
        }), 200

    except Exception as e:
        print(f"Error fetching barangay official complaints: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@complaints_bp.route('/user/<int:user_id>', methods=['GET'])
def get_user_complaints(user_id):
    """
    Get complaints by a specific user
    Note: This assumes complaints have a user_id field, but current schema doesn't.
    This might need to be updated based on how complaints are associated with users
    """
    try:
        # For now, return empty array since current schema doesn't link complaints to users directly
        # This would need to be updated based on how complaints are associated with users
        return jsonify({
            'success': True,
            'data': [],
            'count': 0,
            'message': 'User complaints endpoint - needs schema update to link complaints to users'
        }), 200

    except Exception as e:
        print(f"Error fetching user complaints: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
