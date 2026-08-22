# 🚀 Deployment Guide: GitHub + Render

This guide provides step-by-step instructions for deploying the **Fashion Clothing Classification** application (Flask Backend + React Vite Frontend) to **Render** via **GitHub**.

---

## 🛠️ Step 1: Push Changes to GitHub

Ensure all deployment configurations are committed and pushed to your GitHub repository:

```bash
git add .
git commit -m "Configure project for Render deployment"
git push origin main
```

---

## ⚡ Step 2: Deploy on Render (Recommended: Blueprint)

Render's Blueprint feature reads the included `render.yaml` file to automatically deploy both the Flask backend and React frontend with a single click.

1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** in the top right corner and select **Blueprint**.
3. Connect your GitHub account and select your repository (`fashion-clothing-classification`).
4. Give your Blueprint instance a name (e.g., `fashion-classifier`).
5. Render will automatically detect the configuration in `render.yaml`:
   - **Backend**: Python Web Service (`cd backend && gunicorn app:app`)
   - **Frontend**: Static Site (`cd frontend && npm install && npm run build`)
6. Click **Apply**.
7. Wait for both services to build and deploy!

---

## 🔧 Step 3: Manual Deployment (Alternative Method)

If you prefer to configure services manually on Render instead of using Blueprints:

### A. Deploy the Backend (Flask API)
1. In Render Dashboard, click **New +** -> **Web Service**.
2. Select your GitHub repository.
3. Configure the following settings:
   - **Name**: `fashion-classifier-backend`
   - **Environment**: `Python 3`
   - **Region**: Choose the closest location
   - **Branch**: `main`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && gunicorn --bind 0.0.0.0:$PORT --workers 1 --timeout 120 app:app`
   - **Plan**: `Free`
4. Click **Create Web Service**.
5. Once deployed, **copy your backend URL** (e.g., `https://fashion-classifier-backend.onrender.com`).

### B. Deploy the Frontend (React / Vite)
1. In Render Dashboard, click **New +** -> **Static Site**.
2. Select your GitHub repository.
3. Configure the following settings:
   - **Name**: `fashion-classifier-frontend`
   - **Branch**: `main`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
4. Scroll down to **Environment Variables** and add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://fashion-classifier-backend.onrender.com` *(Replace with your actual backend URL from Step A)*
5. Scroll down to **Redirects / Rewrites** and add:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite`
6. Click **Create Static Site**.

---

## 📌 Important Notes for Render Free Tier

1. **Cold Starts**: Render free backend services spin down after 15 minutes of inactivity. When a request comes after sleeping, it takes around 30–50 seconds to start up.
2. **CORS & Environment Variables**: If you update the backend URL later, ensure `VITE_API_URL` in the frontend static site settings matches your deployed backend URL.
