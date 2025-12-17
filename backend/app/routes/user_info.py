from flask import Blueprint, request

from app.controllers.user_info.barangayListC import brgy_list, brgy
from app.controllers.user_info.rolesListC import role_list
from app.controllers.user_info.positionListC import position_list

# Create blueprint
userinfo_bp = Blueprint('userinfo_bp', __name__, url_prefix='/api/user_info')

@userinfo_bp.route('/barangay', methods=['GET'])
def barangayList():
    id = request.args.get('barangay_id')

    if id and id != 'null' and id != 'undefined':
        return brgy(id)
    else:        
        return brgy_list()

@userinfo_bp.route('/roles', methods=['GET'])
def rolesList():
    return role_list()

@userinfo_bp.route('/positions', methods=['GET'])
def positionList():
    return position_list()