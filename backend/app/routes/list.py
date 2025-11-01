from flask import Blueprint
from app.controllers.actions.selectAction import userList

# Create blueprint
list_bp = Blueprint('auth', __name__, url_prefix='/api/list')

@list_bp.route('/user', methods=['GET'])
def listUsers():
    return userList()