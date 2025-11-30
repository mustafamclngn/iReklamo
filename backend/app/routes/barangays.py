from flask import Blueprint, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
from app.config import DB_CONFIG
from app.functions.Select import Select

barangays_bp = Blueprint('barangays', __name__, url_prefix='/api/barangays')

@barangays_bp.route('/', methods=['GET'])
def get_barangays():
    try:
        result = (Select()
                 .table('barangays')
                 .special_col(['id', 'name'])
                 .sort('name', 'ASC')
                 .execute()
                 .retDict())
        
        if result is None:
            result = []
        elif isinstance(result, dict):
            result = [result]
        
        return jsonify({
            'success': True,
            'data': result
        }), 200

    except Exception as e:
        print(f"Error fetching barangays: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@barangays_bp.route('/details', methods=['GET'])
def get_barangays_details():
    try:
        result = (Select()
                 .table('barangays b')
                 .special_col([
                     'b.id',
                     'b.name as barangay_name',
                     "CONCAT(u.first_name, ' ', u.last_name) as captain_name",
                     'u.email as captain_email',
                     'ui.contact_number as captain_contact',
                     'COUNT(DISTINCT c.id) as total_complaints',
                     "COUNT(DISTINCT CASE WHEN c.status = 'Pending' THEN c.id END) as pending_complaints",
                     "COUNT(DISTINCT CASE WHEN c.status = 'In-Progress' THEN c.id END) as inprogress_complaints",
                     "COUNT(DISTINCT CASE WHEN c.status = 'Resolved' THEN c.id END) as resolved_complaints",
                     'COUNT(DISTINCT comp.id) as total_residents'
                 ])
                 .join('LEFT JOIN', 'users u', 
                       "b.id = u.barangay_id AND u.role_id = (SELECT id FROM roles WHERE name = 'brgy_cap')")
                 .join('LEFT JOIN', 'user_info ui', 'u.user_id = ui.user_id')
                 .join('LEFT JOIN', 'complaints c', 'b.id = c.barangay_id')
                 .join('LEFT JOIN', 'complainants comp', 'b.id = comp.barangay_id')
                 .group('b.id, b.name, u.first_name, u.last_name, u.email, ui.contact_number')
                 .sort('b.name', 'ASC')
                 .execute()
                 .retDict())
        
        if result is None:
            result = []
        elif isinstance(result, dict):
            result = [result]
        
        return jsonify({
            'success': True,
            'data': result,
            'count': len(result)
        }), 200

    except Exception as e:
        print(f"Error fetching barangays details: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@barangays_bp.route('/<int:barangay_id>', methods=['GET'])
def get_barangay(barangay_id):
    try:
        result = (Select()
                 .table('barangays b')
                 .special_col([
                     'b.id',
                     'b.name as barangay_name',
                     "CONCAT(u.first_name, ' ', u.last_name) as captain_name",
                     'u.email as captain_email',
                     'ui.contact_number as captain_contact',
                     'COUNT(DISTINCT c.id) as total_complaints',
                     "COUNT(DISTINCT CASE WHEN c.status = 'Pending' THEN c.id END) as pending_complaints",
                     "COUNT(DISTINCT CASE WHEN c.status = 'In-Progress' THEN c.id END) as inprogress_complaints",
                     "COUNT(DISTINCT CASE WHEN c.status = 'Resolved' THEN c.id END) as resolved_complaints",
                     'COUNT(DISTINCT comp.id) as total_residents'
                 ])
                 .join('LEFT JOIN', 'users u', 
                       "b.id = u.barangay_id AND u.role_id = (SELECT id FROM roles WHERE name = 'brgy_cap')")
                 .join('LEFT JOIN', 'user_info ui', 'u.user_id = ui.user_id')
                 .join('LEFT JOIN', 'complaints c', 'b.id = c.barangay_id')
                 .join('LEFT JOIN', 'complainants comp', 'b.id = comp.barangay_id')
                 .search('b.id', barangay_id)
                 .group('b.id, b.name, u.first_name, u.last_name, u.email, ui.contact_number')
                 .execute()
                 .retDict())
        
        if not result:
            return jsonify({
                'success': False,
                'error': 'Barangay not found'
            }), 404
        
        if isinstance(result, list) and len(result) == 1:
            result = result[0]
        
        return jsonify({
            'success': True,
            'data': result
        }), 200

    except Exception as e:
        print(f"Error fetching barangay {barangay_id}: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500