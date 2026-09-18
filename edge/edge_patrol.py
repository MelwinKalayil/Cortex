import time
import json
import cv2
import numpy as np
from shapely.geometry import Point, Polygon
from ultralytics import YOLO

# ==========================================
# 1. CONFIGURATION & GEOFENCE RULES
# ==========================================
# Paths updated to match your VS Code folder structure
VISDRONE_MODEL_PATH = "VisDroneDetection/best.onnx"
FIRE_MODEL_PATH = "fire_smoke/best.onnx"

# Define a simulated restricted campus zone for a standard 640x480 laptop webcam
RESTRICTED_ZONE = Polygon([(100, 100), (540, 100), (540, 400), (100, 400)])

CURFEW_START_HOUR = 0   # 12:00 AM
CURFEW_END_HOUR = 5     # 5:00 AM

# ==========================================
# 2. INITIALIZE MODELS
# ==========================================
print("[INFO] Loading ONNX models on laptop CPU...")
patrol_model = YOLO(VISDRONE_MODEL_PATH, task="detect")
fire_model = YOLO(FIRE_MODEL_PATH, task="detect")
print("[INFO] Models loaded successfully.")

def send_alert(event_type, severity, details, frame):
    payload = {
        "event_id": f"evt_{int(time.time()*1000)}",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "event_type": event_type,
        "severity": severity,
        "details": details,
    }
    print(f"\n[DISPATCH ALERT] {severity} - {event_type}")
    print(json.dumps(payload, indent=2))

# ==========================================
# 3. VIDEO INGESTION LOOP
# ==========================================
# 0 opens the default laptop webcam
cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

frame_idx = 0
last_alert_time = 0

try:
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame_idx += 1
        t_start = time.time()
        
        # Draw the orange geofence for visual testing
        pts = np.array(RESTRICTED_ZONE.exterior.coords, np.int32).reshape((-1, 1, 2))
        cv2.polylines(frame, [pts], isClosed=True, color=(0, 165, 255), thickness=2)

        # ----------------------------------------------------
        # PIPELINE A: Primary Patrol (VisDrone) - Every Frame
        # ----------------------------------------------------
        patrol_results = patrol_model.predict(source=frame, imgsz=640, conf=0.25, verbose=False)
        detected_people_count = 0

        for box in patrol_results[0].boxes:
            cls_id = int(box.cls[0])
            cls_name = patrol_model.names[cls_id]
            xyxy = box.xyxy[0].cpu().numpy().astype(int)

            center_x = (xyxy[0] + xyxy[2]) // 2
            center_y = (xyxy[1] + xyxy[3]) // 2
            detection_point = Point(center_x, center_y)

            if cls_name in ["pedestrian", "people"]:
                detected_people_count += 1
                if RESTRICTED_ZONE.contains(detection_point):
                    cv2.rectangle(frame, (xyxy[0], xyxy[1]), (xyxy[2], xyxy[3]), (0, 0, 255), 2)
                    cv2.putText(frame, f"BREACH: {cls_name}", (xyxy[0], xyxy[1] - 8),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
                    
                    if time.time() - last_alert_time > 3:
                        send_alert("CURFEW_ZONE_BREACH", "HIGH", {"class": cls_name, "pos": [center_x, center_y]}, frame)
                        last_alert_time = time.time()

        # ----------------------------------------------------
        # PIPELINE B: Fire & Smoke - Interleaved (Every 10 Frames)
        # ----------------------------------------------------
        if frame_idx % 10 == 0:
            fire_results = fire_model.predict(source=frame, imgsz=640, conf=0.40, verbose=False)
            for box in fire_results[0].boxes:
                cls_id = int(box.cls[0])
                cls_name = fire_model.names[cls_id]
                xyxy = box.xyxy[0].cpu().numpy().astype(int)

                cv2.rectangle(frame, (xyxy[0], xyxy[1]), (xyxy[2], xyxy[3]), (0, 0, 255), 3)
                cv2.putText(frame, f"CRITICAL: {cls_name.upper()}", (xyxy[0], xyxy[1] - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)

                if time.time() - last_alert_time > 3:
                    send_alert("FIRE_SMOKE_HAZARD", "CRITICAL", {"hazard_type": cls_name}, frame)
                    last_alert_time = time.time()

        # ----------------------------------------------------
        # FPS & TELEMETRY
        # ----------------------------------------------------
        fps = 1.0 / (time.time() - t_start)
        cv2.putText(frame, f"FPS: {fps:.1f}", (15, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

        cv2.imshow("Laptop Local Test", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

finally:
    cap.release()
    cv2.destroyAllWindows()