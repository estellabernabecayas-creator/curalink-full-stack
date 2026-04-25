# 🚀 CuraLink Render Deployment Checklist

## ✅ Pre-Deployment Preparation (Completed)
- [x] Backend package.json updated with production scripts
- [x] Frontend package.json updated with serve package
- [x] Admin package.json updated with serve package
- [x] Render configuration files created
- [x] .gitignore file created
- [x] Frontend uses VITE_BACKEND_URL environment variable

## 🔄 Deployment Steps

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Ready for Render deployment"
git branch -M main
git remote add origin https://github.com/yourusername/curalink-full-stack.git
git push -u origin main
```

### Step 2: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize repository access

### Step 3: Deploy Backend
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. **Root Directory**: `backend`
4. **Name**: `curalink-backend`
5. **Runtime**: `Node`
6. **Build Command**: `npm install`
7. **Start Command**: `npm start`
8. **Plan**: Free
9. **Add Environment Variables**:
   ```
   MONGODB_URL=mongodb+srv://your-connection-string
   JWT_SECRET=your-jwt-secret
   NODE_ENV=production
   PORT=5000
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-key
   CLOUDINARY_API_SECRET=your-cloudinary-secret
   STRIPE_SECRET_KEY=your-stripe-secret
   RAZORPAY_KEY_ID=your-razorpay-key
   RAZORPAY_KEY_SECRET=your-razorpay-secret
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   GOOGLE_AI_API_KEY=your-google-ai-key
   ```
10. Click "Create Web Service"

### Step 4: Deploy Frontend
1. Click "New +" → "Web Service"
2. Connect same GitHub repository
3. **Root Directory**: `frontend`
4. **Name**: `curalink-frontend`
5. **Runtime**: `Static`
6. **Build Command**: `npm install && npm run build`
7. **Publish Directory**: `dist`
8. **Plan**: Free
9. **Add Environment Variable**:
   ```
   VITE_BACKEND_URL=https://your-backend-url.onrender.com
   ```
10. Click "Create Web Service"

### Step 5: Deploy Admin
1. Click "New +" → "Web Service"
2. Connect same GitHub repository
3. **Root Directory**: `admin`
4. **Name**: `curalink-admin`
5. **Runtime**: `Static`
6. **Build Command**: `npm install && npm run build`
7. **Publish Directory**: `dist`
8. **Plan**: Free
9. **Add Environment Variable**:
   ```
   VITE_BACKEND_URL=https://your-backend-url.onrender.com
   ```
10. Click "Create Web Service"

## 🎯 Post-Deployment Testing
- [ ] Backend health check: `https://your-backend.onrender.com/`
- [ ] Frontend loads: `https://your-frontend.onrender.com/`
- [ ] Admin panel loads: `https://your-admin.onrender.com/`
- [ ] User registration works
- [ ] Doctor login works
- [ ] Admin login works
- [ ] Appointment booking works
- [ ] Image uploads work

## 🔧 Troubleshooting
- If backend fails: Check environment variables and MongoDB connection
- If frontend fails: Check VITE_BACKEND_URL matches backend URL
- If images fail: Check Cloudinary credentials
- If emails fail: Check email credentials

## 📝 Important Notes
- Render free tier: 750 hours/month
- Backend URL will be: `https://your-service-name.onrender.com`
- Frontend will auto-redeploy on GitHub push
- Check Render logs for debugging
- MongoDB Atlas recommended for database
