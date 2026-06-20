# 🚀 Complete Deployment Guide: GitHub → Vercel

## Prerequisites
- Git installed and configured
- GitHub account with SSH keys configured (or use HTTPS)
- Vercel account created
- Clerk account with publishable key
- Backend and Frontend code ready

---

## 📍 Part 1: Push to GitHub

### Step 1.1: Initialize Git Repository (if not already done)

```bash
cd f:\hospital-ai-system
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### Step 1.2: Create .gitignore

Create `f:\hospital-ai-system\.gitignore`:
```
# Dependencies
node_modules/
npm-debug.log
yarn-error.log

# Environment variables
.env
.env.local
.env.*.local

# Build outputs
dist/
build/
*.tsbuildinfo

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Vercel
.vercel/
```

### Step 1.3: Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create new repository: `hospital-ai-system`
3. Choose Public or Private
4. Do NOT initialize with README (we'll push existing code)
5. Click "Create repository"

**Note the GitHub URL shown** (e.g., `https://github.com/yourusername/hospital-ai-system.git`)

### Step 1.4: Add Remote and Initial Commit

```bash
cd f:\hospital-ai-system

# Add remote repository
git remote add origin https://github.com/yourusername/hospital-ai-system.git

# Or if using SSH:
# git remote add origin git@github.com:yourusername/hospital-ai-system.git

# Verify remote
git remote -v
```

### Step 1.5: Stage and Commit All Files

```bash
cd f:\hospital-ai-system

# Add all files
git add .

# Check what will be committed
git status

# Commit
git commit -m "Initial commit: Hospital AI System with React frontend and Node.js backend"

# View commit
git log --oneline -1
```

### Step 1.6: Push to GitHub (Main Branch)

```bash
# Push to main branch
git branch -M main
git push -u origin main

# Verify push completed
git log --oneline
```

✅ **Result**: Your code is now on GitHub at `https://github.com/yourusername/hospital-ai-system`

---

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 2.1: Install Vercel CLI (Optional but Recommended)

```bash
npm install -g vercel
```

### Step 2.2: Deploy Frontend via Vercel Dashboard (Recommended)

#### Method A: Connect GitHub Repository (EASIEST)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Find and select `hospital-ai-system` repository
5. Click **"Import"**
6. Configure project:
   - **Project Name**: `hospital-ai-frontend` (or your choice)
   - **Framework Preset**: Select **"Vite"**
   - **Root Directory**: Select **"frontrend"** (important!)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

7. Add **Environment Variables**:
   - Click **"Environment Variables"**
   - Add:
     ```
     Name: VITE_CLERK_PUBLISHABLE_KEY
     Value: pk_test_xxxxx... (from Clerk Dashboard)
     
     Name: VITE_API_URL
     Value: (Leave blank for now, update after backend deployment)
     ```
   - Click **"Add"**

8. Click **"Deploy"**
9. Wait for build and deployment (takes 2-5 minutes)

✅ **Frontend is now live at**: `https://hospital-ai-frontend.vercel.app`

---

#### Method B: Using Vercel CLI

```bash
cd f:\hospital-ai-system\frontrend

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Follow prompts:
# - Link to existing project? No (first time)
# - Project name: hospital-ai-frontend
# - Which directory: ./ (current directory)
# - Modify vercel.json? No

# Get production URL from output
```

---

### Step 2.3: Configure Frontend Environment Variables

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Update `VITE_API_URL` with your backend URL (after backend deployment)

---

## 🔧 Part 3: Deploy Backend to Vercel

### Step 3.1: Prepare Backend

```bash
cd f:\hospital-ai-system\backend

# Verify package.json has correct start script
# Should have: "start": "node server.js"

# Install dependencies
npm install

# Test locally
npm start
# Ctrl+C to stop
```

