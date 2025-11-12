from flask import Blueprint

from app.controllers.user_info.barangayListC import brgy_list
from app.controllers.user_info.rolesListC import role_list

# Create blueprint
userinfo_bp = Blueprint('userinfo_bp', __name__, url_prefix='/api/user_info')

@userinfo_bp.route('/barangay', methods=['GET'])
def barangayList():
    return brgy_list()

@userinfo_bp.route('/roles', methods=['GET'])
def rolesList():
    return role_list()