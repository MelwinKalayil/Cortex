import json
from typing import List

from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect
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


# ============================================================
# AUTH (unchanged from what you had)
# ============================================================

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str  # "admin" or "security"


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


@app.post("/auth/register")
def register(payload: RegisterRequest, db=Depends(get_db)):
    cur = db.cursor()

    cur.execute("SELECT role_id FROM roles WHERE role_name = %s", (payload.role,))
    role = cur.fetchone()
    if not role:
        raise HTTPException(status_code=400, detail="Invalid role")

    cur.execute("SELECT user_id FROM users WHERE email = %s", (payload.email,))
    if cur.fetchone():
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(payload.password)
    cur.execute(
        "INSERT INTO users (name, email, password_hash, role_id) VALUES (%s, %s, %s, %s)",
        (payload.name, payload.email, hashed, role["role_id"]),
    )
    db.commit()

    return {"message": "User created successfully"}


# ============================================================
# ZONES
# ============================================================

class ZoneRequest(BaseModel):
    name: str
    coordinates: List[List[float]]   # [[lat, lng], [lat, lng], ...]


@app.post("/zones")
def create_zone(payload: ZoneRequest, db=Depends(get_db)):
    cur = db.cursor()
    cur.execute(
        "INSERT INTO zones (name, coordinates) VALUES (%s, %s)",
        (payload.name, json.dumps(payload.coordinates)),
    )
    db.commit()
    new_id = cur.lastrowid
    return {"zone_id": new_id, "name": payload.name, "coordinates": payload.coordinates}


@app.get("/zones")
def get_zones(db=Depends(get_db)):
    cur = db.cursor()
    cur.execute("SELECT zone_id, name, coordinates FROM zones ORDER BY created_at DESC")
    rows = cur.fetchall()
    for row in rows:
        row["coordinates"] = json.loads(row["coordinates"])
    return rows


@app.delete("/zones/{zone_id}")
def delete_zone(zone_id: int, db=Depends(get_db)):
    cur = db.cursor()
    cur.execute("DELETE FROM zones WHERE zone_id = %s", (zone_id,))
    db.commit()
    return {"message": "Zone deleted"}


# ============================================================
# ALERTS (from Raspberry Pi)
# ============================================================

connected_clients: List[WebSocket] = []


def store_alert(payload: dict, db):
    cur = db.cursor()
    lat, lng = payload["details"]["target_coordinates"]

    cur.execute(
        """
        INSERT INTO alerts
        (event_id, event_type, severity, hazard_class, confidence,
         latitude, longitude, geofence_tag, detected_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (
            payload["event_id"],
            payload["event_type"],
            payload["severity"],
            payload["details"]["hazard_class"],
            payload["details"].get("confidence"),
            lat,
            lng,
            payload["details"].get("geofence_tag"),
            payload["timestamp"].replace("Z", ""),
        ),
    )
    db.commit()


@app.websocket("/ws/alerts")
async def alerts_ws(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    db_gen = get_db()
    db = next(db_gen)
    try:
        while True:
            data = await websocket.receive_json()   # from the Pi
            store_alert(data, db)
            for client in connected_clients:
                await client.send_json(data)          # broadcast to all (incl. Pi itself, harmless)
    except WebSocketDisconnect:
        connected_clients.remove(websocket)
    finally:
        db.close()


@app.get("/alerts/recent")
def recent_alerts(db=Depends(get_db)):
    cur = db.cursor()
    cur.execute("""
        SELECT event_id, event_type, severity, hazard_class,
               latitude, longitude, geofence_tag, detected_at
        FROM alerts
        ORDER BY detected_at DESC
        LIMIT 50
    """)
    return cur.fetchall()


# Manual test endpoint — lets you POST a fake alert without needing the Pi connected
class TestAlertRequest(BaseModel):
    event_id: str
    timestamp: str
    event_type: str
    severity: str
    details: dict


@app.post("/alerts/test")
def test_alert(payload: TestAlertRequest, db=Depends(get_db)):
    store_alert(payload.dict(), db)
    return {"message": "Test alert stored"}


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/")
def root():
    return {"status": "backend running"}