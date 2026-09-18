import cv2
import time
from ultralytics import YOLO

# Model paths relative to your 'edge' directory
VISDRONE_MODEL_PATH = "VisDroneDetection/best.onnx"
FIRE_MODEL_PATH = "fire_smoke/best.onnx"

print("[INFO] Loading ONNX models...")
patrol_model = YOLO(VISDRONE_MODEL_PATH, task="detect")
fire_model = YOLO(FIRE_MODEL_PATH, task="detect")

# Connect to external camera (Index 1 or 2 for external, 0 for built-in)
CAMERA_INDEX = 2
cap = cv2.VideoCapture(CAMERA_INDEX, cv2.CAP_DSHOW)

if not cap.isOpened():
    print(f"[WARNING] External camera {CAMERA_INDEX} not found. Falling back to default (0)...")
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

frame_idx = 0

print("[INFO] Starting raw detection feed. Press 'q' to stop.")

try:
    cached_fire_results = None
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame_idx += 1
        t_start = time.time()

       # 1. Run primary model on every frame
        patrol_results = patrol_model.predict(source=frame, imgsz=640, conf=0.25, verbose=False)
        annotated_frame = patrol_results[0].plot()

        # 2. Run Fire & Smoke model only every 10 frames to save CPU
        if frame_idx % 10 == 0:
            cached_fire_results = fire_model.predict(source=frame, imgsz=640, conf=0.40, verbose=False)
            
        # 3. Draw the cached fire boxes on EVERY frame so it never flickers
        if cached_fire_results is not None and len(cached_fire_results[0].boxes) > 0:
            annotated_frame = cached_fire_results[0].plot(img=annotated_frame)

        # 3. FPS Display
        fps = 1.0 / (time.time() - t_start)
        cv2.putText(annotated_frame, f"FPS: {fps:.1f}", (15, 25),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

        cv2.imshow("Raw Detections Test", annotated_frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

finally:
    cap.release()
    cv2.destroyAllWindows()