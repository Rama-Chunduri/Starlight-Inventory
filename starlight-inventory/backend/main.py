from fastapi import FastAPI
from auth import validate_login
from auth import create_user
from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str
    password: str

app = FastAPI()
@app.post("/login")
def login(data : LoginRequest):
    result = validate_login(data.username, data.password)
    return {"status":result}

@app.post("/signup")
def signup(data : LoginRequest):
    result = create_user(data.username, data.password)
    return {"status":result}