from flask import Blueprint, request, jsonify, current_app, render_template
from flask_mail import Message
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from app.config import DB_CONFIG
from app.functions.Select import Select
from app.functions.Update import Update
from app.functions.Delete import Delete
from app.middleware.verifyJwt import verify_jwt

from app.controllers.complaints.complaintList import list_by_assignee, get_all_unfiltered_complaints, activeCases_official, resolvedCases_official, reject_complaint
from app.controllers.complaints.complaintList import list_by_assignee, get_all_unfiltered_complaints, activeCases_official, resolvedCases_official, reject_complaint
from app.controllers.complaints.complaintAssignC import assign_complaint
from app.middleware.verifyRoles import verify_roles
from app.middleware.verifyJwt import verify_jwt


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

def empty_to_null(value):
    return value if value not in ("", None) else None


# TO CREATE COMPLAINT
@complaints_bp.route('/create_complaint', methods=['POST'])
def create_complaint():
    conn = None
    try:
        data = request.get_json()
        mail = current_app.extensions.get('mail')  # Get Flask-Mail

        # Connect to DB
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # Generate complaint ID
        complaint_id_str = generate_complaint_id(cursor)

        # Insert complainant
        cursor.execute("""
            INSERT INTO complainants (first_name, last_name, sex, age, contact_number, email, barangay_id, is_anonymous)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id;
        """, (
            empty_to_null(data['first_name']),
            empty_to_null(data['last_name']),
            empty_to_null(data['sex']),
            empty_to_null(data['age']),
            data['contact_number'],
            data['email'],
            int(data.get('barangay')),
            data.get('is_anonymous')
        ))
        complainant_id = cursor.fetchone()['id']

        # Find assigned official (e.g., barangay captain)
        cursor.execute("""
            SELECT user_id
            FROM users
            WHERE barangay_id = %s AND role_id = '3'
            LIMIT 1;
        """, (int(data.get('barangay')),))
        captain_record = cursor.fetchone()
        assigned_official_id = captain_record['user_id'] if captain_record else None

        # Insert complaint
        cursor.execute("""
            INSERT INTO complaints (
                complaint_code, title, case_type, description, full_address, specific_location,
                complainant_id, barangay_id, assigned_official_id, created_at
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
            RETURNING id;
        """, (
            complaint_id_str,
            data['complaint_title'],
            data['case_type'],
            data['description'],
            data['full_address'],
            data['specific_location'],
            complainant_id,
            int(data.get('barangay')),
            assigned_official_id
        ))
        complaint_id = cursor.fetchone()['id']

        # Commit DB changes before sending email
        conn.commit()

        # Send confirmation email (safe: exceptions caught)
        try:
            if mail:
                # Build greeting
                first = data.get("first_name")
                last = data.get("last_name")
                is_anonymous = data.get("is_anonymous")

                if is_anonymous or (not first and not last):
                    greeting_name = "anonymous"
                else:
                    greeting_name = " ".join(p for p in [first, last] if p)

                # Render HTML email
                html_body = render_template(
                    "complaint_submitted.html",
                    greeting_name=greeting_name,
                    complaint_id=complaint_id_str,
                    header_url="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjW6pVUr11OhfYa_pKjC2GEzO3wK4az40l5g&s",
                    year=datetime.now().year
                )

                # Create the message
                message = Message(
                    subject='Complaint Submitted Successfully',
                    recipients=[data['email']],
                    html=html_body
                )
                mail.send(message)
                print(f"Email sent successfully to {data['email']}")

        except Exception as mail_err:
            print(f"Warning: Failed to send email - {mail_err}")

        return jsonify({
            "success": True,
            "message": "Complaint created successfully!",
            "complainant_id": complainant_id,
            "complaint_id": complaint_id,
            "complaint_code": complaint_id_str
        }), 201

    except Exception as e:
        if conn:
            conn.rollback()
        print(f"Error creating complaint: {e}")
        return jsonify({"error": str(e)}), 500

    finally:
        if conn:
            conn.close()


# LIST OF ALL COMPLAINTS
@complaints_bp.route('/all_complaints', methods=['GET'])
def get_complaints():
    return get_all_unfiltered_complaints()


