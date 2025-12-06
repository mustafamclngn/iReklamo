from functools import wraps
from flask import request, jsonify
import jwt
from jwt import ExpiredSignatureError, InvalidTokenError
from app.config import Config

def verify_jwt(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid Authorization header"}), 401

        token = auth_header.split(" ")[1]

        try:
            decoded = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=["HS256"])
            request.user = decoded

        except ExpiredSignatureError:
            return jsonify({"error": "Access token expired"}), 401
        except InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 403
        except Exception as e:
            return jsonify({"error": f"Token validation failed: {e}"}), 401

        return f(*args, **kwargs)
    return decorated
