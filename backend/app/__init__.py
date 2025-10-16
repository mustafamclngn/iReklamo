import os
from flask import Flask
from app.config import config
from app.extensions import init_extensions, db
from app.routes.main import main_bp
from app.routes.auth import auth_bp
from app.routes.complaints import complaints_bp

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

    # Create database tables (for development)
    with app.app_context():
        db.create_all()

    return app
