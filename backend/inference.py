import io
import base64
import time
from PIL import Image
import cv2
import numpy as np
from utils.face_detector import FaceDetector
from model import DeepFakeModel
import torch
import json

detector = FaceDetector()
model = DeepFakeModel()


# ---------------------------
# Utility Converters
# ---------------------------
def pil_to_tensor(img: Image.Image):
    img = img.convert("RGB").resize((224,224))
    arr = np.asarray(img).astype(np.float32)/255.0
    mean = np.array([0.485,0.456,0.406])
    std = np.array([0.229,0.224,0.225])
    arr = (arr - mean) / std
    arr = np.transpose(arr, (2,0,1))
    return torch.tensor(arr).unsqueeze(0)


def encode_image_to_datauri(img_bgr):
    _, buf = cv2.imencode(".jpg", img_bgr)
    b64 = base64.b64encode(buf).decode("utf-8")
    return f"data:image/jpeg;base64,{b64}"


# ---------------------------
# Media quality metric (sharpness)
# ---------------------------
def calc_sharpness(img_rgb):
    gray = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2GRAY)
    score = cv2.Laplacian(gray, cv2.CV_64F).var()
    score = max(0, min(score / 100.0, 1))  # normalize 0–1
    return round(score * 100, 2)  # convert to percentage


# ===========================
# IMAGE ANALYSIS
# ===========================
def analyze_image_bytes(data: bytes):
    start = time.time()
    img = Image.open(io.BytesIO(data)).convert("RGB")
    rgb_np = np.array(img)
    
    boxes = detector.detect_faces_pil(img)
    if not boxes:
        return {"success": False, "error": "No face detected", "result": None}

    x1, y1, x2, y2 = boxes[0]
    face = img.crop((x1, y1, x2, y2))
    face_np = np.array(face)

    tensor = pil_to_tensor(face)
    prob_fake = float(model.predict_tensor(tensor))  # 0..1

    final_score = round((1 - prob_fake) * 100, 2)
    label = "REAL" if final_score > 50 else "DEEPFAKE LIKELY"

    example_frame = encode_image_to_datauri(cv2.cvtColor(face_np, cv2.COLOR_RGB2BGR))

    # Stats
    real_conf = round(final_score, 2)
    fake_conf = round(prob_fake * 100, 2)
    stability = 100  # single frame
    quality = calc_sharpness(rgb_np)
    time_taken = round(time.time() - start, 3)

    result = {
        "final_score": final_score,
        "prob_fake": prob_fake,
        "label": label,
        "frame_count": 1,
        "example_frame": example_frame,
        "real_confidence": real_conf,
        "fake_confidence": fake_conf,
        "stability_score": stability,
        "media_quality_score": quality,
        "inference_time_sec": time_taken,
        "explanation": [
            f"Model confidence for REAL: {real_conf}%",
            f"Single frame analysis",
            f"Media quality score: {quality}/100"
        ]
    }

    return {"success": True, "result": result}


# ===========================
# VIDEO FRAME EXTRACTOR
# ===========================
def extract_frames_from_video(path, max_frames=8):
    cap = cv2.VideoCapture(path)
    frames = []
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if total == 0:
        cap.release()
        return []
    indices = np.linspace(0, total-1, min(max_frames, total)).astype(int)

    for i in indices:
        cap.set(cv2.CAP_PROP_POS_FRAMES, int(i))
        ret, frame = cap.read()
        if not ret:
            continue
        frames.append(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

    cap.release()
    return frames


# ===========================
# VIDEO ANALYSIS
# ===========================
def analyze_video_file(path: str):
    start = time.time()
    frames = extract_frames_from_video(path, max_frames=8)

    if not frames:
        return {"success": False, "error": "No frames extracted"}

    probs = []
    example = None
    faces_detected = 0
    frames_skipped = 0
    quality_scores = []

    for f in frames:
        pil_img = Image.fromarray(f)
        boxes = detector.detect_faces_pil(pil_img)

        if not boxes:
            frames_skipped += 1
            continue

        faces_detected += 1
        x1, y1, x2, y2 = boxes[0]
        face = pil_img.crop((x1, y1, x2, y2))
        face_np = np.array(face)

        if example is None:
            example = face_np[:, :, ::-1].copy()

        tensor = pil_to_tensor(face)
        prob_fake = float(model.predict_tensor(tensor))
        probs.append(prob_fake)

        # Quality metrics
        quality_scores.append(calc_sharpness(f))

    if not probs:
        return {"success": False, "error": "No faces detected in sampled frames"}

    avg_prob = float(np.mean(probs))
    std_dev = float(np.std(probs))
    confidence_delta = round((max(probs) - min(probs)) * 100, 2)

    final_score = round((1 - avg_prob) * 100, 2)
    stability = round((1 - std_dev) * 100, 2)
    quality = round(np.mean(quality_scores), 2) if quality_scores else 0

    highest_idx = int(np.argmax(probs))

    label = "REAL" if final_score > 50 else "DEEPFAKE LIKELY"
    example_frame = encode_image_to_datauri(example) if example is not None else None

    time_taken = round(time.time() - start, 3)

    raw = {
        "success": True,
        "result": {
            "final_score": float(final_score),
            "prob_fake": float(avg_prob),
            "frame_probs": [float(p) for p in probs],
            "std_dev": std_dev,
            "stability_score": stability,
            "highest_risk_frame": highest_idx,
            "confidence_delta": confidence_delta,
            "media_quality_score": quality,
            "frames_analyzed": len(frames),
            "faces_detected": faces_detected,
            "frames_skipped": frames_skipped,
            "inference_time_sec": time_taken,
            "label": label,
            "frame_count": int(len(probs)),
            "example_frame": example_frame if example_frame else "",
            "explanation": [
                f"Averaged over {len(probs)} detected frames",
                f"Std deviation: {round(std_dev,3)}",
                f"Media quality score: {quality}/100",
                f"Stability score: {stability}/100"
            ]
        }
    }

    return json.loads(json.dumps(raw, default=str))
