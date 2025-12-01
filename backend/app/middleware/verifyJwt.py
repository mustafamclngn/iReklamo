from functools import wraps
from flask import request, jsonify
import jwt
from jwt import ExpiredSignatureError, InvalidTokenError
from app.config import Config

def verify_jwt(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        print("DEBUG verify_jwt: Starting JWT verification")
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            print("DEBUG verify_jwt: Missing or invalid Authorization header")
            return jsonify({"error": "Missing or invalid Authorization header"}), 401

        token = auth_header.split(" ")[1]

        try:
            decoded = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=["HS256"])
            request.user = decoded
            print(f"DEBUG verify_jwt: SUCCESS - Token decoded, user_id: {decoded.get('user_id')}, role: {decoded.get('role')}")
            print(f"DEBUG verify_jwt: request.user set: {hasattr(request, 'user')}")

        except ExpiredSignatureError:
            print("DEBUG verify_jwt: Token expired")
            return jsonify({"error": "Access token expired"}), 401
        except InvalidTokenError:
            print("DEBUG verify_jwt: Invalid token")
            return jsonify({"error": "Invalid token"}), 403
        except Exception as e:
            print(f"DEBUG verify_jwt: Token validation failed: {e}")
            return jsonify({"error": f"Token validation failed: {e}"}), 401

        return f(*args, **kwargs)
    return decorated
