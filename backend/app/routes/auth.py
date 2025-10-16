from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import User

# Create blueprint
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    """User registration endpoint"""
    data = request.get_json()

    if not data or not all(key in data for key in ['username', 'email', 'password', 'first_name', 'last_name']):
        return jsonify({"error": "Missing required fields"}), 400

    # Check if user already exists
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({"error": "User already exists"}), 409

    # Create new user (in a real app, you'd hash the password)
    new_user = User(
        username=data['username'],
        email=data['email'],
        password_hash=data['password'],  # TODO: Hash password in production
        first_name=data['first_name'],
        last_name=data['last_name']
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully",
        "user": {
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email
        }
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    """User login endpoint"""
    data = request.get_json()

    if not data or not all(key in data for key in ['email', 'password']):
        return jsonify({"error": "Email and password required"}), 400

    user = User.query.filter_by(email=data['email']).first()

    if not user or user.password_hash != data['password']:  # TODO: Use proper password verification
        return jsonify({"error": "Invalid credentials"}), 401

    # TODO: Generate JWT token in production
    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    })

@auth_bp.route('/profile', methods=['GET'])
def get_profile():
    """Get current user profile"""
    # TODO: Get user from JWT token in production
    return jsonify({
        "message": "Profile endpoint - implement JWT authentication"
    })
