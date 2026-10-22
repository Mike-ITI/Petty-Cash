@echo off
setlocal
cd /d "%~dp0"
set "PETTY_CASH_CADDY=%LOCALAPPDATA%\Microsoft\WinGet\Packages\CaddyServer.Caddy_Microsoft.Winget.Source_8wekyb3d8bbwe\caddy.exe"
set "PETTY_CASH_NODE=node"
where node >nul 2>nul
if errorlevel 1 set "PETTY_CASH_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"

start "Petty Cash app" cmd /k "cd /d "%~dp0" && "%PETTY_CASH_NODE%" scripts\serve.mjs"
timeout /t 2 /nobreak >nul
start "Petty Cash LAN HTTPS" "%PETTY_CASH_CADDY%" run --config "%~dp0Caddyfile"

echo Petty Cash LAN HTTPS is starting.
echo URL: https://192.168.5.57:8443
echo Keep both windows open while the service is in use.
pause
