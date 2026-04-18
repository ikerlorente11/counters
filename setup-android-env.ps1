# Ejecuta este script DESPUES de instalar Android Studio
# Abre PowerShell como Administrador y ejecuta:
#   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
#   .\setup-android-env.ps1

Write-Host "Buscando Android Studio y el SDK de Android..." -ForegroundColor Cyan

# Rutas candidatas para el SDK
$sdkCandidates = @(
    "$env:LOCALAPPDATA\Android\Sdk",
    "$env:USERPROFILE\AppData\Local\Android\Sdk",
    "C:\Android\Sdk"
)

# Rutas candidatas para el JDK (bundled con Android Studio)
$jbrCandidates = @(
    "C:\Program Files\Android\Android Studio\jbr",
    "C:\Program Files\Android\Android Studio\jre",
    "$env:LOCALAPPDATA\Programs\Android Studio\jbr",
    "$env:LOCALAPPDATA\Programs\Android Studio\jre",
    "C:\Program Files\Android\Android Studio\jdk"
)

$sdkPath = $sdkCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
$jbrPath = $jbrCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $sdkPath) {
    Write-Host "ERROR: No se encontro el SDK de Android." -ForegroundColor Red
    Write-Host "Abre Android Studio -> More Actions -> SDK Manager y verifica la ruta del SDK."
    Write-Host "Luego edita este script y pon la ruta correcta en la variable sdkPath."
    exit 1
}

if (-not $jbrPath) {
    Write-Host "ERROR: No se encontro el JDK de Android Studio." -ForegroundColor Red
    Write-Host "Asegurate de que Android Studio esta instalado correctamente."
    exit 1
}

Write-Host "SDK encontrado en: $sdkPath" -ForegroundColor Green
Write-Host "JDK encontrado en: $jbrPath" -ForegroundColor Green

# Configurar variables de entorno para el usuario actual
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", $sdkPath, "User")
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", $jbrPath, "User")

# Actualizar PATH del usuario
$currentPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
$newEntries = @(
    "$sdkPath\platform-tools",
    "$sdkPath\tools\bin",
    "$jbrPath\bin"
)

$pathParts = $currentPath -split ";"
foreach ($entry in $newEntries) {
    if ($pathParts -notcontains $entry) {
        $pathParts += $entry
        Write-Host "Anadido al PATH: $entry" -ForegroundColor Yellow
    } else {
        Write-Host "Ya en PATH: $entry" -ForegroundColor Gray
    }
}

$newPath = ($pathParts | Where-Object { $_ -ne "" }) -join ";"
[System.Environment]::SetEnvironmentVariable("Path", $newPath, "User")

Write-Host ""
Write-Host "Variables de entorno configuradas correctamente." -ForegroundColor Green
Write-Host "ANDROID_HOME = $sdkPath"
Write-Host "JAVA_HOME    = $jbrPath"
Write-Host ""
Write-Host "IMPORTANTE: Cierra y vuelve a abrir PowerShell para aplicar los cambios." -ForegroundColor Cyan
Write-Host "Luego ejecuta: adb devices"
Write-Host "Y a continuacion: npx expo run:android"
