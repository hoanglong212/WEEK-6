@echo off
setlocal

set "ROOT=%~dp0"
set "PY=%ROOT%.venv\Scripts\python.exe"
if not exist "%PY%" set "PY=python"

echo Starting backend and frontend...
echo.

start "Sentinel Backend" cmd /k "cd /d ""%ROOT%backend"" && ""%PY%"" -m uvicorn app:app --reload --port 8000"
start "Sentinel Frontend" cmd /k "cd /d ""%ROOT%frontend"" && npm.cmd run dev"

echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Two terminal windows were opened.
endlocal
