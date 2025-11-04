from flask import Blueprint, jsonify, request
from app.functions.Select import Select
from app.middleware.verifyJwt import verify_jwt
from app.middleware.verifyRoles import verify_roles

officialsList_bp = Blueprint('superadmin_officials', __name__, url_prefix='/api/officials')

@officialsList_bp.route('/', methods=['GET'])
@verify_jwt
@verify_roles('super_admin', 'city_admin', 'brgy_cap', 'brgy_off')
def get_all_officials():
    """Get officials from the database with optional barangay filtering"""

    print("JWT decoded user data:", getattr(request, "user", None))
    
    try:
        barangay = request.args.get('barangay')
        selector = Select().table("users")
        result = selector.sort("user_id", "DESC").execute().retDict()

        # return list
        if result is None:
            all_users = []
        elif isinstance(result, dict):
            all_users = [result]
        else:
            all_users = result
        
        # filter officials based on role
        if barangay:
            # barangay captain = show officials under barangay
            officials = [
                user for user in all_users 
                if user.get('barangay') == barangay and user.get('role') == 'brgy_off'
            ]
        else:
            # superadmin = show all (captain and officials)
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