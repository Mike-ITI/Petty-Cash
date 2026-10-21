@echo off
cd /d "%~dp0"
set "PETTY_CASH_NODE=node"
where node >nul 2>nul
if errorlevel 1 set "PETTY_CASH_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
"%PETTY_CASH_NODE%" scripts\serve.mjs
pause
