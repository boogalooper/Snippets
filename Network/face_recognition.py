import subprocess
import sys
import socket
import json

API_HOST = "127.0.0.1"
API_PORT_SEND = 6321
API_PORT_LISTEN = 6320


def check_module(module_name):
    try:
        __import__(module_name)
    except ImportError:
        print(f"Module {module_name} not found. Installing...")
        return install_module(module_name)
    else:
        print(f"Module {module_name} alredy installed")
        return True


def install_module(module_name):
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", module_name])
        print(f"Module {module_name} succesfully installed!")
        return True
    except subprocess.CalledProcessError:
        return False


check_module("opencv-python")
import cv2


def detect_faces_count(image_gray):
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )
    faces = face_cascade.detectMultiScale(image_gray, scaleFactor=1.2, minNeighbors=7)
    return len(faces)


def rotate_image(image, angle):
    if angle == 0:
        return image
    elif angle == 90:
        return cv2.rotate(image, cv2.ROTATE_90_CLOCKWISE)
    elif angle == 180:
        return cv2.rotate(image, cv2.ROTATE_180)
    elif angle == 270:
        return cv2.rotate(image, cv2.ROTATE_90_COUNTERCLOCKWISE)


def find_correct_orientation_angle(image_path):
    image = cv2.imread(image_path)
    angles = [0, 90, 180, 270]
    best_angle = 0
    max_faces = -1

    for angle in angles:
        rotated = rotate_image(image, angle)
        gray = cv2.cvtColor(rotated, cv2.COLOR_BGR2GRAY)
        count = detect_faces_count(gray)
        print(f"faces at {angle} degrees: {count}")
        if count > max_faces:
            max_faces = count
            best_angle = angle

    return best_angle


def send_data_to_jsx(message):
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.connect((API_HOST, API_PORT_SEND))
            s.sendall(json.dumps(message).encode("utf-8"))
    except Exception as e:
        print(f"Error sending answer: {e}")


def start_local_server():
    srv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    srv.bind((API_HOST, API_PORT_LISTEN))
    srv.listen(1)

    print("Server running")

    while True:
        client_socket, client_address = srv.accept()
        print(f"Connection established with {client_address}")
        try:
            message = client_socket.recv(1024)
            if message:
                message = json.loads(message.decode("utf-8").rstrip("\n"))
                print(f"Recieved message: {message}")
                if message["type"] == "payload":
                    data = message["message"]
                    print(f"Processing payload {data}")
                    result = find_correct_orientation_angle(data)
                    print(f"Rotate {result}")
                    send_data_to_jsx({"type": "answer", "message": result})
                elif message["type"] == "handshake":
                    send_data_to_jsx({"type": "answer", "message": "success"})
        except Exception as e:
            print(f"Error: {e}")
            send_data_to_jsx({"type": "answer", "message": None})
            sys.exit()
        finally:
            client_socket.close()


start_local_server()
