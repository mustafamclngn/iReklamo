import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from app.config import Config, config
from app.extensions import init_extensions
from app.routes.main import main_bp
from app.routes.auth import auth_bp
from app.routes.complaints import complaints_bp
from app.routes.officialsList import officialsList_bp

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

    
    origins = getattr(Config, "CORS_ORIGINS", "").split(",")
    CORS(app, origins=origins, supports_credentials=True)

    # Register blueprints
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(complaints_bp)
    app.register_blueprint(officialsList_bp)

    # Serve static files (profile pictures)
    STORAGE_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'storage')
    
    @app.route('/storage/profile_pictures/<filename>')  # CHANGED: Added underscore
    def serve_profile_picture(filename):
        """Serve profile picture files"""
        return send_from_directory(
            os.path.join(STORAGE_FOLDER, 'profile_pictures'),
            filename
        )


    return app