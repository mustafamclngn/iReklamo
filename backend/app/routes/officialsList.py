from flask import Blueprint, jsonify, request
from app.functions.Select import Select
from app.middleware.verifyJwt import verify_jwt
from app.middleware.verifyRoles import verify_roles

officialsList_bp = Blueprint('superadmin_officials', __name__, url_prefix='/api/officials')

@officialsList_bp.route('/', methods=['GET'])
@verify_jwt
@verify_roles(1, 2, 3, 4)
def get_all_officials():
    try:
        barangay = request.args.get('barangay')
        
        selector = Select().table("users")
        
        columns = [
            "users.user_id",
            "users.user_name",
            "users.first_name",
            "users.last_name",
            "users.email",
            "users.role_id",
            "users.barangay_id",
            "roles.name as role",
            "barangays.name AS barangay_name",
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
        
        if barangay:
            selector.search(search_mult={
                "barangay_id": barangay,
                "role_id": 4
            })
        else:
            selector.search(search_mult={
                "role_id": 3,
                "role_id": 4
            }, search_mult_connect=" OR ")

        result = selector.sort("user_id", "DESC").execute().retDict()

        if result is None:
            officials = []
        elif isinstance(result, dict):
            officials = [result]
        else:
            officials = result

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
@verify_jwt
@verify_roles(1, 2, 3, 4)
def get_official_by_id(user_id):
    try:
        selector = Select().table("users")
        
        columns = [
            "users.user_id",
            "users.user_name",
            "users.first_name",
            "users.last_name",
            "users.email",
            "users.role_id",
            "users.barangay_id",
            "barangays.name AS barangay_name",
            "roles.name as role",
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
