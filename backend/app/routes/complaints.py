from flask import Blueprint, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from app.config import DB_CONFIG

from app.controllers.complaints.complaintList import list_by_assignee, get_all_complaints
from app.controllers.complaints.complaintAssignC import assign_complaint

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
    return get_all_complaints()


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
    Get a specific complaint by ID

    TODO: Integrate with ComplaintController.get_complaint_by_id()
    """
    return jsonify({"message": f"Get complaint {complaint_id} endpoint - implement with raw SQL"})


@complaints_bp.route('/<int:complaint_id>', methods=['PUT'])
def update_complaint(complaint_id):
    """
    Update a complaint

    Expected data: any subset of title, description, category, status, priority, location, image_url
    TODO: Integrate with ComplaintController.update_complaint()
    """
    return jsonify({"message": f"Update complaint {complaint_id} endpoint - implement with raw SQL"})

@complaints_bp.route('/<int:complaint_id>', methods=['DELETE'])
def delete_complaint(complaint_id):
    """
    Delete a complaint by ID

    TODO: Integrate with ComplaintController.delete_complaint()
    """
    return jsonify({"message": f"Delete complaint {complaint_id} endpoint - implement with raw SQL"})

@complaints_bp.route('ongoing/<int:assignee>', methods=['GET'])
def get_user_complaints(assignee):
    return list_by_assignee(assignee)

@complaints_bp.route('assign/<int:complaint_id>/<int:assigned_official_id>')
def perform_assignment(complaint_id, assigned_official_id):
    return assign_complaint(complaint_id, assigned_official_id)
