# Quick Start Guide - Windows / Manual

This guide shows how to start the Team Manager Live Match Control System manually on Windows or any OS.

## Prerequisites

✅ Ensure you have:
- Node.js v16+ installed (`node --version`)
- MongoDB running and accessible
- Backend and frontend dependencies installed

---

## Step-by-Step Setup

### 1. Open Terminal/PowerShell

Press `Win + X` and select "Terminal" or "PowerShell"

### 2. Start Backend Server

```powershell
# Navigate to backend directory
cd .\azores-score-backend

# Install dependencies (first time only)
npm install

# Start backend
npm start
```

**Expected output:**
```
Server running on port 3000
Connected to MongoDB
```

Leave this terminal open. The backend is now running on **http://localhost:3000**

### 3. Open New Terminal Window

Click "+" or `Ctrl + Shift + T` to open a new terminal tab/window

### 4. Start Frontend Server

```powershell
# Navigate to frontend directory
cd .\azores-football-live-main

# Install dependencies (first time only)
npm install

# Start frontend dev server
npm run dev
```

**Expected output:**
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:8001/
```

Leave this terminal open. The frontend is now running on **http://localhost:8001**

### 5. Open Browser

Go to: **http://localhost:8001**

### 6. Login

Use your Team Manager credentials to login

### 7. Test the System

1. Click "📋 Gerir Escalação" on a match
2. Create or view lineup
3. Start live match
4. Register events (goals, cards, substitutions)
5. Finish match

---

## What's Running

| Service | URL | Status |
|---------|-----|--------|
| Backend API | http://localhost:3000 | ✅ Running |
| Frontend App | http://localhost:8001 | ✅ Running |
| MongoDB | localhost:27017 | ✅ (external) |

---

## Troubleshooting

### Port 3000 Already in Use

```powershell
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change port in .env file
```

### Port 8001 Already in Use

```powershell
# Kill process on port 8001
netstat -ano | findstr :8001
taskkill /PID <PID> /F

# Or change port in vite.config.ts
```

### Cannot Install Dependencies

```powershell
# Clear npm cache
npm cache clean --force

# Try installing again
npm install
```

### MongoDB Connection Error

Check that MongoDB is running:
```powershell
# Check if mongod is running
Get-Process mongod

# Or start MongoDB if installed
mongod --dbpath "C:\data\db"
```

### Cannot Login

1. Ensure you have a Team Manager user created
2. Check backend logs for authentication errors
3. Verify JWT token is valid

---

## Useful Commands

### View Backend Logs

```powershell
# Check for errors in backend startup
# Terminal should show connection messages
```

### Restart Servers

1. In backend terminal: `Ctrl + C`
2. In frontend terminal: `Ctrl + C`
3. Close terminals
4. Repeat steps 2-4 above

### Test Backend API

```powershell
# Test if backend is responding
curl http://localhost:3000/api/health

# Or using PowerShell
Invoke-WebRequest http://localhost:3000/api/health
```

### Stop All Servers

```powershell
# In backend terminal: Ctrl + C
# In frontend terminal: Ctrl + C
```

---

## Next Steps

Once everything is running:

1. **Test Complete Flow**
   - Go to "My Matches"
   - Select a match
   - Create or view lineup
   - Start live match
   - Register events

2. **Test on Mobile Device**
   - Get your computer's IP: `ipconfig` (look for IPv4)
   - On phone, go to: `http://<YOUR_IP>:8001`
   - Test on actual device

3. **Check Documentation**
   - Read: `TEAM_MANAGER_SYSTEM_COMPLETE_SUMMARY.md`
   - Read: `TESTING_CHECKLIST_TEAM_MANAGER_FRONTEND.md`

---

## Common Issues

**Issue**: "Cannot find module..."
- Solution: Run `npm install` in that directory

**Issue**: Port already in use
- Solution: Kill process using that port (see above)

**Issue**: Cannot connect to MongoDB
- Solution: Ensure MongoDB is running

**Issue**: Buttons too small on phone
- Solution: Check `EventModal.css` mobile breakpoint

**Issue**: Events not registering
- Solution: Check browser console (F12) for errors

---

## Getting Help

1. **Check the logs**
   - Backend terminal output
   - Browser console (F12)
   - Browser Network tab

2. **Read documentation**
   - `APP_INTEGRATION_GUIDE.md` - API endpoints
   - `TESTING_CHECKLIST_TEAM_MANAGER_FRONTEND.md` - Test scenarios
   - `FRONTEND_TEAM_MANAGER_INTEGRATION.md` - Integration details

3. **Debug in browser**
   - Open DevTools: `F12`
   - Check Console tab for errors
   - Check Network tab for failed API calls
   - Check Application tab for stored data

---

## Keyboard Shortcuts

- **F12** - Open browser DevTools
- **Ctrl + R** - Refresh page
- **Ctrl + Shift + R** - Hard refresh (clear cache)
- **Ctrl + Shift + I** - Open DevTools Inspector
- **Ctrl + Alt + J** - Open DevTools Console

---

## File Locations

```
Project Root
├── azores-score-backend/
│   ├── package.json
│   └── (backend files)
│
├── azores-football-live-main/
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── pages/
│       │   └── MatchControlPage.tsx (NEW)
│       └── components/
│           ├── match/
│           │   ├── LineupView.tsx (NEW)
│           │   └── LiveMatchManager.tsx (NEW)
│           └── live/
│               └── ActionButtons.tsx (UPDATED)
```

---

## Summary

**You now have:**
✅ Backend API running on port 3000
✅ Frontend app running on port 8001
✅ Team Manager system ready for testing
✅ Complete documentation available

**Next**: Open browser and test the system!

For detailed information, see:
- `TEAM_MANAGER_SYSTEM_COMPLETE_SUMMARY.md`
- `TESTING_CHECKLIST_TEAM_MANAGER_FRONTEND.md`
