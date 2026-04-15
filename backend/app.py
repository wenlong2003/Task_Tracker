from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)  

# Database connection
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Cenyonny1976",
        database="task_db"
    )

# Test route
@app.route("/api/test", methods=["GET"])
def test():
    return jsonify({"message": "Server is running"}), 200

# GET all tasks for DEBUGGING
@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    user_id = request.args.get("userId")
    if not user_id:
        return jsonify({"error": "userId is required"}), 400
    cursor.execute("SELECT * FROM Tasks WHERE userId = %s", (user_id,))
    tasks = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(tasks)

# INSERT task
@app.route("/api/tasks", methods=["POST"])
def insert_task():
    data = request.get_json()

    required_fields = ["name", "startTime", "endTime", "userId"]

    if not data or any(field not in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    name = data["name"]
    startTime = data.get("startTime")
    endTime = data.get("endTime")
    description = data.get("description", "")
    userId = data.get("userId")

    conn = get_db_connection()
    cursor = conn.cursor()

    sql = "INSERT INTO Tasks (name, description, startTime, endTime, userId) VALUES (%s, %s, %s, %s, %s)"
    cursor.execute(sql, (name, description, startTime, endTime, userId))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Task inserted"}), 201

# Register route
@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    
    # Check required fields
    if not data or not data.get("username") or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Username, email and password are required"}), 400
    
    username = data["username"]
    email = data["email"]
    password = data["password"]
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Check if user exists
        cursor.execute("SELECT * FROM users WHERE username = %s OR email = %s", (username, email))
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({"error": "User already exists"}), 409
        
        # Create new user
        hashed_password = generate_password_hash(password)
        cursor.execute(
            "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
            (username, email, hashed_password)
        )
        conn.commit()
        
        # Get created user
        user_id = cursor.lastrowid
        cursor.execute("SELECT id, username, email, createdAt FROM users WHERE id = %s", (user_id,))
        new_user = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        return jsonify({
            "message": "Registration successful",
            "user": new_user
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Login route
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    
    # Check required fields
    if not data or not data.get("username") or not data.get("password"):
        return jsonify({"error": "Username and password are required"}), 400
    
    username = data["username"]
    password = data["password"]
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Find user by username or email
        cursor.execute("SELECT * FROM users WHERE username = %s OR email = %s", (username, username))
        user = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        # Check password
        if user and check_password_hash(user["password"], password):
            # Remove password from response
            user.pop("password")
            return jsonify({
                "message": "Login successful",
                "user": user
            }), 200
        else:
            return jsonify({"error": "Invalid credentials"}), 401
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)