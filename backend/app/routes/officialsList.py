from flask import Blueprint, jsonify, request
from app.functions.Select import Select

officialsList_bp = Blueprint('superadmin_officials', __name__, url_prefix='/api/officials')

@officialsList_bp.route('/', methods=['GET'])
def get_all_officials():
    try:
        barangay = request.args.get('barangay')
        
        selector = Select().table("users")
        
        columns = [
            "users.user_id",
            "users.first_name",
            "users.last_name",
            "users.email",
            "roles.name as role",
            "barangays.name as barangay",
            "users.position",
            "users.created_at",
            "user_info.contact_number",
            "user_info.sex",
            "user_info.birthdate",
            "user_info.purok",
            "user_info.street",
            "user_info.profile_picture"
        ]

        selector.special_col(columns)

        selector.tablequery = "FROM users LEFT JOIN user_info ON users.user_id = user_info.user_id LEFT JOIN roles ON users.role_id = roles.id LEFT JOIN barangays ON users.barangay_id = barangays.id"
        
        result = selector.sort("user_id", "DESC").execute().retDict()

        if result is None:
            all_users = []
        elif isinstance(result, dict):
            all_users = [result]
        else:
            all_users = result
        
        if barangay:
            officials = [
                user for user in all_users 
                if user.get('barangay') == barangay and user.get('role') == 'brgy_off'
            ]
        else:
            officials = [
                user for user in all_users 
                if user.get('role') in ['brgy_cap', 'brgy_off']
            ]

        return jsonify({
            'success': True,
            'data': officials,
            'count': len(officials)
        }), 200
        
    except Exception as e:
        print(f"Error fetching officials: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@officialsList_bp.route('/<int:user_id>', methods=['GET'])
def get_official_by_id(user_id):
    try:
        selector = Select().table("users")
        
        columns = [
            "users.user_id",
            "users.first_name",
            "users.last_name",
            "users.email",
            "roles.name as role",
            "barangays.name as barangay",
            "users.position",
            "users.created_at",
            "user_info.contact_number",
            "user_info.sex",
            "user_info.birthdate",
            "user_info.purok",
            "user_info.street",
            "user_info.profile_picture"
        ]

        selector.special_col(columns)
        selector.tablequery = "FROM users LEFT JOIN user_info ON users.user_id = user_info.user_id LEFT JOIN roles ON users.role_id = roles.id LEFT JOIN barangays ON users.barangay_id = barangays.id"
        
        result = selector.search("user_id", user_id, table="users").execute().retDict()
        
        if not result:
            return jsonify({
                'success': False,
                'error': 'Official not found'
            }), 404
        
        result['assigned_cases'] = 0
        result['pending_cases'] = 0
        result['resolved_cases'] = 0
        
        return jsonify({
            'success': True,
            'data': result
        }), 200
        
    except Exception as e:
        print(f"Error fetching official by ID: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
