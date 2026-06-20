# Vercel Deployment Issues & Scan Report

## 📋 Executive Summary

The Hospital AI System has a **monorepo structure** with separate frontend and backend. This document outlines issues found during Vercel deployment scanning and provides solutions.

---

## 🔴 Critical Issues Found

### 1. **Missing Frontend Routing Configuration**

**Severity:** 🔴 CRITICAL

**Issue:** React Router uses client-side routing, but Vercel serves static files. Without proper configuration, navigating to routes other than `/` will result in 404 errors.

**Files Affected:** `frontrend/` (entire SPA)

**Solution:** ✅ Created `vercel.json` with SPA rewrites

```json
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html",
      "status": 200
    }
  ]
}
```

**Status:** ✅ FIXED - vercel.json created

---

### 2. **Missing Environment Variables Configuration**

**Severity:** 🔴 CRITICAL

**Issue:** Frontend requires two environment variables that must be configured in Vercel:

- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk authentication key
- `VITE_API_URL` - Backend API URL

These are used in:

- `src/main.jsx` - Clerk Provider initialization
- `src/App.jsx` - API communication
- `src/assets/components/chatbot/ChatWindow.jsx` - Multiple API calls

**Solution:** Add these to Vercel Project Settings:

```
VITE_CLERK_PUBLISHABLE_KEY = your-clerk-key
VITE_API_URL = https://your-backend-api.vercel.app
```

**Status:** ⚠️ REQUIRES MANUAL CONFIG in Vercel Dashboard

---

### 3. **Hardcoded Fallback to Localhost**

**Severity:** 🟠 MEDIUM

**Issue:** Fallback to `http://localhost:5000` in production will cause failures

```javascript
// frontrend/src/App.jsx:11
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
```

**Occurrences:**

- `src/App.jsx:11`
- `src/assets/components/chatbot/ChatWindow.jsx:10`

**Solution:** Remove localhost fallback or use a production default. Create `.env.production` file (if not using Vercel env vars):

```bash
VITE_API_URL=https://your-production-api.com
```

**Status:** ⚠️ REQUIRES ENV CONFIG

---

## 🟡 Warnings

### 4. **No Error Handling for API Calls**

**Severity:** 🟡 MEDIUM

**Issue:** Multiple fetch calls lack proper error handling in production context

**Files:**

- `src/App.jsx:15` - User sync call (no error catch)
- `src/assets/components/chatbot/ChatWindow.jsx:112` - Email confirmation
- `src/assets/components/chatbot/ChatWindow.jsx:157` - Chat message

**Recommendation:** Add try-catch blocks and proper error states to prevent silent failures in production.

**Status:** ⚠️ RECOMMENDED FIX

---

### 5. **External Favicon URL**

**Severity:** 🟡 LOW

**Issue:** Favicon loaded from external CDN (pngtree.com)

```html
<!-- frontrend/index.html:5 -->
<link rel="icon" type="image/png" href="https://png.pngtree.com/..." />
```

**Risk:** Dependency on external service, potential performance issue

**Solution:** Download and serve favicon locally in `public/` folder

**Status:** 📝 SUGGESTION

---

### 6. **Frontend Missing Git-ignore Entry**

**Severity:** 🟡 LOW

**Issue:** Make sure `.env.local` is in `.gitignore` to prevent leaking sensitive keys

**Status:** 📝 VERIFY

---

## ✅ Verification Checklist

### Before Deploying to Vercel:

- [ ] **Verify Vite Build**
  ```bash
  cd frontrend
  npm install
  npm run build
  npm run preview
  ```
- [ ] **Check Production Build**
  - Ensure `dist/` folder is created
  - Verify `dist/index.html` exists
- [ ] **Environment Variables in Vercel Dashboard**
  - [ ] Add `VITE_CLERK_PUBLISHABLE_KEY`
  - [ ] Add `VITE_API_URL` (pointing to deployed backend)
- [ ] **Backend Deployment**
  - [ ] Deploy backend first to get production URL
  - [ ] Update frontend `VITE_API_URL` with backend URL
- [ ] **Test Routes**
  - [ ] `/` loads correctly
  - [ ] `/doctors` loads correctly (React Router)
  - [ ] Refresh on `/doctors` should not 404 (SPA routing works)
- [ ] **Test API Calls**
  - [ ] User sync endpoint works
  - [ ] Chatbot API responds correctly
  - [ ] Email notifications work

---

## 📁 Files Created/Modified

### ✅ Created:

1. **`frontrend/vercel.json`** - Vercel configuration with SPA routing and security headers
2. **Backend already has `vercel.json`** ✓

### 📋 Files to Review:

- `frontrend/.env.local` - Local development only
- `frontrend/.env.production.local` - Should NOT be committed
- `frontrend/.gitignore` - Verify .env files are ignored

---

## 🚀 Deployment Steps

### Step 1: Prepare Frontend

```bash
cd frontrend
npm install
npm run build
# Verify dist/ folder exists
```

### Step 2: Configure Vercel Project

1. Connect your GitHub repo to Vercel
2. Select project root: `/` (monorepo)
3. Set Output Directory: `frontrend/dist`
4. Add Environment Variables:
   - `VITE_CLERK_PUBLISHABLE_KEY`: [get from Clerk Dashboard]
   - `VITE_API_URL`: [backend URL after deployment]

### Step 3: Deploy Backend First

```bash
cd backend
vercel deploy --prod
# Note the deployment URL
```

### Step 4: Update Frontend

1. Update `VITE_API_URL` in Vercel Dashboard with backend URL
2. Redeploy frontend

### Step 5: Verify

- Test frontend at `https://your-domain.vercel.app`
- Test routes: `/`, `/doctors`
- Verify API calls work

---

## 🔧 Configuration Files

### vercel.json (Frontend)

- ✅ Configured for Vite build output (`dist/`)
- ✅ SPA routing for React Router
- ✅ Asset caching (1 year for static assets)
- ✅ Security headers included
- ✅ Environment variable placeholders

### vercel.json (Backend)

- ✅ Already exists
- ✅ Configured for Node.js
- ✅ Routes all traffic to server.js

---

## 📊 Summary Table

| Issue               | Severity    | Status       | Fix                     |
| ------------------- | ----------- | ------------ | ----------------------- |
| Missing SPA Routing | 🔴 CRITICAL | ✅ Fixed     | vercel.json created     |
| Missing Env Vars    | 🔴 CRITICAL | ⚠️ Manual    | Add to Vercel Dashboard |
| Localhost Fallback  | 🟠 MEDIUM   | ⚠️ Manual    | Set VITE_API_URL        |
| API Error Handling  | 🟡 MEDIUM   | 📝 Suggested | Improve error handling  |
| External Favicon    | 🟡 LOW      | 📝 Suggested | Move to public/         |
| .gitignore Check    | 🟡 LOW      | 📝 Verify    | Check .gitignore        |

---

## 🎯 Next Actions

1. ✅ **Immediate**: Review and configure environment variables in Vercel
2. ⏭️ **Next**: Deploy backend and get production URL
3. ⏭️ **Then**: Deploy frontend with correct `VITE_API_URL`
4. ⏭️ **Finally**: Run deployment verification tests

---

## 📞 Support

If you encounter 404 errors on routes:

- Verify `vercel.json` routing rules
- Check build output includes `dist/index.html`
- Verify Vercel project settings point to correct build directory

If API calls fail:

- Check `VITE_API_URL` environment variable in Vercel
- Verify backend is deployed and accessible
- Check CORS headers on backend
