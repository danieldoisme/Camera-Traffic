import cv2
import numpy as np
from ultralytics import YOLO
from ultralytics.utils.plotting import Annotator, colors
import requests
import time
from flask import Flask, Response

# Khởi tạo Flask app
app = Flask(__name__)

# Cấu hình mô hình YOLO và camera
model = YOLO(r"E:\Năm 4 kì 2\CDHTTT\Dashboard\train\saban.pt")
model.to("cpu")  # Thay "cuda" nếu mày muốn dùng GPU
source = 0  # Camera mặc định
videocapture = cv2.VideoCapture(source)

names = model.model.names
vehicle_counts = {name: 0 for name in names.values()}
last_sent_time = 0
send_interval = 5
line_thickness = 1

def generate_frames():
    """Tạo luồng video từ camera và xử lý bằng YOLO"""
    while videocapture.isOpened():
        success, frame = videocapture.read()
        if not success:
            break

        # Xử lý frame với YOLO
        results = model.track(frame, persist=True)
        vehicle_counts = {name: 0 for name in names.values()}

        if results[0].boxes.id is not None:
            boxes = results[0].boxes.xyxy.cpu()
            clss = results[0].boxes.cls.cpu().tolist()
            annotator = Annotator(frame, line_width=line_thickness, example=str(names))

            for cls in clss:
                class_name = names[cls]
                if class_name in vehicle_counts:
                    vehicle_counts[class_name] += 1

            for box, cls in zip(boxes, clss):
                annotator.box_label(box, str(names[cls]), color=colors(cls, True))

        # Hiển thị số lượng phương tiện lên frame
        y_offset = 50
        font_scale = 1
        thickness = 2
        for label, count in vehicle_counts.items():
            text = f"{label}: {count}"
            text_size, _ = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, font_scale, thickness)
            text_w, text_h = text_size
            cv2.rectangle(frame, (5, y_offset - text_h - 10), (5 + text_w, y_offset), (0, 0, 0), -1)
            cv2.putText(frame, text, (10, y_offset - 5), cv2.FONT_HERSHEY_SIMPLEX, font_scale, (0, 255, 0), thickness)
            y_offset += text_h + 10

        # Gửi dữ liệu lên server Node.js
        current_time = time.time()
        global last_sent_time
        if current_time - last_sent_time >= send_interval:
            data = {
                'motobike': vehicle_counts.get('xe may', 0),
                'car': vehicle_counts.get('oto', 0),
                'bus': vehicle_counts.get('xe bus', 0),
                'truck': vehicle_counts.get('xe tai', 0)
            }
            try:
                response = requests.post('http://localhost:3000/vehicles', json=data)
                print("Dữ liệu đã gửi:", response.json())
            except requests.exceptions.RequestException as e:
                print("Lỗi khi gửi dữ liệu:", e)
            last_sent_time = current_time

        # Chuyển frame thành JPEG để stream
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    """Endpoint để stream video"""
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

def run():
    """Chạy Flask server"""
    if not videocapture.isOpened():
        print(f"Could not open camera {source}")
        return
    app.run(host='0.0.0.0', port=5000, threaded=True)

if __name__ == "__main__":
    run()