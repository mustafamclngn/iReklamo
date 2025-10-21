from flask import Blueprint, jsonify

# Create blueprint
main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    """Welcome endpoint"""
    return jsonify({
        "message": "Welcome to iReklamo Backend API!",
        "version": "1.0.0",
        "status": "running"
    })

@main_bp.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": "2025-01-01T00:00:00Z"
    })

@main_bp.route('/api/ping')
def ping():
    """Ping endpoint for testing API connectivity"""
    return jsonify({
        "status": "pong",
        "message": "iReklamo Backend API is running!",
        "timestamp": "2025-01-01T00:00:00Z"
    })

@main_bp.route('/api')
def api_info():
    """API information endpoint"""
    return jsonify({
        "name": "iReklamo API",
        "description": "Complaint Management System API",
        "endpoints": {
            "ping": "/api/ping",
            "auth": "/api/auth",
            "complaints": "/api/complaints",
            "users": "/api/users"
        }
    })
