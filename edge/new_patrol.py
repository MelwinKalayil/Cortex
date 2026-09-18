import cv2
import json
import uuid
import time
import base64
import random
from datetime import datetime, timezone
import websocket
from shapely.geometry import Point, Polygon
from ultralytics import YOLO

# ==============================================================================
# CONFIGURATION & SIMULATION PARAMETERS
# ==============================================================================
BACKEND_WS_URL = "ws://localhost:8000/ws/alerts"  # Replace localhost with backend IP when networked
MODEL_PATH = "VisDroneDetection/best.onnx"                         # Path to your ONNX or .pt model
ALERT_COOLDOWN_SEC = 5.0                         # Prevent alert spamming
INPUT_WIDTH = 640
INPUT_HEIGHT = 640

# Simulated Campus Boundaries (Vellore Sector)
CAMPUS_BOUNDARY = {
    "min_lat": 12.9690,
    "max_lat": 12.9715,
    "min_lon": 79.1555,
    "max_lon": 79.1590
}

# Initial Geofenced Zones (Rooftops & Restricted Quads)
DEFAULT_ZONES = [
    {
        "zone_id": "eng_block_rooftop",
        "zone_name": "Engineering Block Roof",
        "zone_type": "ROOFTOP",
        "severity": "CRITICAL",
        "restricted_classes": ["person", "lying_person"],
        "polygon": [
            [12.9698, 79.1565],
            [12.9705, 79.1565],
            [12.9705, 79.1572],
            [12.9698, 79.1572]
        ]
    },
    {
        "zone_id": "central_pedestrian_lawn",
        "zone_name": "Central Lawn Walkway",
        "zone_type": "RESTRICTED_GROUND",
        "severity": "HIGH",
        "restricted_classes": ["car", "bus", "truck", "van", "motor"],
        "polygon": [
            [12.9702, 79.1575],
            [12.9712, 79.1575],
            [12.9712, 79.1585],
            [12.9702, 79.1585]
        ]
    }
]

# Universal Hazards (Triggers alerts regardless of geofencing)
CRITICAL_HAZARDS = {"fire", "smoke", "crash", "lying_person"}


# ==============================================================================
# 1. DRONE TELEMETRY & COORDINATE CONVERSION
# ==============================================================================
class SimulatedDrone:
    def __init__(self, altitude_m=30.0):
        self.lat = (CAMPUS_BOUNDARY["min_lat"] + CAMPUS_BOUNDARY["max_lat"]) / 2
        self.lon = (CAMPUS_BOUNDARY["min_lon"] + CAMPUS_BOUNDARY["max_lon"]) / 2
        self.altitude_m = altitude_m
        
        # 90-degree Field of View assumption: footprint width = 2 * altitude
        self.footprint_size_m = 2 * altitude_m
        # Approx 111,320 meters per degree of latitude
        self.footprint_deg = self.footprint_size_m / 111320.0

    def update_position(self):
        """Simulates autonomous drone patrol drift within campus geofence."""
        step = 0.00008  # ~9 meters per step
        self.lat += random.uniform(-step, step)
        self.lon += random.uniform(-step, step)
        
        self.lat = max(CAMPUS_BOUNDARY["min_lat"], min(self.lat, CAMPUS_BOUNDARY["max_lat"]))
        self.lon = max(CAMPUS_BOUNDARY["min_lon"], min(self.lon, CAMPUS_BOUNDARY["max_lon"]))
        return self.lat, self.lon


def pixel_to_gps(px_x, px_y, width, height, drone_lat, drone_lon, footprint_deg):
    """Maps nadir camera pixel (x, y) to estimated real-world GPS coordinates."""
    norm_x = px_x / width
    norm_y = px_y / height
    
    frame_min_lat = drone_lat - (footprint_deg / 2)
    frame_max_lat = drone_lat + (footprint_deg / 2)
    frame_min_lon = drone_lon - (footprint_deg / 2)
    frame_max_lon = drone_lon + (footprint_deg / 2)
    
    target_lon = frame_min_lon + (norm_x * (frame_max_lon - frame_min_lon))
    target_lat = frame_max_lat - (norm_y * (frame_max_lat - frame_min_lat))
    return round(target_lat, 6), round(target_lon, 6)


# ==============================================================================
# 2. GEOFENCE EVALUATION ENGINE
# ==============================================================================
class GeofenceEngine:
    def __init__(self, zones_data):
        self.active_zones = []
        self.load_zones(zones_data)

    def load_zones(self, zones_data):
        self.active_zones = []
        for zone in zones_data:
            self.active_zones.append({
                "id": zone["zone_id"],
                "name": zone["zone_name"],
                "type": zone["zone_type"],
                "severity": zone["severity"],
                "restricted_classes": zone["restricted_classes"],
                "polygon": Polygon(zone["polygon"])
            })

    def evaluate(self, class_name, target_lat, target_lon):
        """Evaluates whether detected coordinates violate an active zone rule."""
        target_point = Point(target_lat, target_lon)
        for zone in self.active_zones:
            if class_name in zone["restricted_classes"]:
                if zone["polygon"].contains(target_point):
                    event_type = "ROOFTOP_TRESPASS" if zone["type"] == "ROOFTOP" else "ZONE_BREACH"
                    return True, event_type, zone["name"], zone["severity"]
        return False, None, None, None