# GET ALL COMPLAINTS WITH OPTIONAL FILTERS
@complaints_bp.route('/', methods=['GET'])
def get_all_complaints():
    """
    Get all complaints with optional filters: ?barangay=X&status=Y&priority=Z&assigned_official_id=W
    """
    try:
        # Get query parameters
        barangay_filter = request.args.get('barangay')
        status_filter = request.args.get('status')
        priority_filter = request.args.get('priority')
        assigned_filter = request.args.get('assigned_official_id')

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
                COALESCE(
                    NULLIF(TRIM(CONCAT(users.first_name, ' ', users.last_name)), ''),
                    'Unassigned'
                ) as "assignedOfficial"
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

        if assigned_filter:
            conditions.append("complaints.assigned_official_id = %s")
            params.append(assigned_filter)

        # Note: we no longer exclude rejected complaints by default here.
        # If a status filter is provided above, it will still be applied normally.

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
    print(complaint_code)
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
                -- Rejection audit fields
                complaints.rejection_reason,
                complaints.rejected_at,
                barangays.name as barangay_name,
                CONCAT(complainants.first_name, ' ', complainants.last_name) as complainant_name,
                CASE
                    WHEN users.first_name IS NOT NULL AND users.last_name IS NOT NULL
                    THEN CONCAT(users.first_name, ' ', users.last_name)
                    ELSE NULL
                END as assigned_official,
                -- STATUS HISTORY: JSON array of status changes
                COALESCE(
                    (
                        SELECT json_agg(
                            json_build_object(
                                'status', csh.new_status,
                                'changed_at', csh.changed_at,
                                'remarks', csh.remarks
                            )
                            ORDER BY csh.changed_at DESC
                        )
                        FROM complaint_status_history csh
                        WHERE csh.complaint_id = complaints.id
                    ),
                    '[]'::json
                ) as status_history
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


