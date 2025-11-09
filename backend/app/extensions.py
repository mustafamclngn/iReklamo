from flask_cors import CORS

# Initialize extensions
cors = CORS()

def init_extensions(app):
    """Initialize all Flask extensions"""
    raw = app.config.get('CORS_ORIGINS', '')
    origins = [o.strip() for o in raw.split(',') if o.strip()]

    # Initialize CORS with proper credentials support
    cors.init_app(
        app,
        origins=origins or ["http://localhost:5173"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
        supports_credentials=True
    )
