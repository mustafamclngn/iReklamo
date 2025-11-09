from flask import Blueprint

from app.controllers.auth.authenticationC import login_user, refresh_token, register_user
from app.controllers.auth.revokeTokenC import revoke_token

# Create blueprint
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    return register_user()

@auth_bp.route('/login', methods=['POST'])
def login():
    return login_user()

@auth_bp.route('/refresh', methods=['GET'])
def refresh():
    return refresh_token()

@auth_bp.route('/revoke', methods=['POST'])
def revoke():
    return revoke_token()