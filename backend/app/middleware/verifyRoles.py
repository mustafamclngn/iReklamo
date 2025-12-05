from functools import wraps
from flask import jsonify, request

def verify_roles(*allowed_roles):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            user_data = getattr(request, "user", None)
            if not user_data:
                return jsonify({"error": "Unauthorized"}), 401

            user_role = user_data.get("role")
            if not user_role:
                return jsonify({"error": "No role specified"}), 401

            # Ensure roles is a list regardless of JWT format
            if isinstance(user_role, list):
                roles = user_role
            else:
                roles = [user_role] if user_role is not None else []

            # Convert allowed_roles to set for faster lookup
            allowed_set = set(allowed_roles)

            # Check if any of the user's roles (handling both int/string types) are allowed
            role_authorized = False
            for role in roles:
                # Handle both integer and string role types from JWT
                try:
                    role_int = int(role) if isinstance(role, str) else role
                    if role_int in allowed_set:
                        role_authorized = True
                        break
                except (ValueError, TypeError):
                    continue

            if not role_authorized:
                return jsonify({"error": "Forbidden: insufficient role"}), 403

            return f(*args, **kwargs)
        return decorated
    return decorator
