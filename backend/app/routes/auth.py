# Authentication routes - Implement with controllers in future
# TODO: from app.controllers.auth_controller import AuthController

from flask import Blueprint, request, jsonify

from app.controllers.auth.authenticationC import login_user, refresh_token

# Create blueprint
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    User registration endpoint

    Expected data: username, email, password, first_name, last_name
    TODO: Integrate with AuthController.register()
    """
    return jsonify({"message": "Registration endpoint - implement with raw SQL"})

@auth_bp.route('/login', methods=['POST'])
def login():
    return login_user()

@auth_bp.route('/refresh', methods=['GET'])
def refresh():
    return refresh_token()

@auth_bp.route('/profile', methods=['GET'])
def get_profile():
    """
    Get current user profile

    TODO: Implement JWT authentication and integrate with AuthController.get_profile()
    """
    return jsonify({"message": "Profile endpoint - implement with raw SQL"})
