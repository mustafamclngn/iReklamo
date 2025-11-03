# Complaint routes - Implement with controllers in future
# TODO: from app.controllers.complaint_controller import ComplaintController

from flask import Blueprint, request, jsonify

from app.controllers.complaints.complaintList import list_by_assignee

# Create blueprint
complaints_bp = Blueprint('complaints', __name__, url_prefix='/api/complaints')

@complaints_bp.route('/', methods=['GET'])
def get_complaints():
    """
    Get all complaints

    TODO: Integrate with ComplaintController.get_all_complaints()
    """
    return jsonify({"message": "Get complaints endpoint - implement with raw SQL"})

@complaints_bp.route('/', methods=['POST'])
def create_complaint():
    """
    Create a new complaint

    Expected data: title, description, category, user_id (priority, location, image_url optional)
    TODO: Integrate with ComplaintController.create_complaint()
    """
    return jsonify({"message": "Create complaint endpoint - implement with raw SQL"})

@complaints_bp.route('/<int:complaint_id>', methods=['GET'])
def get_complaint(complaint_id):
    """
    Get a specific complaint by ID

    TODO: Integrate with ComplaintController.get_complaint_by_id()
    """
    return jsonify({"message": f"Get complaint {complaint_id} endpoint - implement with raw SQL"})

@complaints_bp.route('/<int:complaint_id>', methods=['PUT'])
def update_complaint(complaint_id):
    """
    Update a complaint

    Expected data: any subset of title, description, category, status, priority, location, image_url
    TODO: Integrate with ComplaintController.update_complaint()
    """
    return jsonify({"message": f"Update complaint {complaint_id} endpoint - implement with raw SQL"})

@complaints_bp.route('/<int:complaint_id>', methods=['DELETE'])
def delete_complaint(complaint_id):
    """
    Delete a complaint by ID

    TODO: Integrate with ComplaintController.delete_complaint()
    """
    return jsonify({"message": f"Delete complaint {complaint_id} endpoint - implement with raw SQL"})

@complaints_bp.route('ongoing/<int:assignee>', methods=['GET'])
def get_user_complaints(assignee):
    return list_by_assignee(assignee)