### Step 3.2: Deploy Backend via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select `hospital-ai-system` repository again
5. Configure project:
   - **Project Name**: `hospital-ai-backend`
   - **Framework Preset**: **"Node.js"**
   - **Root Directory**: Select **"backend"** (important!)
   - **Build Command**: Leave empty (Node.js doesn't need build)
   - **Output Directory**: Leave empty
   - **Start Command**: `npm start`

6. Add **Environment Variables**:
   - Click **"Environment Variables"**
   - Add all variables from your `.env` file:
     ```
     SUPABASE_URL = your-supabase-url
     SUPABASE_KEY = your-supabase-key
     CORS_ORIGIN = https://hospital-ai-frontend.vercel.app
     CLERK_SECRET_KEY = your-clerk-secret
     EMAIL_USER = your-email
     EMAIL_PASSWORD = your-app-password
     WHATSAPP_API_KEY = your-whatsapp-key
     ```

7. Click **"Deploy"**
8. Wait for deployment

✅ **Backend is now live at**: `https://hospital-ai-backend.vercel.app`

---

#### Alternative: Using Vercel CLI

```bash
cd f:\hospital-ai-system\backend

vercel --prod

# Follow prompts:
# - Link to existing project? No
# - Project name: hospital-ai-backend
# - Which directory: ./ (current)
# - Modify vercel.json? No
```

---

## 🔗 Part 4: Connect Frontend and Backend

### Step 4.1: Update Frontend Environment Variable

1. Go to **Vercel Dashboard** → **hospital-ai-frontend project**
2. Go to **Settings** → **Environment Variables**
3. Update `VITE_API_URL`:
   ```
   VITE_API_URL = https://hospital-ai-backend.vercel.app
   ```
4. Click **"Save"**

### Step 4.2: Redeploy Frontend

1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Wait for rebuild with new environment variable

✅ Frontend now connects to backend

---

## ✅ Part 5: Verification

### Test Frontend
```bash
# Open in browser
https://hospital-ai-frontend.vercel.app

# Test routes
https://hospital-ai-frontend.vercel.app/
https://hospital-ai-frontend.vercel.app/doctors

# If you see page (no 404), SPA routing works ✅
```

### Test Backend API
```bash
# Test health/status endpoint
curl https://hospital-ai-backend.vercel.app/api/health

# Should return some response (not 404)
```

### Test User Sync (Frontend → Backend)
1. Go to frontend
2. Sign in with Clerk
3. Check browser console (F12 → Console)
4. Should see user sync call succeed (no errors)

### Test Chatbot API
1. Open chat widget
2. Send a message
3. Check API call in Network tab (F12 → Network)
4. Should get response from backend

---

## 📊 Deployment Checklist

### GitHub
- [ ] Git initialized locally
- [ ] `.gitignore` created
- [ ] All files committed
- [ ] Repository pushed to GitHub
- [ ] Repository visible at github.com

### Frontend
- [ ] GitHub repository connected to Vercel
- [ ] Root directory: `frontrend`
- [ ] Build outputs to `dist/`
- [ ] `VITE_CLERK_PUBLISHABLE_KEY` set
- [ ] `VITE_API_URL` set (after backend)
- [ ] Deployment successful
- [ ] Routes work (`/`, `/doctors`)
- [ ] Live URL: `https://hospital-ai-frontend.vercel.app`

### Backend
- [ ] Root directory: `backend`
- [ ] All environment variables set
- [ ] Deployment successful
- [ ] API endpoints accessible
- [ ] CORS configured for frontend URL
- [ ] Live URL: `https://hospital-ai-backend.vercel.app`

### Integration
- [ ] Frontend successfully calls backend
- [ ] User sync works
- [ ] Chatbot API works
- [ ] Email sending works
- [ ] All authentication works

---

## 🔄 Continuous Deployment

After initial setup, every time you push to GitHub:
1. Vercel automatically detects changes
2. Rebuilds and redeploys automatically
3. You can view deployment logs in Vercel Dashboard

### To push updates:

```bash
cd f:\hospital-ai-system

# Make changes to files

# Stage and commit
git add .
git commit -m "Your commit message"

# Push to GitHub
git push origin main

# Wait 1-3 minutes for Vercel to redeploy
# Check status at: https://vercel.com/dashboard
```

---

## 🆘 Troubleshooting

### Frontend shows 404 on routes
- ✅ Verify `frontrend/vercel.json` exists with SPA routing
- ✅ Check build output includes `dist/index.html`

### API calls fail / 502 errors
- ✅ Check backend `VITE_API_URL` environment variable
- ✅ Verify backend is deployed and running
- ✅ Check backend logs in Vercel Dashboard

### Environment variables not working
- ✅ Redeploy after changing env vars
- ✅ Verify variable names match code (case-sensitive)

### Build fails
- ✅ Check build logs in Vercel Dashboard
- ✅ Run `npm run build` locally to reproduce error
- ✅ Verify `package.json` has correct build command

---

## 📚 Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- Clerk Dashboard: https://dashboard.clerk.com
- GitHub: https://github.com
- Vite Docs: https://vitejs.dev
- Vercel Docs: https://vercel.com/docs

---

## 🎯 Summary

| Step | Action | Command | Result |
|------|--------|---------|--------|
| 1 | Initialize Git | `git init` | Local repo ready |
| 2 | Add GitHub remote | `git remote add origin ...` | Connected to GitHub |
| 3 | Commit & push | `git push origin main` | Code on GitHub |
| 4 | Deploy frontend | Vercel Dashboard import | Frontend live |
| 5 | Deploy backend | Vercel Dashboard import | Backend live |
| 6 | Connect | Update `VITE_API_URL` | Frontend ↔ Backend connected |
| 7 | Verify | Test routes and APIs | Deployment complete ✅ |
