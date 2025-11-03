from flask import Blueprint
from app.controllers.users.selectAction import userList
from app.controllers.users.updateAction import revoke_permissions
from app.controllers.users.deleteAction import delete_user

# Create blueprint
user_bp = Blueprint('user', __name__, url_prefix='/api/user')

@user_bp.route('/list', methods=['GET'])
def listUsers():
    return userList()

@user_bp.route('/<int:user_id>/revoke-permissions', methods=['PATCH'])
def revokeUserPermissions(user_id):
    return revoke_permissions(user_id)

@user_bp.route('/<int:user_id>/revoke-account', methods=['DELETE'])
def revokeUserAccount(user_id):
    return delete_user(user_id)