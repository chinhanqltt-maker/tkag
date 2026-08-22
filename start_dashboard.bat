@echo off
title He Thong Dashboard Bao Cao QLTT An Giang
cd /d "%~dp0"
set PATH=C:\Program Files\nodejs;%LOCALAPPDATA%\Programs\node;%APPDATA%\npm;%PATH%

echo =======================================================================
echo    CHI CUC QUAN LY THI TRUONG TINH AN GIANG - PHONG NV-TH
echo    HE THONG DASHBOARD TONG HOP BAO CAO & QUAN LY CO SO KINH DOANH
echo =======================================================================
echo.
echo May chu dang duoc khoi dong tai: http://localhost:3001
echo Vui long GIU NGUYEN cua so nay trong suot qua trinh su dung.
echo.

call npm run dev

pause