@complaints_bp.route('/<int:complaint_id>', methods=['GET'])
@verify_jwt
def get_complaint(complaint_id):
    """
    Get a specific complaint by ID with joined data
    """
    try:
        # Get user role from JWT - it's stored as an array in 'role' field
        user_roles = request.user.get('role', [])
        user_role = user_roles[0] if user_roles else None
        is_superadmin = (user_role == 1)
        
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
                -- Rejection audit fields
                complaints.rejection_reason,
                complaints.rejected_at,
                -- Joined barangay data
                barangays.name as barangay,
                -- Joined complainant data
                complainants.first_name as complainant_first_name,
                complainants.last_name as complainant_last_name,
                complainants.sex as complainant_sex,
                complainants.age as complainant_age,
                complainants.contact_number as complainant_contact_number,
                complainants.email as complainant_email,
                complainants.is_anonymous,
                -- Joined assigned official data
                COALESCE(
                    NULLIF(TRIM(CONCAT(users.first_name, ' ', users.last_name)), ''),
                    'Unassigned'
                ) as "assignedOfficial",
                -- STATUS HISTORY: JSON array of status changes
                COALESCE(
                    (
                        SELECT json_agg(
                            json_build_object(
                                'status', csh.new_status,
                                'changed_at', csh.changed_at,
                                'remarks', csh.remarks,
                                'actor_name', CONCAT(hist_actor.first_name, ' ', hist_actor.last_name)
                            )
                            ORDER BY csh.changed_at DESC
                        )
                        FROM complaint_status_history csh
                        LEFT JOIN users hist_actor ON csh.actor_id = hist_actor.user_id
                        WHERE csh.complaint_id = complaints.id
                    ),
                    '[]'::json
                ) as status_history
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
        
        # Handle anonymous complaints based on role
        if complaint_data.get('is_anonymous'):
            if is_superadmin:
                # Superadmin: Show actual data if provided, otherwise N/A
                first_name = complaint_data.get('complainant_first_name')
                last_name = complaint_data.get('complainant_last_name')
                
                # If both first and last name are empty/None, show N/A
                if (not first_name or first_name.strip() == '') and (not last_name or last_name.strip() == ''):
                    complaint_data['complainant_first_name'] = 'N/A'
                    complaint_data['complainant_last_name'] = ''
                # Otherwise keep the actual name that was provided
                
                if not complaint_data.get('complainant_sex') or complaint_data.get('complainant_sex').strip() == '':
                    complaint_data['complainant_sex'] = 'N/A'
                if not complaint_data.get('complainant_age'):
                    complaint_data['complainant_age'] = 'N/A'
            else:
                # Other roles: Show "Anonymous" but keep email and contact
                complaint_data['complainant_first_name'] = 'Anonymous'
                complaint_data['complainant_last_name'] = ''
                complaint_data['complainant_sex'] = None
                complaint_data['complainant_age'] = None
                # Email and contact_number are NOT censored - kept as-is

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
        # Get query parameters for filtering
        status_filter = request.args.get('status')
        priority_filter = request.args.get('priority')

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
                COALESCE(
                    NULLIF(TRIM(CONCAT(users.first_name, ' ', users.last_name)), ''),
                    'Unassigned'
                ) as "assignedOfficial"
            FROM complaints
            LEFT JOIN barangays ON complaints.barangay_id = barangays.id
            LEFT JOIN users ON complaints.assigned_official_id = users.user_id
            WHERE complaints.barangay_id = %s
        """

        # Add WHERE conditions based on filters
        conditions = []
        params = [user_barangay_id]

        if status_filter:
            conditions.append("complaints.status = %s")
            params.append(status_filter)

        if priority_filter:
            conditions.append("complaints.priority = %s")
            params.append(priority_filter)

        # If no explicit status filter provided, exclude rejected complaints from default view
        if not status_filter:
            conditions.append("complaints.status != %s")
            params.append("Rejected")

        if conditions:
            query += " AND " + " AND ".join(conditions)

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
        # Exclude rejected complaints from default view for consistency
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
                COALESCE(
                    NULLIF(TRIM(CONCAT(users.first_name, ' ', users.last_name)), ''),
                    'Unassigned'
                ) as "assignedOfficial"
            FROM complaints
            LEFT JOIN barangays ON complaints.barangay_id = barangays.id
            LEFT JOIN users ON complaints.assigned_official_id = users.user_id
            WHERE complaints.assigned_official_id = %s AND complaints.status != 'Rejected'
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


@complaints_bp.route('ongoing/<int:assignee>', methods=['GET'])
def get_user_complaints(assignee):
    return list_by_assignee(assignee)

@complaints_bp.route('assign/<int:complaint_id>/<int:assigned_official_id>')
@verify_jwt
def perform_assignment(complaint_id, assigned_official_id):
    # Get user info for audit logging
    user_info = getattr(request, 'user', None)
    user_id = user_info.get('user_id') if user_info else None
    return assign_complaint(complaint_id, assigned_official_id, user_id)

@complaints_bp.route('cases/active/<int:assigned_official_id>')
def get_active_cases(assigned_official_id):
    return activeCases_official(assigned_official_id)

@complaints_bp.route('cases/resolved/<int:assigned_official_id>')
def get_resolved_cases(assigned_official_id):
    return resolvedCases_official(assigned_official_id)


@complaints_bp.route('/<int:complaint_id>/update-status', methods=['POST'])
@verify_jwt
def update_complaint_status(complaint_id):
    """
    Update complaint status with mandatory remarks and history logging
    """
    try:
        # Get user data from JWT middleware
        user_info = getattr(request, 'user', None)
        if not user_info:
            return jsonify({"error": "Authentication required"}), 401

        user_id = user_info.get('user_id')
        user_role = user_info.get('role')

        # Extract role from array if it's an array (e.g., [3])
        if isinstance(user_role, list) and user_role:
            user_role = user_role[0]

        if not user_id or not user_role:
            return jsonify({"error": "Invalid user credentials"}), 401

        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'Request body required'}), 400

        new_status = data.get('status')
        remarks = data.get('remarks')

        # Validate required fields
        if not new_status or not remarks:
            return jsonify({
                'success': False,
                'message': 'Status and remarks are required'
            }), 400

        # Validate status values
        valid_statuses = ['Pending', 'In-Progress', 'Resolved', 'Rejected']
        if new_status not in valid_statuses:
            return jsonify({
                'success': False,
                'message': 'Invalid status value'
            }), 400

        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # Check if complaint exists and get current data
        cursor.execute("""
            SELECT status, assigned_official_id, barangay_id
            FROM complaints WHERE id = %s
        """, (complaint_id,))

        complaint = cursor.fetchone()
        if not complaint:
            cursor.close()
            conn.close()
            return jsonify({'success': False, 'message': 'Complaint not found'}), 404

        can_update = False

        if user_role in [1, 2]:
            can_update = True

        elif user_role == 3:
            cursor.execute("SELECT barangay_id FROM users WHERE user_id = %s", (user_id,))
            captain_result = cursor.fetchone()
            captain_barangay_id = captain_result['barangay_id'] if captain_result else None
            can_update = (captain_barangay_id is not None and complaint['barangay_id'] == captain_barangay_id)

        elif user_role == 4:
            can_update = (complaint['assigned_official_id'] == user_id)

        if not can_update:
            cursor.close()
            conn.close()
            return jsonify({'success': False, 'message': 'Unauthorized to update this complaint'}), 403

        # Prevent reverting from closed statuses (Resolved/Rejected) for lower roles
        current_status = complaint['status']
        is_closed = current_status in ['Resolved', 'Rejected']

        if is_closed and current_status != new_status and user_role not in [1, 2, 3]:
            # Only higher roles can reopen closed complaints
            cursor.close()
            conn.close()
            return jsonify({
                'success': False,
                'message': 'Cannot reopen closed complaints'
            }), 403

        # Update complaint status
        cursor.execute("""
            UPDATE complaints
            SET status = %s, updated_at = NOW()
            WHERE id = %s
        """, (new_status, complaint_id))

        # Log to history table
        try:
            cursor.execute("""
                INSERT INTO complaint_status_history
                (complaint_id, old_status, new_status, remarks, actor_id, changed_at)
                VALUES (%s, %s, %s, %s, %s, NOW())
            """, (complaint_id, current_status, new_status, remarks, user_id))
        except Exception as history_error:
            print(f"Warning: Could not log status history - {history_error}")
            # Continue with update even if history logging fails

        conn.commit()
        cursor.close()
        conn.close()

        # Email update to complainant
        complaint_data = Select().table("complaints").search('id', complaint_id).execute().retDict()
        complainant_id = complaint_data['complainant_id']
        complainant_data = Select().table("complainants").search("id", complainant_id).execute().retDict()

        if complainant_data:
            mail = current_app.extensions.get('mail')
            # Build greeting
            first = complainant_data.get("first_name")
            last = complainant_data.get("last_name")
            is_anonymous = complainant_data.get("is_anonymous")

            if is_anonymous or (not first and not last):
                greeting_name = "anonymous"
            else:
                greeting_name = " ".join(p for p in [first, last] if p)

            # Render HTML email
            html_body = render_template(
                "complaint_status_update.html",
                greeting_name=greeting_name,
                status = new_status,
                remarks = remarks,
                complaint_id=complaint_data['complaint_code'],
                header_url="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjW6pVUr11OhfYa_pKjC2GEzO3wK4az40l5g&s",
                year=datetime.now().year
            )

            # Create the message
            message = Message(
                subject='Complaint Submitted Successfully',
                recipients=[complainant_data['email']],
                html=html_body
            )
            mail.send(message)
            print(f"Email sent successfully to {complainant_data['email']}")

        return jsonify({
            'success': True,
            'message': f'Status updated to {new_status}',
            'data': {'status': new_status}
        }), 200

    except Exception as e:
        print(f"Error updating complaint status: {e}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500


# NEW ENDPOINT: Add log without changing status
@complaints_bp.route('/<int:complaint_id>/add-log', methods=['POST'])
@verify_jwt
def add_complaint_log(complaint_id):
    try:
        # Get user data from JWT middleware
        user_info = getattr(request, 'user', None)
        if not user_info:
            return jsonify({"error": "Authentication required"}), 401

        user_id = user_info.get('user_id')

        data = request.get_json()
        if not data or 'remarks' not in data:
            return jsonify({
                'success': False,
                'message': 'Remarks are required'
            }), 400

        remarks = data.get('remarks', '').strip()
        if not remarks:
            return jsonify({
                'success': False,
                'message': 'Remarks cannot be empty'
            }), 400

        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # Get current complaint status
        cursor.execute("""
            SELECT status FROM complaints WHERE id = %s
        """, (complaint_id,))

        complaint = cursor.fetchone()
        if not complaint:
            cursor.close()
            conn.close()
            return jsonify({
                'success': False,
                'message': 'Complaint not found'
            }), 404

        current_status = complaint['status']

        # Insert log entry with same old_status and new_status (no status change)
        cursor.execute("""
            INSERT INTO complaint_status_history
            (complaint_id, old_status, new_status, remarks, actor_id, changed_at)
            VALUES (%s, %s, %s, %s, %s, NOW())
        """, (complaint_id, current_status, current_status, remarks, user_id))

        # Update the complaint's updated_at timestamp
        cursor.execute("""
            UPDATE complaints
            SET updated_at = NOW()
            WHERE id = %s
        """, (complaint_id,))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({
            'success': True,
            'message': 'Log added successfully'
        }), 200

    except Exception as e:
        print(f"Error adding complaint log: {e}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500


@complaints_bp.route('/<int:complaint_id>/set-priority', methods=['POST'])
@verify_jwt
def update_priority(complaint_id):
    """
    Update complaint priority with audit logging
    """
    try:
        # Get user data from JWT middleware
        user_info = getattr(request, 'user', None)
        if not user_info:
            return jsonify({"error": "Authentication required"}), 401

        user_id = user_info.get('user_id')

        data = request.get_json()
        if not data or 'priority' not in data:
            return jsonify({'success': False, 'message': 'Priority is required'}), 400

        new_priority = data['priority']
        valid_priorities = ['Low', 'Moderate', 'Urgent']

        if new_priority not in valid_priorities:
            return jsonify({'success': False, 'message': 'Invalid priority value'}), 400

        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        try:
            # Get current priority and status for audit logging
            cursor.execute("SELECT priority, status FROM complaints WHERE id = %s", (complaint_id,))
            current_record = cursor.fetchone()

            if not current_record:
                cursor.close()
                conn.close()
                return jsonify({'success': False, 'message': 'Complaint not found'}), 404

            current_priority = current_record['priority']
            current_status = current_record['status']

            # Update priority
            cursor.execute("""
                UPDATE complaints
                SET priority = %s, updated_at = NOW()
                WHERE id = %s
            """, (new_priority, complaint_id))

            # Log priority change to status history
            # Keep status the same, log as administrative action
            remarks = f"Priority changed from {current_priority or 'None'} to {new_priority}"
            cursor.execute("""
                INSERT INTO complaint_status_history
                (complaint_id, old_status, new_status, remarks, actor_id, changed_at)
                VALUES (%s, %s, %s, %s, %s, NOW())
            """, (complaint_id, current_status or 'Pending', current_status or 'Pending', remarks, user_id))

            conn.commit()

            return jsonify({
                'success': True,
                'message': f'Priority updated to {new_priority}'
            }), 200

        except Exception as inner_error:
            conn.rollback()
            print(f"Error updating priority: {inner_error}")
            return jsonify({'success': False, 'message': 'Failed to update priority'}), 500
        finally:
            cursor.close()
            conn.close()

    except Exception as e:
        print(f"Error in update priority route: {e}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

@complaints_bp.route('/<int:complaint_id>/reject', methods=['POST'])
@verify_jwt
@verify_roles(1, 2, 3)  # Super Admin, City Admin, Barangay Captain
def reject_complaint_route(complaint_id):
    """
    Reject a complaint with audit trail
    """
    try:
        data = request.get_json()

        # Validate required fields
        rejection_reason = data.get('rejection_reason', '').strip()
        if not rejection_reason:
            return jsonify({
                'success': False,
                'error': 'Rejection reason is required'
            }), 400

        # Get authenticated user ID
        user_id = request.user.get('user_id')
        if not user_id:
            return jsonify({
                'success': False,
                'error': 'Invalid user authentication'
            }), 401

        # Call controller function
        return reject_complaint(complaint_id, user_id, rejection_reason)

    except Exception as e:
        print(f"Error in reject complaint route: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to process rejection request'
        }), 500