import bcrypt
import mysql.connector

#new user
username = input("Enter your username:")
pw = input("Enter your password")

def create_user(username, password):
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    password_hash = hashed.decode()
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Rajahmundry",
        database="starlight_inventory"
    )
    cursor = conn.cursor()
    s = "SELECT COUNT(*) FROM users WHERE username = %s"
    v = (username,)
    cursor.execute(s,v)
    result = cursor.fetchone()
    if result[0] != 0:
        return "user already exists"
    sql = "INSERT INTO users (username, password_hash) VALUES (%s, %s)"
    val = (username, password_hash)
    cursor.execute(sql, val)
    conn.commit()
    cursor.close()
    conn.close()
    return "user created"

#create_user(username, pw)

def validate_login(user_name, password):
    conn = mysql.connector.connect(
        host = "localhost",
        user = "root",
        password = "Rajahmundry",
        database = "starlight_inventory"
    )
    cursor = conn.cursor()
    sql = "SELECT password_hash FROM users WHERE username = %s"
    cursor.execute(sql, (user_name,))
    result = cursor.fetchone()
    if result is None:
        print("invalid")
        return
    conn.commit()
    cursor.close()
    conn.close()
    stored_hash = result[0]
    if bcrypt.checkpw(password.encode(), stored_hash.encode()):
        print("valid")
    else:
        print("invalid")

validate_login(username, pw)
