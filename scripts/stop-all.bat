@echo off
REM ABC Interview Support SSO System Shutdown Script for Windows

echo 🛑 Stopping ABC Interview Support SSO System...

echo 🧹 Killing processes on ports 3000, 4200, 4300, 4400, 4500...

REM Kill processes on specific ports
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000"') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":4200"') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":4300"') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":4400"') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":4500"') do taskkill /f /pid %%a >nul 2>&1

echo ✅ All services stopped successfully!
pause
