param(
    [int]$BackendPort = 8000,
    [int]$FrontendPort = 4200
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $root 'backend'
$frontendDir = Join-Path $root 'frontend'

Write-Host "Démarrage de SUCCES-GMDI..."
Write-Host "Backend : http://127.0.0.1:$BackendPort"
Write-Host "Frontend : http://127.0.0.1:$FrontendPort"

if (-not (Test-Path (Join-Path $backendDir 'vendor'))) {
    Write-Host 'Installation des dépendances PHP du backend...'
    Push-Location $backendDir
    try {
        composer install --no-interaction --ignore-platform-req=ext-openssl
    }
    finally {
        Pop-Location
    }
}

if (-not (Test-Path (Join-Path $frontendDir 'node_modules'))) {
    Write-Host 'Installation des dépendances Node du frontend...'
    Push-Location $frontendDir
    try {
        npm install --legacy-peer-deps
    }
    finally {
        Pop-Location
    }
}

$backendEnv = Join-Path $backendDir '.env'
if (-not (Test-Path $backendEnv)) {
    Copy-Item (Join-Path $backendDir '.env.example') $backendEnv -Force
}

$databaseDir = Join-Path $backendDir 'database'
$databaseFile = Join-Path $databaseDir 'database.sqlite'
if (-not (Test-Path $databaseFile)) {
    New-Item -ItemType File -Path $databaseFile -Force | Out-Null
}

Push-Location $backendDir
try {
    php artisan key:generate --force | Out-Null
    php artisan migrate --force | Out-Null
}
finally {
    Pop-Location
}

Write-Host 'Lancement du backend Laravel...'
$backendProcess = Start-Process -FilePath 'php.exe' -ArgumentList @('artisan','serve','--host=127.0.0.1','--port=' + $BackendPort) -WorkingDirectory $backendDir -PassThru

Write-Host 'Lancement du frontend Angular...'
$frontendProcess = Start-Process -FilePath 'npm.cmd' -ArgumentList @('start','--','--host=127.0.0.1','--port=' + $FrontendPort) -WorkingDirectory $frontendDir -PassThru

try {
    Wait-Process -Id $backendProcess.Id, $frontendProcess.Id
}
finally {
    if (-not $backendProcess.HasExited) { Stop-Process $backendProcess.Id -Force }
    if (-not $frontendProcess.HasExited) { Stop-Process $frontendProcess.Id -Force }
}
