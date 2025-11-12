import math
from flask import make_response, request, jsonify
from app.functions import Select

# ========================== 
# USER LIST
# ==========
def userList(): 
    
    tag = request.args.get('tag', '')
    key = request.args.get('key', '')
    sort = request.args.get('sort') or "user_id"
    order = request.args.get('order', 'asc')
    limit = int(request.args.get('size', 10)) 
    page = int(request.args.get('page', 0))

    selector = Select()   

    total       = selector\
                        .table("user")\
                        .search(tag, key)\
                        .execute()\
                        .retDict()
    contents = selector\
                        .table("users")\
                        .search(tag, key)\
                        .limit(limit)\
                        .offset(page)\
                        .sort(sort, order)\
                        .execute()\
                        .retDict()

    return jsonify({
        "data": contents,
        "total": len(total),
        "page": page,
        "limit": limit,
        "totalPages": math.ceil(len(total) / limit)
    }), 200
