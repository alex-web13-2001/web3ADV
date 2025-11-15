#!/bin/bash

# Wildberries Ads Dashboard - Start Script
# This script starts both the backend and frontend servers

echo "Starting Wildberries Ads Analytics Dashboard..."
echo ""

# Check if node_modules exist
if [ ! -d "backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

echo ""
echo "Starting backend server on port 3001..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

echo "Waiting for backend to initialize..."
sleep 3

echo ""
echo "Starting frontend server on port 3000..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "============================================"
echo "Dashboard is starting up!"
echo "============================================"
echo "Backend:  http://localhost:3001"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "============================================"

# Function to kill both processes on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup INT TERM

# Wait for processes
wait
