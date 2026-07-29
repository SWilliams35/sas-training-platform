# Deployment Guide - SAS Team Training Platform

## Phase 1: Backend (Render)

1. **GitHub Setup**
   - Create new GitHub repo: `sas-training-platform`
   - Upload all **frontend files to root** (App.jsx, LoginPage.jsx, etc.)
   - Create `/backend` folder
   - Upload `backend.js` to `/backend`
   - Rename `backend-package.json` to `package.json` in `/backend`
   - Upload `backend-.env.example` to `/backend` as `.env.example`

2. **Deploy on Render**
   - Go to render.com
   - Click New → Web Service
   - Connect your GitHub repo
   - Settings:
     ```
     Name: sas-training-backend
     Root Directory: backend
     Runtime: Node
     Build: npm install
     Start: node backend.js
     ```
   - Add Environment Variables:
     ```
     SUPABASE_URL = (your Project URL)
     SUPABASE_SERVICE_ROLE_KEY = (your service_role_key)
     SUPABASE_ANON_KEY = (your anon_key)
     JWT_SECRET = any_random_string_like_abc123def456
     NODE_ENV = production
     ```
   - Click Deploy
   - Wait 2-3 mins
   - Copy your Render URL (e.g., `https://sas-training-backend.onrender.com`)

---

## Phase 2: Frontend (Vercel)

1. **GitHub**
   - Your repo already has all frontend files in root ✓

2. **Deploy on Vercel**
   - Go to vercel.com
   - Import your repo
   - Settings:
     ```
     Framework: React
     Root Directory: (leave empty - uses root)
     Build: npm run build
     Output: dist
     ```
   - Environment Variables:
     ```
     VITE_SUPABASE_URL = (your Supabase URL)
     VITE_SUPABASE_ANON_KEY = (your anon_key)
     VITE_API_URL = (your Render backend URL)
     ```
   - Click Deploy
   - Wait 3-5 mins
   - You get a live URL ✓

---

## Phase 3: Create Admin User

1. Go to your Vercel URL
2. Sign up with: `steven.williams@docusign.com`
3. In Supabase SQL Editor:
   ```sql
   UPDATE users SET is_admin = TRUE WHERE email = 'steven.williams@docusign.com';
   ```

---

## Phase 4: Test

- Log in to your Vercel URL
- Click "Start" on a module
- Click "Mark Done"
- Check "All Users" tab (admin only)
- Data should sync in real-time

---

## Phase 5: Share with Team

Send your Vercel URL to the SAS team. They sign up, you see their progress.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Cannot connect | Check `VITE_API_URL` in Vercel env vars |
| Login fails | Verify user exists in Supabase |
| No modules | Run SQL seed query in Supabase |
| Backend sleeps | Free Render tier sleeps. Upgrade to $7/month or access every 15 mins |

---

## File Structure

```
sas-training-platform/
├── App.jsx
├── App.css
├── LoginPage.jsx
├── LoginPage.css
├── Dashboard.jsx
├── Dashboard.css
├── index.html
├── main.jsx
├── vite.config.js
├── package.json (frontend)
├── .env.example (frontend)
├── backend/
│   ├── backend.js
│   ├── package.json
│   └── .env.example
├── README.md
├── SETUP_GUIDE.md
└── DEPLOYMENT.md
```

---

**Done!** You now have a live, shareable training platform.
