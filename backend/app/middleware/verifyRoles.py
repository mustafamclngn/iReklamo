# app/middleware/verify_roles.py
from functools import wraps
from flask import jsonify, request

def verify_roles(*allowed_roles):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            user_data = getattr(request, "user", None)
            if not user_data:
                return jsonify({"error": "Unauthorized"}), 401

            roles = user_data.get("role") if isinstance(user_data.get("role"), list) else [user_data.get("role")]
            print(roles)
            if not any(role in allowed_roles for role in roles):
                return jsonify({"error": "Forbidden: insufficient role"}), 403

            return f(*args, **kwargs)
        return decorated
    return decorator
