@echo off
title Cai dat He Thong QLTT An Giang tren may moi
cd /d "%~dp0"
set PATH=C:\Program Files\nodejs;%PATH%

echo =======================================================================
echo    CHI CUC QUAN LY THI TRUONG TINH AN GIANG - PHONG NV-TH
echo    CAI DAT HE THONG DASHBOARD VA APP TRA CUU QLTT
echo =======================================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] May tinh chua co Node.js.
    echo Dang mo trang tai Node.js chinh thuc (Vui long tai ban LTS va cai dat)...
    start https://nodejs.org/en/download
    echo.
    echo Sau khi cai xong Node.js, hay nhap dup lai file nay!
    pause
    exit /b
)

echo [*] Dang cai dat cac goi thu vien can thiet (chi can chay 1 lan dau tien)...
npm install

echo.
echo [*] Cai dat hoan tat! Dang khoi dong Dashboard...
start http://localhost:3000
npm run dev

pause