# app/middleware/verify_roles.py
from functools import wraps
from flask import jsonify, request

def verify_roles(*allowed_roles):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            user_data = getattr(request, "user", None)
            if not user_data:
                print("DEBUG verify_roles: No user_data found - JWT middleware may not have run")
                return jsonify({"error": "Unauthorized"}), 401

            role_data = user_data.get("role")
            print("DEBUG verify_roles:")
            print(f"  user_data exists: {bool(user_data)}")
            print(f"  raw role_data from JWT: {role_data} (type: {type(role_data)})")

            if isinstance(role_data, list):
                roles = role_data
                print(f"  roles (list): {roles}")
            else:
                roles = [role_data] if role_data is not None else []
                print(f"  roles (converted): {roles}")

            print(f"  allowed_roles: {allowed_roles}")
            print(f"  any(role in allowed_roles for role in roles): {any(role in allowed_roles for role in roles)}")

            if not any(role in allowed_roles for role in roles):
                print(f"  DENIED: User roles {roles} not in allowed roles {allowed_roles}")
                return jsonify({"error": "Forbidden: insufficient role"}), 403

            print("  ALLOWED: Access granted")
            return f(*args, **kwargs)
        return decorated
    return decorator
