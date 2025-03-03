from flask import Flask, jsonify
from flask_cors import CORS 

app = Flask(__name__)
CORS(app)  # Izinkan CORS

@app.route('/')
def home():
    return jsonify({"message": "Hello from Flask and Jein"})

@app.route('/api/data')
def get_data():
    return jsonify({"data": "Hello from Flask API, created by Jein"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
