@echo off
echo Killing all Node.js processes...
taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (
    echo Successfully killed Node.js processes
) else (
    echo No Node.js processes found or already terminated
)

echo Cleaning npm cache...
call npm cache clean --force

echo Cleaning Gatsby cache...
call npm run clean

echo Done! You can now run 'npm run dev-fast' safely.
pause