from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps

app = Flask(__name__)
CORS(app)

# CONFIG
SECRET_KEY = "super_secret_key_change_this"

# Database connection
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Cenyonny1976",
        database="task_db"
    )

# JWT MIDDLEWARE
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]

        if not token:
            return jsonify({"error": "Token missing"}), 401

        try:
            decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.user_id = decoded["user_id"]
        except:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)

    return decorated

# TEST ROUTE
@app.route("/api/test", methods=["GET"])
def test():
    return jsonify({"message": "Server is running"}), 200


# GET TASKS (PROTECTED)
@app.route("/api/tasks", methods=["GET"])
@token_required
def get_tasks():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    user_id = request.user_id
    cursor.execute("""
        SELECT *,
        CASE WHEN endTime < NOW() THEN 1 ELSE 0 END AS isExpired
        FROM Tasks
        WHERE userId = %s
        ORDER BY endTime ASC
    """, (user_id,))
    tasks = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(tasks)


# CREATE TASK (PROTECTED)
@app.route("/api/tasks", methods=["POST"])
@token_required
def insert_task():
    data = request.get_json()

    required_fields = ["name", "startTime", "endTime"]

    if not data or any(field not in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    name = data["name"]
    startTime = data.get("startTime")
    endTime = data.get("endTime")
    description = data.get("description", "")
    isAllDay = data.get("isAllDay", False)
    userId = request.user_id

    conn = get_db_connection()
    cursor = conn.cursor()

    sql = """
        INSERT INTO Tasks (name, description, startTime, endTime, isAllDay, userId)
        VALUES (%s, %s, %s, %s, %s, %s)
    """

    cursor.execute(sql, (name, description, startTime, endTime, isAllDay, userId))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Task inserted"}), 201


# DELETE TASK (PROTECTED)
@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
@token_required
def delete_task(task_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "DELETE FROM Tasks WHERE id = %s AND userId = %s",
            (task_id, request.user_id)
        )
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({"error": "Task not found"}), 404

        return jsonify({"message": "Task deleted"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()


# REGISTER
@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data or not data.get("username") or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Username, email and password are required"}), 400

    username = data["username"]
    email = data["email"]
    password = data["password"]

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            "SELECT * FROM Users WHERE username = %s OR email = %s",
            (username, email)
        )

        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({"error": "User already exists"}), 409

        hashed_password = generate_password_hash(password)

        cursor.execute(
            "INSERT INTO Users (username, email, password) VALUES (%s, %s, %s)",
            (username, email, hashed_password)
        )

        conn.commit()

        user_id = cursor.lastrowid

        cursor.execute(
            "SELECT id, username, email, createdAt FROM Users WHERE id = %s",
            (user_id,)
        )

        new_user = cursor.fetchone()

        cursor.close()
        conn.close()

        return jsonify({
            "message": "Registration successful",
            "user": new_user
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# LOGIN (JWT GENERATED HERE)
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data or not data.get("username") or not data.get("password"):
        return jsonify({"error": "Username and password are required"}), 400

    username = data["username"]
    password = data["password"]

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            "SELECT * FROM Users WHERE username = %s OR email = %s",
            (username, username)
        )

        user = cursor.fetchone()

        cursor.close()
        conn.close()

        if user and check_password_hash(user["password"], password):
            user.pop("password")

            token = jwt.encode(
                {
                    "user_id": user["id"],
                    "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
                },
                SECRET_KEY,
                algorithm="HS256"
            )

            return jsonify({
                "message": "Login successful",
                "token": token,
                "user": {
                    "id": user["id"],
                    "username": user["username"],
                    "email": user["email"]
                }
            }), 200

        return jsonify({"error": "Invalid credentials"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# UPDATE USER (USERNAME / EMAIL)
@app.route("/api/user", methods=["PUT"])
@token_required
def update_user():
    data = request.get_json()

    username = data.get("username")
    email = data.get("email")

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE Users
            SET username = %s, email = %s
            WHERE id = %s
        """, (username, email, request.user_id))

        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "User updated"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# CHANGE PASSWORD (PROTECTED)
@app.route("/api/user/password", methods=["PUT"])
@token_required
def change_password():
    data = request.get_json()

    current_password = data.get("currentPassword")
    new_password = data.get("newPassword")

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            "SELECT password FROM Users WHERE id = %s",
            (request.user_id,)
        )

        user = cursor.fetchone()

        if not user or not check_password_hash(user["password"], current_password):
            cursor.close()
            conn.close()
            return jsonify({"error": "Current password is incorrect"}), 400

        hashed = generate_password_hash(new_password)

        cursor = conn.cursor()

        cursor.execute(
            "UPDATE Users SET password = %s WHERE id = %s",
            (hashed, request.user_id)
        )

        conn.commit()

        # ensure update actually happened
        if cursor.rowcount == 0:
            cursor.close()
            conn.close()
            return jsonify({"error": "Password not updated"}), 500

        cursor.close()
        conn.close()

        return jsonify({"message": "Password updated"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# DELETE USER ACCOUNT (PROTECTED)
@app.route("/api/user", methods=["DELETE"])
@token_required
def delete_account():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # delete user's tasks first
        cursor.execute(
            "DELETE FROM Tasks WHERE userId = %s",
            (request.user_id,)
        )

        # delete user account
        cursor.execute(
            "DELETE FROM Users WHERE id = %s",
            (request.user_id,)
        )

        conn.commit()

        if cursor.rowcount == 0:
            cursor.close()
            conn.close()
            return jsonify({"error": "User not found"}), 404

        cursor.close()
        conn.close()

        return jsonify({"message": "Account deleted"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# RUN APP
if __name__ == "__main__":
    app.run(debug=True, port=5000)