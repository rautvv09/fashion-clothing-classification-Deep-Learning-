# Fashion Clothing Classification (Deep Learning)

An end-to-end AI application for classifying fashion apparel into 10 categories using a Convolutional Neural Network (CNN) trained on the Fashion-MNIST dataset. Built with Flask, TensorFlow/Keras, and React (Vite).

## 🚀 Features

- **Real-Time Classification**: Upload any apparel image to get instant AI predictions.
- **Probability Analytics**: Visual breakdown of top predicted categories.
- **Modern UI**: Dark/Light mode, micro-animations, responsive layout.
- **Render Ready**: Includes automatic deployment configurations (`render.yaml`, `Procfile`).

---

## 🛠️ Local Development

### 1. Backend Setup (Flask)
```bash
cd backend
python -m venv venv
venv\Scripts\activate   # On Windows
# source venv/bin/activate # On Mac/Linux
pip install -r requirements.txt
python app.py
```
Backend runs at `http://localhost:5000`.

### 2. Frontend Setup (React / Vite)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

---

## ☁️ Deployment (GitHub + Render)

Refer to the complete deployment walkthrough in [DEPLOYMENT.md](./DEPLOYMENT.md).

Quick Deploy via Render Blueprint:
1. Push code to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com/) -> **New +** -> **Blueprint**.
3. Select this repository. Render automatically builds and deploys both backend and frontend!
