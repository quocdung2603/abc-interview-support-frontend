@echo off
REM ABC Interview Support SSO System Startup Script for Windows

echo 🚀 Starting ABC Interview Support SSO System...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

REM Start the mock server
echo 📡 Starting mock server...
cd mock-server
call npm install --silent
start "Mock Server" cmd /k "npm start"
cd ..

REM Wait a moment for the server to start
timeout /t 3 >nul

echo 🌐 Starting frontend applications...
start "Frontend Apps" cmd /k "npm run dev"

echo.
echo ✅ System started successfully!
echo.
echo 🔗 Access URLs:
echo    • SSO Portal:        http://localhost:4200
echo    • Student Portal:    http://localhost:4300  
echo    • Recruiter Portal:  http://localhost:4400
echo    • Admin Portal:      http://localhost:4500
echo    • Mock API Server:   http://localhost:3000
echo.
echo 👤 Test Accounts:
echo    • Admin:     admin@example.com / admin123
echo    • Student:   student@example.com / student123
echo    • Recruiter: recruiter@example.com / recruiter123
echo.
echo 🛑 To stop all services, close the terminal windows or run: scripts\stop-all.bat
echo.
pause
