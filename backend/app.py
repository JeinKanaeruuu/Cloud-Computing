from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2

def get_db_connection():
    conn = psycopg2.connect(
        host="localhost",
        database="cc",
        user="Mikoto",
        password="0"
    )
    return conn

# Inisialisasi aplikasi Flask
app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({"message": "Hello from Flask and Jein"})

# GET: Ambil semua item
@app.route('/api/items', methods=['GET'])
def get_items():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, name, description FROM items;")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    items = [{"id": row[0], "name": row[1], "description": row[2]} for row in rows]
    return jsonify(items)

# POST: Tambah item baru
@app.route('/api/items', methods=['POST'])
def create_item():
    data = request.json
    name = data['name']
    description = data['description']

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO items (name, description) VALUES (%s, %s) RETURNING id;",
                (name, description))
    new_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"id": new_id, "name": name, "description": description}), 201

# PUT: Update item berdasarkan ID
@app.route('/api/items/<int:id>', methods=['PUT'])
def update_item(id):
    data = request.json
    name = data.get('name')
    description = data.get('description')

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("UPDATE items SET name = %s, description = %s WHERE id = %s RETURNING id;",
                (name, description, id))
    updated_id = cur.fetchone()

    if updated_id is None:
        cur.close()
        conn.close()
        return jsonify({"error": "Item not found"}), 404

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"id": id, "name": name, "description": description})

# DELETE: Hapus item berdasarkan ID
@app.route('/api/items/<int:id>', methods=['DELETE'])
def delete_item(id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM items WHERE id = %s RETURNING id;", (id,))
    deleted_id = cur.fetchone()

    if deleted_id is None:
        cur.close()
        conn.close()
        return jsonify({"error": "Item not found"}), 404

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": f"Item with id {id} has been deleted."})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
