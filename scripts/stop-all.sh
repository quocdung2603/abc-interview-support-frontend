#!/bin/bash

# ABC Interview Support SSO System Shutdown Script

echo "🛑 Stopping ABC Interview Support SSO System..."

# Stop frontend apps
if [ -f .frontend.pid ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    echo "📱 Stopping frontend applications (PID: $FRONTEND_PID)..."
    kill -TERM $FRONTEND_PID 2>/dev/null
    rm -f .frontend.pid
fi

# Stop mock server
if [ -f .mock-server.pid ]; then
    MOCK_SERVER_PID=$(cat .mock-server.pid)
    echo "📡 Stopping mock server (PID: $MOCK_SERVER_PID)..."
    kill -TERM $MOCK_SERVER_PID 2>/dev/null
    rm -f .mock-server.pid
fi

# Kill any remaining Node.js processes on our ports
echo "🧹 Cleaning up remaining processes..."
lsof -ti:3000,4200,4300,4400,4500 | xargs kill -9 2>/dev/null

echo "✅ All services stopped successfully!"
