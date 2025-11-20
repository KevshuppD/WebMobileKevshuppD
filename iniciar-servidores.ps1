param(
    [switch]$NoWait
)

Write-Host "Iniciando servidores de la Biblioteca de Cursos..." -ForegroundColor Green
Write-Host ""

# Función para iniciar un proceso en segundo plano
function Start-BackgroundProcess {
    param(
        [string]$Name,
        [string]$Command,
        [string]$WorkingDirectory
    )

    Write-Host "Iniciando $Name..." -ForegroundColor Yellow
    $process = Start-Process -FilePath "cmd.exe" -ArgumentList "/c $Command" -WorkingDirectory $WorkingDirectory -PassThru -WindowStyle Normal
    return $process
}

# Construir e iniciar backend
Write-Host "Construyendo backend..." -ForegroundColor Cyan
Push-Location "backend"
try {
    & npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Error al compilar el backend"
        exit 1
    }
    $backendProcess = Start-BackgroundProcess -Name "Backend" -Command "npm start" -WorkingDirectory (Get-Location)
} finally {
    Pop-Location
}

# Esperar un poco para que el backend inicie
Start-Sleep -Seconds 3

# Iniciar frontend
Write-Host "Iniciando frontend..." -ForegroundColor Cyan
Push-Location "frontend"
try {
    $frontendProcess = Start-BackgroundProcess -Name "Frontend" -Command "npm start" -WorkingDirectory (Get-Location)
} finally {
    Pop-Location
}

Write-Host ""
Write-Host "Servidores iniciados correctamente!" -ForegroundColor Green
Write-Host "- Backend: http://localhost:3000" -ForegroundColor White
Write-Host "- Frontend: http://localhost:3001" -ForegroundColor White
Write-Host ""

if (-not $NoWait) {
    Write-Host "Presiona Ctrl+C para detener los servidores..." -ForegroundColor Yellow
    try {
        # Mantener el script corriendo
        while ($true) {
            Start-Sleep -Seconds 1
        }
    } finally {
        Write-Host "Cerrando servidores..." -ForegroundColor Red
        Stop-Process -Id $backendProcess.Id -ErrorAction SilentlyContinue
        Stop-Process -Id $frontendProcess.Id -ErrorAction SilentlyContinue
        Write-Host "Servidores cerrados." -ForegroundColor Red
    }
}