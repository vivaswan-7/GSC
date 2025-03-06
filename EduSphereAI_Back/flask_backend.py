from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql

app = Flask(__name__)
CORS(app)  # Enable CORS to allow frontend communication

# Database Connection
db = pymysql.connect(
    host='localhost',  # Change this if your MySQL is hosted remotely
    user='root',      # Your MySQL username
    password='aug_30805ADIJHA@',  # Your MySQL password
    database='EduSphereDB'  # Database name
)

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        if not name or not email or not password:
            return jsonify({"message": "All fields are required"}), 400

        cursor = db.cursor()
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        existing_user = cursor.fetchone()

        if existing_user:
            return jsonify({"message": "User already exists"}), 409

        sql = "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)"
        cursor.execute(sql, (name, email, password))
        db.commit()

        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        print(e)
        return jsonify({"message": "Registration failed"}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"message": "All fields are required"}), 400

        cursor = db.cursor()
        cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s", (email, password))
        user = cursor.fetchone()

        if user:
            return jsonify({"message": "Login successful"}), 200
        else:
            return jsonify({"message": "Invalid credentials"}), 401

    except Exception as e:
        print(e)
        return jsonify({"message": "Login failed"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
