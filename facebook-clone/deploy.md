# Deployment Guide

## GitHub Repository Setup

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Repository name: `facebook-clone`
   - Description: `A Facebook-like social media application built with Next.js and Express.js`
   - Make it public or private as you prefer
   - Don't initialize with README (we already have one)

2. **Push your code to GitHub:**
   ```bash
   # Add the remote repository (replace YOUR_USERNAME with your GitHub username)
   git remote add origin https://github.com/YOUR_USERNAME/facebook-clone.git
   
   # Push the code
   git branch -M main
   git push -u origin main
   ```

## Deployment Options

### Option 1: Vercel (Recommended for Frontend)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `.next`
4. Deploy a separate backend on Railway, Render, or Heroku

### Option 2: Railway (Full-Stack)
1. Connect your GitHub repository to Railway
2. Railway can auto-detect and deploy both frontend and backend
3. Set environment variables as needed

### Option 3: Heroku
1. Create two apps: one for frontend, one for backend
2. Deploy backend first, then update frontend API URLs
3. Use Heroku's Node.js buildpack

### Option 4: Render
1. Create a web service for the backend
2. Create a static site for the frontend
3. Update API URLs in frontend code

## Environment Variables

For production deployment, you may want to set:

```bash
# Backend
PORT=3001
NODE_ENV=production

# Frontend
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

## Local Development Reminder

```bash
# Install dependencies
npm install

# Start both servers
npm run dev

# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```