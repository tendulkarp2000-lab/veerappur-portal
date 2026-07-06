@echo off
title Veerappur Digital Seva Portal Launcher
color 0E
echo.
echo  =============================================================
echo   VEERAPPUR DIGITAL SEVA PORTAL LAUNCHER
echo  =============================================================
echo.
echo   [1/2] Launching temple digital seva server...

:: Navigate to current directory
cd /d "%~dp0"

:: Start the node server in a new window
start "Veerappur Portal Server" cmd /c "node.exe server.js"

echo   [2/2] Opening client portal in default browser...
timeout /t 2 /nobreak >nul
start "" "http://localhost:5000"

echo.
echo  =============================================================
echo   Portal Server is running successfully!
echo.
echo   Local Address: http://localhost:5000
echo.
echo   To STOP the server, close the other window titled 
echo   "Veerappur Portal Server" or press Ctrl+C in it.
echo  =============================================================
echo.
pause
