from flask import request
from app import create_app

app = create_app()

@app.before_request
def handle_preflight():
    if request.method == 'OPTIONS':
        return '', 200

if __name__ == '__main__':
    app.run(debug=True)
