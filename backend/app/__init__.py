import os
from flask import Flask, make_response, request, send_from_directory
from flask_cors import CORS
from app.config import Config, config
from app.extensions import init_extensions
from app.routes.main import main_bp
from app.routes.auth import auth_bp
from app.routes.complaints import complaints_bp
from app.routes.users import user_bp
from app.routes.officialsList import officialsList_bp
from app.routes.dashboard import dashboard_bp
from app.routes.user_info import userinfo_bp

def create_app(config_name=None):
    """Application factory function"""

    # Create Flask app instance
    app = Flask(__name__)
    
    # Load configuration
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')

    if config_name in config:
        app.config.from_object(config[config_name])
    else:
        app.config.from_object(config['default'])

    # Initialize extensions
    init_extensions(app)

    # Register blueprints
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(complaints_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(officialsList_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(userinfo_bp)

    # image upload path (machange pa cguro)
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    UPLOADS_FOLDER = os.path.join(BASE_DIR, 'public', 'uploads')
    
    @app.route('/uploads/<path:filename>')
    def serve_upload(filename):
        try:
            return send_from_directory(os.path.join(UPLOADS_FOLDER), filename)
        except FileNotFoundError:
            return {"error": "File not found"}, 404

    return app