from flask_cors import CORS

# Initialize extensions
cors = CORS()

def init_extensions(app):
    """Initialize all Flask extensions"""

    # Initialize CORS
    cors.init_app(app, resources={
        r"/api/*": {
            "origins": app.config.get('CORS_ORIGINS', 'http://localhost:3000').split(','),
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
