#!/bin/bash

# ABC Interview Support SSO System Startup Script

echo "🚀 Starting ABC Interview Support SSO System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Start the mock server
echo "📡 Starting mock server..."
cd mock-server
npm install --silent
npm start &
MOCK_SERVER_PID=$!
cd ..

# Wait a moment for the server to start
sleep 3

echo "🌐 Starting frontend applications..."

# Start all frontend apps
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ System started successfully!"
echo ""
echo "🔗 Access URLs:"
echo "   • SSO Portal:        http://localhost:4200"
echo "   • Student Portal:    http://localhost:4300"
echo "   • Recruiter Portal:  http://localhost:4400"
echo "   • Admin Portal:      http://localhost:4500"
echo "   • Mock API Server:   http://localhost:3000"
echo ""
echo "👤 Test Accounts:"
echo "   • Admin:     admin@example.com / admin123"
echo "   • Student:   student@example.com / student123"
echo "   • Recruiter: recruiter@example.com / recruiter123"
echo ""
echo "🛑 To stop all services, run: ./scripts/stop-all.sh"
echo ""

# Save PIDs for cleanup
echo $MOCK_SERVER_PID > .mock-server.pid
echo $FRONTEND_PID > .frontend.pid

# Keep the script running
wait
