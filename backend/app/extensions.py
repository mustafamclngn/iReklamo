from flask_cors import CORS
from flask_mail import Mail

# Initialize extensions
cors = CORS()
mail = Mail()

class SupabaseStorageWrapper:
    def __init__(self):
        self.storage = None
    
    def init(self, url, key, bucket_name):
        from app.utils.supabase_storage import init_supabase_storage
        self.storage = init_supabase_storage(url, key, bucket_name)
    
    def __getattr__(self, name):
        if self.storage is None:
            raise RuntimeError("Supabase Storage not initialized")
        return getattr(self.storage, name)

supabase_storage = SupabaseStorageWrapper()

def init_extensions(app):
    """Initialize all Flask extensions"""
    raw = app.config.get('CORS_ORIGINS', '')
    origins = [o.strip() for o in raw.split(',') if o.strip()]

    # Initialize CORS
    cors.init_app(
        app,
        resources={
            r"/api/*": {
                "origins": origins or ["http://localhost:5173"],
                "credentials": "true",
                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
                "allow_headers": ["Content-Type", "Authorization"],
                "supports_credentials": True,  
            }
        }
    )

    # Initialize Flask-Mail
    mail.init_app(app)

    
    # supabase storage
    supabase_url = app.config.get('SUPABASE_URL')
    supabase_key = app.config.get('SUPABASE_SERVICE_KEY')
    supabase_bucket = app.config.get('SUPABASE_BUCKET')
    
    # for debugging purposes (pwede ni matangtang later if working na ang inyong supabase bucket)
    print(f"DEBUG - SUPABASE_URL: {supabase_url}")
    print(f"DEBUG - SUPABASE_KEY exists: {bool(supabase_key)}")
    print(f"DEBUG - SUPABASE_BUCKET: {supabase_bucket}")
    
    if supabase_url and supabase_key and supabase_bucket:
        try:
            supabase_storage.init(
                url=supabase_url,
                key=supabase_key,
                bucket_name=supabase_bucket
            )
            print(f"Supabase Storage initialized with bucket: {supabase_bucket}")
        except Exception as e:
            print(f"Failed to initialize Supabase Storage: {e}")
            import traceback
            traceback.print_exc()
    else:
        print("Supabase Storage credentials not found in config")
