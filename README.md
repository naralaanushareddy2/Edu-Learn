# EduLearn - Modern E-Learning Platform

A full-featured, responsive E-Learning platform built with React 19, Redux Toolkit, React Router v7, and modern design tokens with full Light & Dark mode support.

---

## 🚀 Quick Start (Local Development)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Terminal 1 - Start Backend API (JSON Server):**
   ```bash
   npm run server
   ```
   *Runs JSON Server at `http://localhost:5000` connected to `data/db.json`.*

3. **Terminal 2 - Start Frontend (Vite):**
   ```bash
   npm run dev
   ```

---

## 🔑 Demo Accounts

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Administrator** | `nari@gmail.com` | `Nari@123` | Full access to `/admin` dashboard, user management, locking & statistics |
| **Student** | `anusha@gmail.com` | `Anusha@123` | Access to enrolled courses, course player, wishlist, and certificate download |

---

## 🌐 Production & Deployment

### Build Command
```bash
npm run build
```
Generates an optimized, chunk-split production build in the `dist/` directory.

### Deployment Platforms (Vercel, Netlify, Cloudflare Pages, Render)
- **Vercel**: Pre-configured with [`vercel.json`](file:///c:/Users/Anusha/Desktop/edu-learn/vercel.json) rewrite rules to handle client-side routing on direct URL hits and refreshes.
- **Netlify / Cloudflare Pages**: Pre-configured with [`public/_redirects`](file:///c:/Users/Anusha/Desktop/edu-learn/public/_redirects) (`/* /index.html 200`).
- **Backend in Deployment**:
  - If you deploy a hosted backend, set the environment variable:
    ```
    VITE_API_URL=https://your-backend-api.example.com
    ```
  - If deploying purely as a static frontend demo, the app features an automatic **resilient fallback layer** (`src/services/api.js`) that persists state in browser storage using seed data from `data/db.json`. All features (login, registration, course enrollment, progress tracking, certificate generation, and admin management) work seamlessly out-of-the-box in production!

---

## 🛠️ Verification & Linting
```bash
npm run lint    # Passes with 0 errors, 0 warnings
npm run build   # Fast build (~500ms) with clean vendor chunk splitting
```

