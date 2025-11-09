from flask import Blueprint, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from app.config import DB_CONFIG

# Create blueprint
sa_dashboard_bp = Blueprint('sa_dashboard', __name__, url_prefix='/api/sa_dashboard')

CORS(sa_dashboard_bp)




@sa_dashboard_bp.route('/all_count', methods=['GET'])
def get_all_counts():
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("SELECT COUNT(*) AS total FROM complaints;")
    total = cursor.fetchone()['total']

    cursor.execute("SELECT COUNT(*) AS pending FROM complaints WHERE status = 'pending';")
    pending = cursor.fetchone()['pending']

    cursor.execute("SELECT COUNT(*) AS in_progress FROM complaints WHERE status='in_progress';")
    in_progress = cursor.fetchone()['in_progress']

    cursor.execute("SELECT COUNT(*) AS resolved FROM complaints WHERE status = 'resolved';")
    resolved = cursor.fetchone()['resolved']

    cursor.close()
    conn.close()

    return jsonify({
        "total": total,
        "pending": pending,
        "in_progress": in_progress,
        "resolved": resolved
    })
