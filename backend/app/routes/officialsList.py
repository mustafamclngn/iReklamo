from flask import Blueprint, jsonify, request
from app.functions.Select import Select
from app.functions.Update import Update
from app.functions.Insert import Insert
from app.middleware.verifyJwt import verify_jwt
from app.middleware.verifyRoles import verify_roles
from werkzeug.utils import secure_filename
import os
import uuid

officialsList_bp = Blueprint('superadmin_officials', __name__, url_prefix='/api/officials')

# picture upload (to be updated)
UPLOAD_FOLDER = 'public/uploads/profiles'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
MAX_FILE_SIZE = 5 * 1024 * 1024

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

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

@officialsList_bp.route('/<int:user_id>', methods=['GET', 'PUT'])
@verify_jwt
@verify_roles(1, 2, 3, 4)
def handle_official(user_id):
    if request.method == 'GET':
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
    
    elif request.method == 'PUT':
        try:
            first_name = request.form.get('first_name')
            last_name = request.form.get('last_name')
            email = request.form.get('email')
            contact_number = request.form.get('contact_number')
            sex = request.form.get('sex')
            birthdate = request.form.get('birthdate')
            purok = request.form.get('purok')
            street = request.form.get('street')
            
            if not first_name or not last_name or not email:
                return jsonify({
                    'success': False,
                    'error': 'First name, last name, and email are required'
                }), 400
            
            profile_picture_path = None
            if 'profile_picture' in request.files:
                file = request.files['profile_picture']
                
                if file.filename != '':
                    if not allowed_file(file.filename):
                        return jsonify({
                            'success': False,
                            'error': 'Invalid file type. Only PNG, JPG, JPEG, and GIF are allowed.'
                        }), 400
                    
                    file_extension = file.filename.rsplit('.', 1)[1].lower()
                    unique_filename = f"{user_id}_{uuid.uuid4().hex[:8]}.{file_extension}"
                    
                    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
                    
                    file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
                    file.save(file_path)
                    
                    profile_picture_path = f"/uploads/profiles/{unique_filename}"
            
            users_data = {
                'first_name': first_name,
                'last_name': last_name,
                'email': email
            }
            
            Update().table('users').set(users_data).where('user_id', user_id).execute()
            
            user_info_data = {
                'contact_number': contact_number if contact_number else None,
                'sex': sex if sex else None,
                'birthdate': birthdate if birthdate else None,
                'purok': purok if purok else None,
                'street': street if street else None
            }
            
            if profile_picture_path:
                user_info_data['profile_picture'] = profile_picture_path
            
            existing_info = Select().table("user_info").search("user_id", user_id).execute().retDict()
            
            if existing_info:
                Update().table('user_info').set(user_info_data).where('user_id', user_id).execute()
            else:
                user_info_data['user_id'] = user_id
                Insert().table('user_info').values(user_info_data).execute()
            
            return jsonify({
                'success': True,
                'message': 'Profile updated successfully',
                'data': {
                    'profile_picture': profile_picture_path
                }
            }), 200
            
        except Exception as e:
            print(f"Error updating official: {e}")
            return jsonify({
                'success': False,
                'error': str(e)
            }), 500