import os
import torch
import timm
import torch.nn as nn

class DeepFakeModel:
    def __init__(self, model_path=None, device=None):
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        self.model_path = model_path or os.environ.get("DEEPSHIELD_MODEL_PATH", "model/deepfake_model.pth")
        self._load_model()

    def _build_arch(self):
        backbone = timm.create_model("efficientnet_b0", pretrained=False, num_classes=0, global_pool="avg")
        head = nn.Sequential(
            nn.Linear(backbone.num_features, 256),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(256, 1),
            nn.Sigmoid()
        )
        model = nn.Sequential(backbone, head)
        return model

    def _load_model(self):
        try:
            self.net = self._build_arch()
            if os.path.exists(self.model_path):
                state = torch.load(self.model_path, map_location="cpu")
                # if full state_dict saved as dict, use it
                if isinstance(state, dict):
                    # some checkpoints wrap inside 'state_dict' or 'model_state_dict'
                    if "state_dict" in state:
                        state = state["state_dict"]
                    if "model_state_dict" in state:
                        state = state["model_state_dict"]
                self.net.load_state_dict(state, strict=False)
                self.net.to(self.device)
                self.net.eval()
                print("[INFO] Loaded model checkpoint.")
            else:
                print("[WARN] Model file not found — using MOCK MODE.")
                self.net = None
        except Exception as e:
            print("[ERROR] Failed to load checkpoint:", e)
            self.net = None

    def predict_tensor(self, tensor):
        # tensor: torch (1,3,H,W)
        if self.net is None:
            # mock behaviour
            import random
            return random.random() * 0.7  # yields non-extreme values
        with torch.no_grad():
            t = tensor.to(self.device).float()
            out = self.net(t)
            # out shape: (1,1)
            val = out.detach().cpu().numpy().item()
            return float(val)

    def predict(self, img_tensor):
        return self.predict_tensor(img_tensor)