# ==============================================================================
# 3. WEBSOCKET DISPATCH HANDLER
# ==============================================================================
class AlertDispatcher:
    def __init__(self, url):
        self.url = url
        self.ws = None
        self.connect()

    def connect(self):
        try:
            self.ws = websocket.create_connection(self.url, timeout=2)
            print(f"[NETWORK] WebSocket connected to backend: {self.url}")
        except Exception as e:
            self.ws = None
            print(f"[WARNING] Backend unreachable ({e}). Operating in standalone mode.")

    def send(self, payload):
        if self.ws is None:
            self.connect()
            
        if self.ws and self.ws.connected:
            try:
                self.ws.send(json.dumps(payload))
                print(f"[ALERT DISPATCHED] Type: {payload['event_type']} | Class: {payload['details']['hazard_class']}")
            except Exception as e:
                print(f"[NETWORK ERROR] Dispatch failed: {e}")
                self.ws = None
        else:
            print(f"[OFFLINE LOG] Alert generated: {payload['event_type']}")


# ==============================================================================
# 4. MAIN INFERENCE & DISPATCH LOOP
# ==============================================================================
def main():
    print("[INFO] Initializing Cortex Edge Node...")
    drone = SimulatedDrone(altitude_m=30.0)
    geofence = GeofenceEngine(DEFAULT_ZONES)
    dispatcher = AlertDispatcher(BACKEND_WS_URL)

    try:
        model = YOLO(MODEL_PATH)
        print(f"[INFO] Successfully loaded model: {MODEL_PATH}")
    except Exception as e:
        print(f"[ERROR] Failed to load {MODEL_PATH}. Defaulting to yolov8n.pt: {e}")
        model = YOLO("yolov8n.pt")

    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, INPUT_WIDTH)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, INPUT_HEIGHT)

    last_alert_timestamps = {}

    print("[SYSTEM READY] Cortex aerial surveillance operational. Press 'q' to terminate.")

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        current_time = time.time()
        drone_lat, drone_lon = drone.update_position()

        # Run YOLO inference
        results = model.predict(source=frame, imgsz=INPUT_WIDTH, conf=0.45, verbose=False)
        annotated_frame = results[0].plot()

        boxes = results[0].boxes
        if len(boxes) > 0:
            for box in boxes:
                cls_id = int(box.cls[0].item())
                class_name = model.names[cls_id].lower()
                conf = float(box.conf[0].item())

                # Bounding box bottom-center: contact point with ground/roof
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                contact_px_x = (x1 + x2) / 2.0
                contact_px_y = y2

                target_lat, target_lon = pixel_to_gps(
                    contact_px_x, contact_px_y,
                    INPUT_WIDTH, INPUT_HEIGHT,
                    drone_lat, drone_lon,
                    drone.footprint_deg
                )

                # Check security policies
                is_alert = False
                event_type = "GENERAL_HAZARD"
                severity = "MEDIUM"
                zone_tag = "Open_Campus_Area"

                if class_name in CRITICAL_HAZARDS:
                    is_alert = True
                    severity = "CRITICAL"
                    zone_tag = "N/A (Universal Threat)"
                    if class_name in ["fire", "smoke"]:
                        event_type = "FIRE_SMOKE_HAZARD"
                    elif class_name == "crash":
                        event_type = "VEHICLE_COLLISION"
                    elif class_name == "lying_person":
                        event_type = "MEDICAL_EMERGENCY"
                else:
                    breach, b_event, b_zone, b_sev = geofence.evaluate(class_name, target_lat, target_lon)
                    if breach:
                        is_alert = True
                        event_type = b_event
                        severity = b_sev
                        zone_tag = b_zone

                # Throttle repeated alerts per event type
                if is_alert:
                    cooldown_key = f"{event_type}_{zone_tag}"
                    last_time = last_alert_timestamps.get(cooldown_key, 0)
                    
                    if (current_time - last_time) > ALERT_COOLDOWN_SEC:
                        last_alert_timestamps[cooldown_key] = current_time

                        # Encode annotated snapshot to Base64
                        _, buffer = cv2.imencode(".jpg", annotated_frame, [cv2.IMWRITE_JPEG_QUALITY, 60])
                        b64_img = base64.b64encode(buffer).decode("utf-8")

                        payload = {
                            "event_id": f"evt_{uuid.uuid4().hex[:12]}",
                            "timestamp": datetime.now(timezone.utc).isoformat(),
                            "event_type": event_type,
                            "severity": severity,
                            "details": {
                                "hazard_class": class_name,
                                "confidence": round(conf, 3),
                                "target_coordinates": [target_lat, target_lon],
                                "geofence_tag": zone_tag,
                                "drone_telemetry": {
                                    "latitude": round(drone_lat, 6),
                                    "longitude": round(drone_lon, 6),
                                    "altitude_m": drone.altitude_m
                                }
                            },
                            "snapshot_base64": b64_img
                        }

                        dispatcher.send(payload)

        # On-screen visual HUD for testing display
        cv2.putText(annotated_frame, f"DRONE GPS: {drone_lat:.5f}, {drone_lon:.5f}", (15, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
        cv2.imshow("Cortex Edge Patrol", annotated_frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()