#!/bin/bash

# QUICK START GUIDE - Get Team Manager System Running in 5 Minutes

echo "=========================================="
echo "Team Manager Live Match Control System"
echo "QUICK START SETUP"
echo "=========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============================================================================
# STEP 1: VERIFY PREREQUISITES
# ============================================================================

echo -e "${BLUE}STEP 1: Checking Prerequisites...${NC}"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not installed. Please install it first."
    exit 1
fi
echo "✅ Node.js $(node --version) found"

# Check if MongoDB is running (optional but helpful)
if command -v mongosh &> /dev/null; then
    echo "✅ MongoDB tools found"
else
    echo "⚠️  MongoDB mongosh not found (optional)"
fi

echo ""

# ============================================================================
# STEP 2: SETUP BACKEND
# ============================================================================

echo -e "${BLUE}STEP 2: Starting Backend Server...${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] || ! grep -q "azores-score-backend" package.json > /dev/null 2>&1; then
    echo "Attempting to navigate to backend directory..."
    if [ -d "azores-score-backend" ]; then
        cd azores-score-backend || exit 1
        echo "✅ Changed to azores-score-backend directory"
    else
        echo "❌ Cannot find backend directory."
        echo "Please make sure you're in the project root."
        exit 1
    fi
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

echo "🚀 Starting backend server (will run in background)..."
npm start > backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"
echo "   Running on: http://localhost:3000"
echo ""

# Wait for backend to be ready
echo "⏳ Waiting for backend to start (5 seconds)..."
sleep 5

echo ""

# ============================================================================
# STEP 3: SETUP FRONTEND
# ============================================================================

echo -e "${BLUE}STEP 3: Starting Frontend Server...${NC}"
echo ""

# Navigate to frontend
cd ..
if [ -d "azores-football-live-main" ]; then
    cd azores-football-live-main || exit 1
    echo "✅ Changed to azores-football-live-main directory"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

echo "🚀 Starting frontend development server..."
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"
echo ""

# ============================================================================
# STEP 4: VERIFY SERVERS ARE RUNNING
# ============================================================================

echo -e "${BLUE}STEP 4: Verifying Servers...${NC}"
echo ""

echo "⏳ Waiting for frontend to start (5 seconds)..."
sleep 5

# Check backend
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Backend is running: http://localhost:3000"
else
    echo "⚠️  Backend might still be starting (this is normal)"
    echo "   Check backend.log if it doesn't start: tail backend.log"
fi

# Check frontend
if curl -s http://localhost:8000 > /dev/null 2>&1; then
    echo "✅ Frontend is running: http://localhost:8000"
else
    echo "⚠️  Frontend might still be starting (this is normal)"
    echo "   Check frontend.log if it doesn't start: tail frontend.log"
fi

echo ""

# ============================================================================
# STEP 5: OPEN BROWSER
# ============================================================================

echo -e "${BLUE}STEP 5: Opening Application...${NC}"
echo ""

echo "Frontend will be available at: http://localhost:8000"
echo ""

# Try to open browser (works on macOS, Linux, Windows)
if command -v open &> /dev/null; then
    # macOS
    open http://localhost:8000
elif command -v xdg-open &> /dev/null; then
    # Linux
    xdg-open http://localhost:8000 > /dev/null 2>&1 &
elif command -v start &> /dev/null; then
    # Windows
    start http://localhost:8000
fi

echo ""

# ============================================================================
# STEP 6: FINAL INSTRUCTIONS
# ============================================================================

echo -e "${GREEN}=========================================="
echo "✅ SETUP COMPLETE!"
echo "==========================================${NC}"
echo ""
echo -e "${YELLOW}WHAT TO DO NEXT:${NC}"
echo ""
echo "1. WAIT 30-60 seconds for both servers to fully start"
echo ""
echo "2. OPEN BROWSER:"
echo "   → Frontend: http://localhost:8000"
echo "   → Backend: http://localhost:3000"
echo ""
echo "3. LOGIN with Team Manager credentials"
echo ""
echo "4. GO TO MY MATCHES and select a match"
echo ""
echo "5. CLICK '📋 Gerir Escalação' to:"
echo "   → Create/view lineup on football pitch"
echo "   → Start live match"
echo "   → Register events (goals, cards, substitutions)"
echo ""
echo -e "${YELLOW}USEFUL COMMANDS:${NC}"
echo ""
echo "View backend logs:"
echo "  tail -f ../azores-score-backend/backend.log"
echo ""
echo "View frontend logs:"
echo "  tail -f frontend.log"
echo ""
echo "Kill all processes:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo -e "${YELLOW}TROUBLESHOOTING:${NC}"
echo ""
echo "❌ Port 3000 already in use?"
echo "   → Change in backend: config.js or .env"
echo "   → Restart with: npm run dev -- --port 3001"
echo ""
echo "❌ Port 8000 already in use?"
echo "   → Change in frontend: vite.config.ts"
echo "   → Restart frontend"
echo ""
echo "❌ MongoDB not connecting?"
echo "   → Ensure MongoDB is running"
echo "   → Check connection string in backend"
echo ""
echo "❌ See error in logs?"
echo "   → Check backend.log or frontend.log"
echo "   → Look for error messages and fix"
echo ""
echo -e "${YELLOW}DOCUMENTATION:${NC}"
echo ""
echo "📚 Complete guides available in root directory:"
echo "   • TEAM_MANAGER_SYSTEM_COMPLETE_SUMMARY.md"
echo "   • FRONTEND_TEAM_MANAGER_INTEGRATION.md"
echo "   • TESTING_CHECKLIST_TEAM_MANAGER_FRONTEND.md"
echo "   • APP_INTEGRATION_GUIDE.md"
echo ""
echo -e "${GREEN}Happy testing! 🎉${NC}"
echo ""
