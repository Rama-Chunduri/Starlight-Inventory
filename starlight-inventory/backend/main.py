from fastapi import FastAPI, HTTPException, Depends
from auth import validate_login
from auth import create_user
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from neo4j import GraphDatabase
from fastapi import Query
from typing import List, Dict
from fastapi import Request
import pandas as pd
from io import StringIO
from fastapi import Body
import json
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
import bcrypt
import secrets

class LoginRequest(BaseModel):
    username: str
    password: str

class SignUpRequest(BaseModel):
    firstname: str
    lastname: str
    username: str
    password: str

class UserRequest(BaseModel):
    firstname: str
    lastname: str
    username: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend.onrender.com","http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

SECRET_KEY = secrets.token_urlsafe(64)
ALGORITHM = 'HS256'
oauth2scheme = OAuth2PasswordBearer(tokenUrl="login")
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_jwt_token(username : str):
    return jwt.encode({"sub":username}, SECRET_KEY, algorithm=ALGORITHM)

def verify_password(plain_password: str, hashed_password: str):
    bcrypt.checkpw(plain_password.encode(), hashed_password.encode())

@app.get("/me")
def get_current_user(token: str = Depends(oauth2scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        conn = mysql.connector.connect(
            host = "localhost",
            user = "root",
            password = "Rajahmundry",
            database = "starlight_inventory"
        )
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT username, first_name, last_name FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.post("/add-user")
def add_user(data: UserRequest):
    try:
        conn = mysql.connector.connect(
            host = "localhost",
            user = "root",
            password = "Rajahmundry",
            database = "starlight_inventory"
        )
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO users (first_name, last_name, username)
            VALUES (%s, %s, %s)
        """, (data.firstname, data.lastname, data.username))
        conn.commit()
        cursor.close()
        conn.close()
        return {"status": "success"}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err))
    
@app.post("/login")
def login(data: LoginRequest):
    try:
       conn = mysql.connector.connect(
           host = "localhost",
           user = "root",
           password = "Rajahmundry",
           database = "starlight_inventory"
       )
       cursor = conn.cursor()
       cursor.execute("SELECT password_hash, first_name, last_name FROM users WHERE username = %s", (data.username,))
       result = cursor.fetchone()
       cursor.close()
       conn.close()
       if not result:
            raise HTTPException(status_code=401, detail="Invalid credentials")
       stored_hash = result[0]
       if not bcrypt.checkpw(data.password.encode(), stored_hash.encode()):
            raise HTTPException(status_code=401, detail="Invalid credentials")
       to_encode = {
            "sub": data.username,
            "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        }
       token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
       return {"access_token": token, "token_type": "bearer"}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err))


@app.post("/signup")
def signup(data: SignUpRequest):
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Rajahmundry",
            database="starlight_inventory"
        )
        cursor = conn.cursor()

        # Check if user exists and password hasn't been set yet
        cursor.execute(
            "SELECT password_hash FROM users WHERE username = %s",
            (data.username,)
        )
        result = cursor.fetchone()

        if not result:
            raise HTTPException(status_code=404, detail="Username not found")

        if result[0] is not None:
            raise HTTPException(status_code=400, detail="Password already set. Please login instead.")
        
        hashed_password = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt()).decode()

        cursor.execute(
            "UPDATE users SET password_hash = %s WHERE username = %s",
            (hashed_password, data.username)
        )

        conn.commit()
        cursor.close()
        conn.close()
        return {"status": "Password set successfully. You can now login."}

    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err))

@app.get("/implant-inventory-view")
def get_implant_inventory():
    conn = mysql.connector.connect(
        host = "localhost",
        user = "root",
        password = "Rajahmundry",
        database = 'starlight_inventory'
    )
    cursor = conn.cursor(dictionary=True)
    sql = "SELECT * FROM implant_inventory"
    cursor.execute(sql)
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows


@app.get("/fr-table-view")
def get_fr_table():
    conn = mysql.connector.connect(
        host = "localhost",
        user = "root",
        password = "Rajahmundry",
        database = 'starlight_inventory'
    )
    cursor = conn.cursor(dictionary=True)
    sql = "SELECT * FROM frbom"
    cursor.execute(sql)
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows

@app.get("/user-history-table")
def get_implant_inventory():
    conn = mysql.connector.connect(
        host = "localhost",
        user = "root",
        password = "Rajahmundry",
        database = 'starlight_inventory'
    )
    cursor = conn.cursor(dictionary=True)
    sql = "SELECT * FROM user_history"
    cursor.execute(sql)
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows

@app.get("/update-permissions")
def get_user_table():
    conn = mysql.connector.connect(
        host = "localhost",
        user = "root",
        password = "Rajahmundry", 
        database = 'starlight_inventory'
    )
    cursor = conn.cursor(dictionary=True)
    sql = "SELECT id, username, first_name, last_name, roles FROM users"
    cursor.execute(sql)
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows

@app.get("/stent-bom-table-view")
def get_user_table():
    conn = mysql.connector.connect(
        host = "localhost",
        user = "root",
        password = "Rajahmundry", 
        database = 'starlight_inventory'
    )
    cursor = conn.cursor(dictionary=True)
    sql = "SELECT * FROM stentbom"
    cursor.execute(sql)
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows

@app.get("/stent-inventory-table-view")
def get_stent_inventory():
    conn = mysql.connector.connect(
        host = "localhost",
        user = "root",
        password = "Rajahmundry", 
        database = 'starlight_inventory'
    )
    cursor = conn.cursor(dictionary=True)
    sql = "SELECT * FROM stent_inventory"
    cursor.execute(sql)
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows

@app.get("/finished-goods-table")
def get_stent_inventory():
    conn = mysql.connector.connect(
        host = "localhost",
        user = "root",
        password = "Rajahmundry", 
        database = 'starlight_inventory'
    )
    cursor = conn.cursor(dictionary=True)
    sql = "SELECT * FROM finished_goods"
    cursor.execute(sql)
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows

@app.get("/stent-lots-table-view")
def get_stent_lots(rejectState: str = Query("all")):
    conn = mysql.connector.connect(
        host = "localhost",
        user = "root",
        password = "Rajahmundry", 
        database = 'starlight_inventory'
    )
    cursor = conn.cursor(dictionary=True)
    if rejectState == "accept":
        sql = "SELECT * FROM stent_lot_management_table WHERE status = 'accept' "
    elif rejectState == "reject":
        sql = "SELECT * FROM stent_lot_management_table WHERE status = 'reject' "
    else:
        sql = "SELECT * FROM stent_lot_management_table"
    cursor.execute(sql)
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows

driver = GraphDatabase.driver(
    "bolt://localhost:7687",
    auth=("neo4j", "StarlightInventory123!!") 
)

@app.get("/stent-bom-graph-view")
def get_graph():
    try:
        with driver.session() as session:
            result = session.run("MATCH (n)-[r:SUB_COMPONENT_OF]->(m) RETURN n,r,m LIMIT 100")
            nodes = {}
            links =[]
            for record in result:
                for node in [record["n"], record["m"]]:
                    if node.id not in nodes:
                        nodes[node.id] = {
                            "id": str(node.id),
                            "label": list(node.labels)[0],
                            "description": node.get("description", ""),
                            "part_number": str(node.get("part_number")),
                            "units": str(node.get("units")),
                            "quantity": str(node.get("quantity")) 
                        }
                    rel = record["r"]
                    links.append({
                        "source": str(rel.start_node.id),
                        "target": str(rel.end_node.id),
                        "type": rel.type
                    })
            return {"nodes": list(nodes.values()), "links": links}
    except Exception as e:
        print("INTERNAL SERVER ERROR:", e)
        return {"error": str(e)}
    


dr = GraphDatabase.driver(
    "bolt://localhost:7687",
    auth=("neo4j", "StarlightInventory123!!") 
)
    
@app.get("/fr-bom-graph-view")
def get_graph_fr():
    try:
        with dr.session(database="flowrestrictorbom") as session:
            result = session.run("MATCH (parent)-[r:SUB_COMPONENT_OF]->(child) RETURN parent, r, child LIMIT 100")
            nodes = {}
            links = []
            for record in result:
                for node in [record["parent"], record["child"]]:
                    if node.id not in nodes:
                        nodes[node.id] = {
                            "id": str(node.id),
                            "label": list(node.labels)[0],
                            "description": node.get("description", ""),
                            "number": str(node.get("number")),
                            "owner": str(node.get("owner")),
                            "inspection_instructions": str(node.get("inspection_instructions")),
                            "notes": str(node.get("notes")),
                            "part_number": str(node.get("part_number")),
                            "units": str(node.get("units")),
                            "quantity": str(node.get("quantity")) 
                        }
                rel = record["r"]
                links.append({
                    "source": str(rel.start_node.id),  # parent
                    "target": str(rel.end_node.id),    # child
                    "type": rel.type
                })
        return {"nodes": list(nodes.values()), "links": links}
    except Exception as e:
        import traceback
        traceback.print_exc()  # prints the full error stack trace to your server logs
        return {"error": str(e)}

@app.get('/frkits')
def get_fr_kit_builds(request: Request):
    ids_param = request.query_params.get("ids")
    if not ids_param:
        return {"error": "No ids provided"}
    ids = [int(x.strip()) for x in ids_param.split(',')]
    
    kits = []
    with dr.session(database="flowrestrictorbom") as session:
        result = session.run("""
            MATCH (kit)
            WHERE id(kit) IN $node_ids
            OPTIONAL MATCH (comp)-[:SUB_COMPONENT_OF]->(kit)
            RETURN kit, collect(DISTINCT comp) AS components
        """, {"node_ids": ids})

        for record in result:
            kit_node = record["kit"]
            comp_nodes = record["components"]
            kit = {
                "id": kit_node.get("id", str(kit_node.id)),
                "name": kit_node.get("description", "Unnamed kit"),
                "components": []
            }
            for comp in comp_nodes:
                kit["components"].append({
                    "part_number": comp.get("part_number", ""),
                    "description": comp.get("description", ""),
                    "quantity": comp.get("quantity", 1),
                    "units": comp.get("units", 1)
                })
            kits.append(kit)

    return kits

@app.get('/kits')
def get_kit_builds(request: Request):
    ids_param = request.query_params.get("ids")
    if not ids_param:
        return {"error": "No ids provided"}
    ids = [int(x.strip()) for x in ids_param.split(',')]
    
    kits = []
    with driver.session() as session:
        result = session.run("""
            MATCH (kit)
            WHERE id(kit) IN $node_ids
            OPTIONAL MATCH (comp)-[:SUB_COMPONENT_OF]->(kit)
            RETURN kit, collect(DISTINCT comp) AS components.
        """, {"node_ids": ids})

        for record in result:
            kit_node = record["kit"]
            comp_nodes = record["components"]
            kit = {
                "id": kit_node.get("id", str(kit_node.id)),
                "name": kit_node.get("description", "Unnamed kit"),
                "components": []
            }
            for comp in comp_nodes:
                kit["components"].append({
                    "part_number": comp.get("part_number", ""),
                    "description": comp.get("description", ""),
                    "quantity": comp.get("quantity", 1),
                    "units": comp.get("units", 1)
                })
            kits.append(kit)

    return kits

@app.post('/add-data')
async def add_data_to_database(formData: dict=Body(...)):
    print("Received formData keys:", list(formData.keys()))
    conn = mysql.connector.connect(
        host = "localhost",
        user = "root",
        password = "Rajahmundry", 
        database = 'starlight_inventory'
    )
    cursor = conn.cursor(dictionary=True)
    columns = ','.join(formData.keys())
    placeholders = ','.join(['%s'] * len(formData))
    values = tuple(formData.values())
    sql = f"""INSERT INTO implant_inventory ({columns}) VALUES ({placeholders})"""
    cursor.execute(sql, values)
    conn.commit()
    cursor.close()
    conn.close()
    return {"status": "success"}

@app.post('/add-data-lots')
async def add_data_to_database(formData: dict=Body(...)):
    print("Received formData keys:", list(formData.keys()))
    conn = mysql.connector.connect(
        host = "localhost",
        user = "root",
        password = "Rajahmundry", 
        database = 'starlight_inventory'
    )
    cursor = conn.cursor(dictionary=True)
    columns = ','.join(formData.keys())
    placeholders = ','.join(['%s'] * len(formData))
    values = tuple(formData.values())
    sql = f"""INSERT INTO stent_lot_management_table ({columns}) VALUES ({placeholders})"""
    cursor.execute(sql, values)
    conn.commit()
    cursor.close()
    conn.close()
    return {"status": "success"}

@app.post("/add-csv")
async def add_csv_to_database(request: Request):
    data = await request.json()
    csv_text = data['csv']
    df = pd.read_csv(StringIO(csv_text), dtype=str)

    # Convert mass_loss to numeric (coerce errors to NaN)
    df['numerical_dimension'] = pd.to_numeric(df.get('numerical_dimension'), errors='coerce')

    expected_cols = [
        "label", "serial_number", "design", "size", "notes", "restriction_size",
        "test_allocation", "coating_lot", "ePTFE_Vendor_Lot", "surface_area",
        "revision", "lot_name", "flared", "feature_label", "mass_loss"
    ]
    for col in expected_cols:
        if col not in df.columns:
            df[col] = None

    # Drop rows missing critical fields only
    df_clean = df.dropna(subset=["serial_number", "feature_label", "mass_loss"]).copy()
    df_clean["numerical_dimension"] = pd.to_numeric(df_clean["numerical_dimension"], errors="coerce")

    index_cols = [
        "label", "serial_number", "design", "size", "notes", "restriction_size",
        "test_allocation", "coating_lot", "ePTFE_Vendor_Lot", "surface_area",
        "revision", "lot_name", "flared", "mass_loss"
    ]

    pivoted = df_clean.pivot_table(
    index=index_cols,
    columns="feature_label",
    values="numerical_dimension",
    aggfunc="mean",  # handles multiple rows with same serial_number + feature_label
        ).reset_index()

    # Flatten MultiIndex columns if needed
    pivoted.columns.name = None
    pivoted.columns = [str(col) for col in pivoted.columns]


    # Fill missing values in index columns with empty string to avoid groupby dropping rows
    for col in index_cols:
        df_clean[col] = df_clean[col].fillna('')

    grouped = df_clean.groupby(index_cols + ["feature_label"])["numerical_dimension"].mean()
    pivot = grouped.unstack("feature_label").reset_index()

    pivot = pivot.where(pd.notnull(pivot), None)

    print("Pivoted DataFrame:")
    print(pivot.head())
    print("printing")
    print(pivot["SW1"])


    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Rajahmundry",
        database="starlight_inventory"
    )
    cursor = conn.cursor()

    cols = list(pivot.columns)
    placeholders = ", ".join(["%s"] * len(cols))
    col_names = ", ".join(cols)

    insert_sql = f"INSERT INTO implant_inventory ({col_names}) VALUES ({placeholders})"

    cursor.executemany(insert_sql, pivot.values.tolist())
    conn.commit()

    cursor.close()
    conn.close()

    return {"status": "success", "rows": len(pivot)}

@app.post('/add-csv-lots')
async def add_csv_to_database_lots(request: Request):
    data = await request.json()
    csv_text = data['csv']
    print(csv_text)
    csv_file_like = StringIO(csv_text)
    conn = mysql.connector.connect(
        host = "localhost",
        user = "root",
        password = "Rajahmundry", 
        database = 'starlight_inventory'
    )
    df = pd.read_csv(csv_file_like)
    columnns = ','.join(df.columns)
    placeholders = ','.join(['%s']*len(df.columns))
    cursor = conn.cursor()
    sql = f"""INSERT INTO stent_lot_management_table (lot_name, quantity, part_number, part_name) VALUES ({placeholders})"""
    
    for index, row in df.iterrows():
        cursor.execute(sql, tuple(row))
    conn.commit()
    cursor.close()
    conn.close()
    return {"status": "success"}

@app.post('/delete-data')
async def delete_from_database(filter: dict = Body(...)):
    if not filter:
        return {"error": "No filter fields provided"}
    conn = mysql.connector.connect(
        host = "localhost",
        user = "root",
        password = "Rajahmundry", 
        database = 'starlight_inventory'
    )
    where_clause = " AND ".join([f"{key} = %s" for key in filter])
    sql = f"DELETE FROM implant_inventory WHERE {where_clause}"
    cursor = conn.cursor()
    cursor.execute(sql, list(filter.values()))
    conn.commit()
    cursor.close()
    conn.close()
    return {"status": "success", "deleted_rows": cursor.rowcount}

@app.put("/implant-inventory-update")
def update_implant_inventory(item: dict=Body(...)):
    unique_id = item.get("unique_id")
    if not unique_id:
        return {"error" : "unique_id is required"}
    update_fields = {k: v for k, v in item.items() if k != "unique_id"}
    if not update_fields:
        return {"error": "No fields to update"}
    
    set_clause = ",".join([f"{key} = %s" for key in update_fields])
    values = list(update_fields.values()) + [unique_id]

    conn = mysql.connector.connect(
        host = "localhost",
        user = "root",
        password = "Rajahmundry",
        database = 'starlight_inventory'
    )
    cursor = conn.cursor(dictionary=True)
    sql = f"UPDATE implant_inventory SET {set_clause} WHERE unique_id = %s"
    cursor.execute(sql, values)
    conn.commit()
    cursor.close()
    conn.close()
    return {"status" : "success", "updated_id": unique_id}


@app.put("/stent-lots-update")
def update_stent_lots(item: dict=Body(...)):
    unique_id = item.get("unique_id")
    if not unique_id:
        return {"error" : "unique_id is required"}
    update_fields = {k: v for k, v in item.items() if k != "unique_id"}
    if not update_fields:
        return {"error": "No fields to update"}
    
    set_clause = ",".join([f"{key} = %s" for key in update_fields])
    values = list(update_fields.values()) + [unique_id]

    conn = mysql.connector.connect(
        host = "localhost",
        user = "root",
        password = "Rajahmundry",
        database = 'starlight_inventory'
    )
    cursor = conn.cursor(dictionary=True)
    sql = f"UPDATE stent_lot_management_table SET {set_clause} WHERE unique_id = %s"
    cursor.execute(sql, values)
    conn.commit()
    cursor.close()
    conn.close()
    return {"status" : "success", "updated_id": unique_id}

@app.put("/stent-inventory-update")
def update_stent_inventory(item: dict=Body(...)):
    id = item.get("id")
    if not id:
        return {"error" : "id is required"}
    update_fields = {k: v for k, v in item.items() if k != "id"}
    if not update_fields:
        return {"error": "No fields to update"}
    
    set_clause = ",".join([f"{key} = %s" for key in update_fields])
    values = list(update_fields.values()) + [id]

    conn = mysql.connector.connect(
        host = "localhost",
        user = "root",
        password = "Rajahmundry",
        database = 'starlight_inventory'
    )
    cursor = conn.cursor(dictionary=True)
    sql = f"UPDATE stent_inventory SET {set_clause} WHERE id = %s"
    cursor.execute(sql, values)
    conn.commit()
    cursor.close()
    conn.close()
    return {"status" : "success", "updated_id": id}

@app.put("/fr-update")
def update_implant_inventory(item: dict=Body(...)):
    unique_id = item.get("unique_id")
    if not unique_id:
        return {"error" : "unique_id is required"}
    update_fields = {k: v for k, v in item.items() if k != "unique_id"}
    if not update_fields:
        return {"error": "No fields to update"}
    
    set_clause = ",".join([f"{key} = %s" for key in update_fields])
    values = list(update_fields.values()) + [unique_id]

    conn = mysql.connector.connect(
        host = "localhost",
        user = "root",
        password = "Rajahmundry",
        database = 'starlight_inventory'
    )
    cursor = conn.cursor(dictionary=True)
    sql = f"UPDATE frbom SET {set_clause} WHERE unique_id = %s"
    cursor.execute(sql, values)
    conn.commit()
    cursor.close()
    conn.close()
    return {"status" : "success", "updated_id": unique_id}

@app.delete("/implant-inventory-delete-row")
def delete_row_implant_inventory(item: dict=Body(...)):
    unique_id = item.get("unique_id")
    if not unique_id:
        return {"error" : "unique_id is required"}

    conn = mysql.connector.connect(
        host = "localhost",
        user = "root",
        password = "Rajahmundry",
        database = 'starlight_inventory'
    )
    cursor = conn.cursor(dictionary=True)
    sql = f"DELETE FROM implant_inventory WHERE unique_id = %s"
    cursor.execute(sql, (unique_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"status" : "success", "updated_id": unique_id}


@app.delete("/stent-lots-delete-row")
def delete_row_stent_lots(item: dict=Body(...)):
    unique_id = item.get("unique_id")
    if not unique_id:
        return {"error" : "unique_id is required"}

    conn = mysql.connector.connect(
        host = "localhost",
        user = "root",
        password = "Rajahmundry",
        database = 'starlight_inventory'
    )
    cursor = conn.cursor(dictionary=True)
    sql = f"DELETE FROM stent_lot_management_table WHERE unique_id = %s"
    cursor.execute(sql, (unique_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"status" : "success", "updated_id": unique_id}

@app.delete("/fr-delete-row")
def delete_row_implant_inventory(item: dict=Body(...)):
    unique_id = item.get("unique_id")
    if not unique_id:
        return {"error" : "unique_id is required"}

    conn = mysql.connector.connect(
        host = "localhost",
        user = "root",
        password = "Rajahmundry",
        database = 'starlight_inventory'
    )
    cursor = conn.cursor(dictionary=True)
    sql = f"DELETE FROM frbom WHERE unique_id = %s"
    cursor.execute(sql, (unique_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"status" : "success", "updated_id": unique_id}

@app.put("/stent-bom-update")
def update_stent_bom(item: dict=Body(...)):
    unique_id = item.get("unique_id")
    if not unique_id:
        return {"error" : "unique_id is required"}
    update_fields = {k: v for k, v in item.items() if k != "unique_id"}
    if not update_fields:
        return {"error": "No fields to update"}
    
    set_clause = ",".join([f"{key} = %s" for key in update_fields])
    values = list(update_fields.values()) + [unique_id]

    conn = mysql.connector.connect(
        host = "localhost",
        user = "root",
        password = "Rajahmundry",
        database = 'starlight_inventory'
    )
    cursor = conn.cursor(dictionary=True)
    sql = f"UPDATE stentbom SET {set_clause} WHERE unique_id = %s"
    cursor.execute(sql, values)
    conn.commit()
    cursor.close()
    conn.close()
    return {"status" : "success", "updated_id": unique_id}

@app.delete("/stent-bom-delete-row")
def delete_row_implant_inventory(item: dict=Body(...)):
    unique_id = item.get("unique_id")
    if not unique_id:
        return {"error" : "unique_id is required"}

    conn = mysql.connector.connect(
        host = "localhost",
        user = "root",
        password = "Rajahmundry",
        database = 'starlight_inventory'
    )
    cursor = conn.cursor(dictionary=True)
    sql = f"DELETE FROM stentbom WHERE unique_id = %s"
    cursor.execute(sql, (unique_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"status" : "success", "updated_id": unique_id}

@app.get("/lots")
def get_lots(part_numbers: List[str] = Query(...)):
    #print("Received request with:", part_numbers)
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Rajahmundry",
        database="starlight_inventory"
    )
    cursor = conn.cursor(dictionary=True)

    format_strings = ','.join(['%s'] * len(part_numbers))
    cursor.execute(f"SELECT * FROM stent_lot_management_table WHERE part_number IN ({format_strings})", tuple(part_numbers))
    rows = cursor.fetchall()
    
    cursor.close()
    conn.close()
    return rows

@app.get("/lots-preview", response_model=List[Dict])
def get_lots_preview(unique_ids: List[int] = Query(...)) -> List[Dict]:
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Rajahmundry",
        database="starlight_inventory"
    )
    cursor = conn.cursor(dictionary=True)

    format_strings = ','.join(['%s'] * len(unique_ids))
    cursor.execute(
        f"SELECT * FROM stent_lot_management_table WHERE unique_id IN ({format_strings})",
        tuple(unique_ids)
    )
    rows = cursor.fetchall()

    cursor.close()
    conn.close()
    return rows

@app.get("/preview-inventory")
def get_parts(ids: str):
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Rajahmundry",
        database="starlight_inventory"
    )
    cursor = conn.cursor(dictionary=True)
    id_list = [int(i.strip()) for i in ids.split(",")]
    placeholders = ','.join(['%s'] * len(id_list))
    query = f"SELECT * FROM stent_lot_management_table WHERE unique_id IN ({placeholders})"
    cursor.execute(query, id_list)
    rows = cursor.fetchall()
    return [{"id": row["unique_id"], "part_name": row["part_name"], "quantity": row["quantity"]} for row in rows]

@app.post("/update-quantities") #confirming the preview inventory
def update_quantities(updates: List[dict]):
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Rajahmundry",
        database="starlight_inventory"
    )
    cursor = conn.cursor(dictionary=True)
    for update in updates:
        cursor.execute("UPDATE stent_lot_management_table SET quantity = %s WHERE id = %s", (update["new_quantity"], update["id"]))
    conn.commit()
    return {"status": "success"}

class UpdateLotItem(BaseModel):
    unique_id: int
    updated_quantity: int
    
@app.post("/update-lots")
def update_lots( user_id: str, items: List[UpdateLotItem],request: Request = None):
    ip = request.client.host
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Rajahmundry",
        database="starlight_inventory"
    )
    cursor = conn.cursor()
    print(user_id)
    for item in items:
        cursor.execute(
            "UPDATE stent_lot_management_table SET quantity = %s WHERE unique_id = %s",
            (item.updated_quantity, item.unique_id)
        )
    cursor.execute(
    "INSERT INTO user_history (username, actions, ip_address, status) VALUES (%s, %s, %s, %s)",
    (user_id, 'build', ip, 'success')
    )
    cursor.execute(
    "INSERT INTO finished_goods (part_number, expiration_date) VALUES ('STR-DA2-FS-00001.00', DATE_ADD(CURRENT_DATE, INTERVAL 3 YEAR))"
    )
    conn.commit()
    cursor.close()
    conn.close()

    return {"status": "success", "updated": len(items)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", port=8000, reload=True)
