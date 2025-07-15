from fastapi import FastAPI
from auth import validate_login
from auth import create_user
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from neo4j import GraphDatabase
from fastapi import Query
from typing import List
from fastapi import Request
import pandas as pd
from io import StringIO
from fastapi import Body

class LoginRequest(BaseModel):
    username: str
    password: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your React frontend dev server
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers (like Content-Type, Authorization)
)

@app.post("/login")
def login(data: LoginRequest):
    try:
        result = validate_login(data.username, data.password)
        if result:
            return {
                "status": "valid",
                "first_name": result["first_name"],
                "last_name": result["last_name"]
            }
        else:
            return {"status": "invalid"}
    except Exception as e:
        print("Login error:", e)
        return {"status": "error", "detail": str(e)}


@app.post("/signup")
def signup(data : LoginRequest):
    result = create_user(data.username, data.password)
    return {"status":result}

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

@app.get("/update-permissions")
def get_user_table():
    conn = mysql.connector.connect(
        host = "localhost",
        user = "root",
        password = "Rajahmundry", 
        database = 'starlight_inventory'
    )
    cursor = conn.cursor(dictionary=True)
    sql = "SELECT id, username, first_name, last_name, phone_number, roles FROM users"
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

driver = GraphDatabase.driver(
    "bolt://localhost:7687",
    auth=("neo4j", "StarlightInventory123!!")  # <-- replace with yours
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

@app.post('/add-csv')
async def add_csv_to_database(request: Request):
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
    sql = f"""INSERT INTO implant_inventory (label, serial_number, design, size, notes, restriction_size, test_allocation, coating_lot, ePTFE_Vendor_Lot, surface_area, revision, lot_name, flared) VALUES ({placeholders})"""
    
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
    cursor.execute(sql)
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", port=8000, reload=True)
