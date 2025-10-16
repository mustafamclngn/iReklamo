from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import Complaint, User

# Create blueprint
complaints_bp = Blueprint('complaints', __name__, url_prefix='/api/complaints')

@complaints_bp.route('/', methods=['GET'])
def get_complaints():
    """Get all complaints"""
    complaints = Complaint.query.all()

    return jsonify({
        "complaints": [
            {
                "id": c.id,
                "title": c.title,
                "description": c.description,
                "category": c.category,
                "status": c.status,
                "priority": c.priority,
                "location": c.location,
                "user_id": c.user_id,
                "created_at": c.created_at.isoformat() if c.created_at else None
            } for c in complaints
        ]
    })

@complaints_bp.route('/', methods=['POST'])
def create_complaint():
    """Create a new complaint"""
    data = request.get_json()

    if not data or not all(key in data for key in ['title', 'description', 'category', 'user_id']):
        return jsonify({"error": "Missing required fields"}), 400

    new_complaint = Complaint(
        title=data['title'],
        description=data['description'],
        category=data['category'],
        priority=data.get('priority', 'medium'),
        location=data.get('location'),
        image_url=data.get('image_url'),
        user_id=data['user_id']
    )

    db.session.add(new_complaint)
    db.session.commit()

    return jsonify({
        "message": "Complaint created successfully",
        "complaint": {
            "id": new_complaint.id,
            "title": new_complaint.title,
            "description": new_complaint.description,
            "category": new_complaint.category,
            "status": new_complaint.status,
            "priority": new_complaint.priority
        }
    }), 201

@complaints_bp.route('/<int:complaint_id>', methods=['GET'])
def get_complaint(complaint_id):
    """Get a specific complaint"""
    complaint = Complaint.query.get_or_404(complaint_id)

    return jsonify({
        "complaint": {
            "id": complaint.id,
            "title": complaint.title,
            "description": complaint.description,
            "category": complaint.category,
            "status": complaint.status,
            "priority": complaint.priority,
            "location": complaint.location,
            "image_url": complaint.image_url,
            "user_id": complaint.user_id,
            "created_at": complaint.created_at.isoformat() if complaint.created_at else None,
            "updated_at": complaint.updated_at.isoformat() if complaint.updated_at else None
        }
    })

@complaints_bp.route('/<int:complaint_id>', methods=['PUT'])
def update_complaint(complaint_id):
    """Update a complaint"""
    complaint = Complaint.query.get_or_404(complaint_id)
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    # Update fields if provided
    if 'title' in data:
        complaint.title = data['title']
    if 'description' in data:
        complaint.description = data['description']
    if 'category' in data:
        complaint.category = data['category']
    if 'status' in data:
        complaint.status = data['status']
    if 'priority' in data:
        complaint.priority = data['priority']
    if 'location' in data:
        complaint.location = data['location']
    if 'image_url' in data:
        complaint.image_url = data['image_url']

    db.session.commit()

    return jsonify({
        "message": "Complaint updated successfully",
        "complaint": {
            "id": complaint.id,
            "title": complaint.title,
            "description": complaint.description,
            "category": complaint.category,
            "status": complaint.status,
            "priority": complaint.priority
        }
    })

@complaints_bp.route('/<int:complaint_id>', methods=['DELETE'])
def delete_complaint(complaint_id):
    """Delete a complaint"""
    complaint = Complaint.query.get_or_404(complaint_id)

    db.session.delete(complaint)
    db.session.commit()

    return jsonify({"message": "Complaint deleted successfully"})

@complaints_bp.route('/user/<int:user_id>', methods=['GET'])
def get_user_complaints(user_id):
    """Get complaints by a specific user"""
    user = User.query.get_or_404(user_id)
    complaints = Complaint.query.filter_by(user_id=user_id).all()

    return jsonify({
        "complaints": [
            {
                "id": c.id,
                "title": c.title,
                "description": c.description,
                "category": c.category,
                "status": c.status,
                "priority": c.priority,
                "created_at": c.created_at.isoformat() if c.created_at else None
            } for c in complaints
        ]
    })
