from flask import jsonify
from app.functions.Select import Select

def role_list():
    try:
        selector = Select()
        
        result = selector\
                    .table("roles")\
                    .execute()\
                    .retDict()
        
        print(result)
        
        return jsonify({
            'success': True,
            'data': result
        }), 200
        
    except Exception as e:
        print(f"Error fetching roles: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500