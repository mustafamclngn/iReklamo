from flask import jsonify
from app.functions.Select import Select

def position_list():
    try:
        selector = Select()
        
        result = selector\
                    .table("barangay_positions")\
                    .execute()\
                    .retDict()
        
        print(result)
        
        return jsonify({
            'success': True,
            'data': result
        }), 200
        
    except Exception as e:
        print(f"Error fetching positions: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500