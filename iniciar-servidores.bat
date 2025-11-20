@echo off
echo ================================================
echo    INICIANDO SERVIDORES - BIBLIOTECA DE CURSOS
echo ================================================
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js no está instalado.
    echo Por favor instala Node.js desde https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Verificar si npm está disponible
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm no está disponible.
    echo Asegúrate de que Node.js esté correctamente instalado.
    echo.
    pause
    exit /b 1
)

echo [+] Node.js y npm detectados correctamente
echo.

REM Verificar e instalar dependencias del backend
echo [+] Verificando dependencias del backend...
if not exist "backend\node_modules" (
    echo [ ] Instalando dependencias del backend...
    cd backend
    npm install
    if errorlevel 1 (
        echo [-] ERROR: Falló la instalación de dependencias del backend
        cd ..
        pause
        exit /b 1
    )
    cd ..
    echo [+] Dependencias del backend instaladas
) else (
    echo [+] Dependencias del backend ya instaladas
)

REM Verificar e instalar dependencias del frontend
echo [+] Verificando dependencias del frontend...
if not exist "frontend\node_modules" (
    echo [ ] Instalando dependencias del frontend...
    cd frontend
    npm install
    if errorlevel 1 (
        echo [-] ERROR: Falló la instalación de dependencias del frontend
        cd ..
        pause
        exit /b 1
    )
    cd ..
    echo [+] Dependencias del frontend instaladas
) else (
    echo [+] Dependencias del frontend ya instaladas
)

echo.
echo [+] Construyendo backend...
cd backend
npm run build
if errorlevel 1 (
    echo [-] ERROR: Falló la compilación del backend
    cd ..
    pause
    exit /b 1
)
cd ..
echo [+] Backend compilado exitosamente
echo.

echo [+] Iniciando backend...
start "Backend Server - Puerto 3000" cmd /k "cd backend && echo Backend ejecutandose en http://localhost:3000 && echo Presiona Ctrl+C para cerrar && npm start"

echo [+] Esperando que el backend inicie...
timeout /t 5 /nobreak >nul

echo [+] Iniciando frontend...
start "Frontend Server - Puerto 3001" cmd /k "cd frontend && echo Frontend ejecutandose en http://localhost:3001 && echo Presiona Ctrl+C para cerrar && npm start"

echo.
echo ================================================
echo         ¡SERVIDORES INICIADOS CORRECTAMENTE!
echo ================================================
echo.
echo 🌐 Aplicación disponible en:
echo    http://localhost:3001
echo.
echo 🔧 API Backend disponible en:
echo    http://localhost:3000
echo.
echo 📝 Para detener los servidores:
echo    Cierra las ventanas de comandos o presiona Ctrl+C en cada una
echo.
echo Presiona cualquier tecla para cerrar este script...
pause >nul

echo.
echo Cerrando servidores...
taskkill /f /im node.exe /fi "WINDOWTITLE eq Backend Server*" >nul 2>&1
taskkill /f /im node.exe /fi "WINDOWTITLE eq Frontend Server*" >nul 2>&1
echo Servidores cerrados.
timeout /t 2 >nul