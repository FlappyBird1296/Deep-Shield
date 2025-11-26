from facenet_pytorch import MTCNN
from PIL import Image
import numpy as np

class FaceDetector:
    def __init__(self, device="cpu"):
        self.mtcnn = MTCNN(keep_all=True, device=device)

    def detect_faces_pil(self, pil_img):
        # returns list of boxes (x1,y1,x2,y2)
        boxes, _ = self.mtcnn.detect(pil_img)
        if boxes is None:
            return []
        boxes = boxes.astype(int).tolist()
        return boxes
