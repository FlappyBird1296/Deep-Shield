## 🚀 DeepShield – AI-Powered Deepfake Detection System

DeepShield is an advanced AI-driven deepfake detection system capable of analyzing images and videos to identify manipulated media using EfficientNet-based models.
Designed with a FastAPI backend, Vite–React frontend, and real-time inference support, DeepShield is built for production-level deployment.

## 🎯 Key Features

🧠 AI-based Deepfake Classification using EfficientNet-B0

🧠 If Pretrained model not available operates on a Mock model

🎥 Real-time video & image detection

⚡ FastAPI backend with optimized inference pipeline

🌐 Modern React + Vite UI (dark mode enabled)

📤 Drag & drop media upload

📊 Confidence score + prediction explanation

🧩 Modular codebase (backend, frontend, model separated)

☁️ Deployable on Render, Railway, Netlify, Vercel

## 🧠 Tech Stack

# Frontend

    React (Vite)
    Tailwind / CSS

# Backend

    FastAPI
    Uvicorn
    EfficientNet-B0 (or any compatible deepfake model)
    Python 

# AI / ML

    PyTorch
    OpenCV
    NumPy

## 🏗️ System Architecture

    User
    ↓
    Frontend (React + Vite)
    ↓
    Backend API (FastAPI)
    ↓
    ML Model (EfficientNet / Deepfake Classifier)
    ↓
    Response (Prediction + Confidence)

## 🚀 Live Demo

📹 Demo Video: https://youtu.be/lmdzpW9X7ec?si=DECQqqZE9jzgxhgQ

## ⚙️ Installation & Setup

# 1️⃣ Clone the repository

git clone https://github.com/FlappyBird1296/DeepShield.git
cd DeepShield

# 🖥️ Backend Setup

cd backend
pip install -r requirements.txt
uvicorn main:app --reload

Your API now runs at:
👉 http://localhost:8000

# 🌐 Frontend Setup
cd frontend
npm install
npm run dev

Your UI runs at:
👉 http://localhost:5173

## 🤝 Contributing

Pull requests and feature suggestions are welcome!

## 👨‍💻 Author

Manoranjan Gope 
CSE (AI/ML) - First Year