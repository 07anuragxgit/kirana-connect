# KiranaConnect 🚀 (Production V2)

An end-to-end, fully dynamic hyperlocal Kirana store platform. Completely devoid of mock data, this version features complete authentication, vendor inventory management, and buttery-smooth Framer Motion UI animations.

## Tech Stack
- **Frontend:** React + Vite, Tailwind CSS, **Framer Motion** (for liquid UI).
- **Backend:** Node.js, Express, SQLite, JWT & Bcrypt (Auth).
- **AI Integration:** Google Gemini 1.5 Flash (via securely proxied backend fetch).

## V2 End-to-End Flow
1. **Auth:** Users choose to register as a `Customer` or a `Vendor`.
2. **Vendor Setup:** If you are a Vendor, you create your Digital Store profile and start adding products to your inventory via the Dashboard.
3. **Customer Discovery:** Customers see authentic Kirana stores nearby in real-time. They can add items to their cart and checkout securely.
4. **Live Vendor Analytics:** The Vendor Dashboard instantly receives the order. The Gemini AI widget parses *actual* orders and delivers predictive business logic.

## 🛠️ Running Locally

Follow these steps to get the full-stack KiranaConnect application running on your machine:

### 1. Database & Backend Setup
Open a new terminal and navigate to the backend directory:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
# backend/.env
GEMINI_API_KEY=your_google_gemini_api_key
JWT_SECRET=super_secret_jwt_string_here
PORT=3001
```

Start the backend server (runs on `http://localhost:3001` with `nodemon`):
```bash
npm run dev
```

### 2. Frontend Setup
Open a second terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
```

Start the Vite development server (usually runs on `http://localhost:5173`):
```bash
npm run dev
```
*(Note: The frontend automatically proxies `/api` requests to `localhost:3001` in dev mode via `vite.config.js`)*

---

## 🚀 Deployment Guide

### Phase 1: Deploying Backend to Render.com

Render is an excellent platform for hosting Node.js + SQLite applications.

1. **Commit your code to GitHub**, ensuring `backend/data_v2.sqlite` (if you want fresh data) and `backend/.env` are in your `.gitignore`.
2. Log into **[Render.com](https://render.com/)** and click **New + -> Web Service**.
3. Connect your GitHub repository containing this project.
4. **Configuration Settings:**
   - **Name:** `kiranaconnect-api`
   - **Root Directory:** `backend`  *(Crucial step)*
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start` *(or `node src/server.js`)*
5. **Environment Variables:** Scroll down to the Advanced section and add:
   - `GEMINI_API_KEY`: <your-gemini-key>
   - `JWT_SECRET`: <your-jwt-secret>
6. Click **Create Web Service**. After a few minutes, Render will provide you with a live URL (e.g., `https://kiranaconnect-api.onrender.com`).

### Phase 2: Updating Frontend for Production API

Before deploying the frontend, it needs to point to your new live Render URL instead of the local Vite proxy.

1. Open `frontend/src/main.jsx` and configure Axios to point to your live Render backend URL globally. Add this near the top:
   ```javascript
   import axios from 'axios';
   axios.defaults.baseURL = 'https://kiranaconnect-api.onrender.com';
   ```
   *(Ensure you commit this change to GitHub before the next step!)*

### Phase 3: Deploying Frontend to Cloudflare Pages

Cloudflare Pages is lightning-fast and perfect for Vite + React apps.

1. Create a `_redirects` file directly inside the `frontend/public/` folder so Cloudflare routing plays nicely with React Router:
   ```text
   /* /index.html 200
   ```
   *(Commit this to GitHub!)*
2. Log into **[Cloudflare Dashboard](https://dash.cloudflare.com/)**.
3. Go to **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
4. Select your `kiranaconnect` repository.
5. **Build Configuration:**
   - **Framework Preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/frontend` *(Important: Click 'Advanced' to set this since your code is inside a subfolder!)*
6. Click **Save and Deploy**. Cloudflare will build your app and give you a live `kiranaconnect.pages.dev` URL.

🎉 **You are now entirely deployed!** The Cloudflare React frontend will securely talk to your Render Node.js backend to power the Kirana network!
