import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision.transforms as T
import numpy as np
import pywt
import cv2
from PIL import Image
from io import BytesIO


# Arsitektur CNN
class LightCrackCNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Sequential(nn.Conv2d(4, 16, 3, padding=1), nn.BatchNorm2d(16), nn.ReLU())
        self.conv2 = nn.Sequential(nn.Conv2d(16, 32, 3, padding=1), nn.BatchNorm2d(32), nn.ReLU(), nn.MaxPool2d(2))
        self.conv3 = nn.Sequential(nn.Conv2d(32, 64, 3, padding=1), nn.BatchNorm2d(64), nn.ReLU(), nn.MaxPool2d(2))
        self.gap   = nn.AdaptiveAvgPool2d(1)
        self.fc    = nn.Linear(64, 2)

    def forward(self, x):
        x = self.conv1(x)
        x = self.conv2(x)
        x = self.conv3(x)
        x = self.gap(x)
        x = x.flatten(1)
        return self.fc(x)


#  Load model
DEVICE = torch.device('cpu')

model = LightCrackCNN().to(DEVICE)
model.load_state_dict(torch.load('best_model.pth', map_location=DEVICE))
model.eval()


# Preprocessing + DWT
transform = T.Compose([T.Grayscale(), T.Resize((128, 128)), T.ToTensor()])

def apply_dwt(tensor_img):
    img = tensor_img.squeeze(0).numpy()
    LL1, (LH1, HL1, HH1) = pywt.dwt2(img, 'haar')
    LL2, (LH2, HL2, HH2) = pywt.dwt2(LL1, 'haar')
    subbands = np.stack([LL2, LH2, HL2, HH2], axis=0)
    for i in range(4):
        mn, mx = subbands[i].min(), subbands[i].max()
        subbands[i] = (subbands[i] - mn) / (mx - mn + 1e-8)
    return torch.tensor(subbands, dtype=torch.float32)


# Grad-CAM
def get_gradcam(tensor_4ch):
    features, grads = [], []
    h1 = model.conv3.register_forward_hook(lambda m, i, o: features.append(o))
    h2 = model.conv3.register_full_backward_hook(lambda m, i, o: grads.append(o[0]))

    inp    = tensor_4ch.unsqueeze(0).to(DEVICE)
    output = model(inp)
    model.zero_grad()
    output[0, output.argmax(1)].backward()

    weights  = grads[0].mean(dim=[2, 3], keepdim=True)
    gradcam  = F.relu((weights * features[0]).sum(dim=1).squeeze())
    gradcam  = (gradcam / (gradcam.max() + 1e-8)).detach().cpu().numpy()

    h1.remove(); h2.remove()
    return cv2.resize(gradcam, (128, 128))


# Fungsi utama inference
def predict(image_bytes: bytes) -> dict:
    img      = Image.open(BytesIO(image_bytes)).convert('RGB')
    tensor   = transform(img)
    wavelet  = apply_dwt(tensor)
    
    with torch.no_grad():
        output = model(wavelet.unsqueeze(0).to(DEVICE))
    
    probs     = F.softmax(output, dim=1)[0]
    label     = 'Positive' if probs.argmax().item() == 1 else 'Negative'
    confidence = probs.max().item()

    # Grad-CAM
    gradcam       = get_gradcam(wavelet)
    heatmap       = cv2.applyColorMap((gradcam * 255).astype(np.uint8), cv2.COLORMAP_JET)
    img_resized   = np.array(img.resize((128, 128)))
    overlay       = cv2.addWeighted(img_resized, 0.5, heatmap, 0.5, 0)
    _, buf         = cv2.imencode('.jpg', overlay)

    return {
        'label':      label,
        'confidence': round(confidence * 100, 2),
        'gradcam':    buf.tobytes()
    }