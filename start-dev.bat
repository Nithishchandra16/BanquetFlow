@echo off
echo ========================================================
echo   Launching BanquetFlow Platform (SESD Capstone)
echo ========================================================
echo.
echo Starting Backend API Server (Port 5000)...
start "BanquetFlow Server [Port 5000]" cmd /k "cd server && npm start"

echo Waiting 3 seconds for database connection...
timeout /t 3 /nobreak >nul

echo Starting Frontend Vite Client (Port 5173)...
start "BanquetFlow Client [Port 5173]" cmd /k "cd client && npm run dev"

echo.
echo ========================================================
echo   BanquetFlow is running!
echo   - Frontend: http://localhost:5173
echo   - Backend:  http://localhost:5000/api/health
echo ========================================================
echo.
pause

