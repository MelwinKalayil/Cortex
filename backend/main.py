from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pymysql
import pymysql.cursors

from auth_utils import hash_password, verify_password, create_access_token

# --- App setup (like `app = Flask(__name__)`) ---
app = FastAPI()

# --- CORS (like flask_cors's CORS(app)) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DB connection (like a get_db() helper in Flask) ---
def get_db():
    conn = pymysql.connect(
        host="localhost",
        user="root",
        password="",          # XAMPP default
        database="cortex",
        cursorclass=pymysql.cursors.DictCursor,
    )
    try:
        yield conn
    finally:
        conn.close()

# --- Request/response shapes (like manually checking request.json in Flask,
#     but FastAPI validates this automatically) ---
class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str  # "admin" or "security"


# --- LOGIN endpoint ---
# Flask equivalent: @app.route("/auth/login", methods=["POST"])
@app.post("/auth/login")
def login(payload: LoginRequest, db=Depends(get_db)):
    cur = db.cursor()
    cur.execute(
        """
        SELECT u.user_id, u.name, u.email, u.password_hash, u.is_active, r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = %s
        """,
        (payload.email,),
    )
    user = cur.fetchone()

    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not user["is_active"]:
        raise HTTPException(status_code=403, detail="Account is disabled")

    token = create_access_token({"sub": str(user["user_id"]), "role": user["role_name"]})

    return {
        "access_token": token,
        "user": {
            "id": user["user_id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role_name"],
        },
    }


# --- REGISTER endpoint (this is your "insert through frontend") ---
# Flask equivalent: @app.route("/auth/register", methods=["POST"])
@app.post("/auth/register")
def register(payload: RegisterRequest, db=Depends(get_db)):
    cur = db.cursor()

    # 1. look up role_id from role name
    cur.execute("SELECT role_id FROM roles WHERE role_name = %s", (payload.role,))
    role = cur.fetchone()
    if not role:
        raise HTTPException(status_code=400, detail="Invalid role")

    # 2. check email isn't already taken
    cur.execute("SELECT user_id FROM users WHERE email = %s", (payload.email,))
    if cur.fetchone():
        raise HTTPException(status_code=400, detail="Email already registered")

    # 3. insert
    hashed = hash_password(payload.password)
    cur.execute(
        "INSERT INTO users (name, email, password_hash, role_id) VALUES (%s, %s, %s, %s)",
        (payload.name, payload.email, hashed, role["role_id"]),
    )
    db.commit()

    return {"message": "User created successfully"}


# --- health check (nice to have while testing) ---
@app.get("/")
def root():
    return {"status": "backend running"}