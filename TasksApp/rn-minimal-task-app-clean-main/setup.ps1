Write-Host "========================================" -ForegroundColor Green
Write-Host "Автоматическая установка Java и Android SDK" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Проверяем наличие Java
Write-Host "Проверяем наличие Java..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1
    Write-Host "Java уже установлена:" -ForegroundColor Green
    Write-Host $javaVersion[0] -ForegroundColor White
} catch {
    Write-Host "Java не найдена. Устанавливаем..." -ForegroundColor Yellow
    
    # Устанавливаем OpenJDK через winget
    Write-Host "Устанавливаем OpenJDK 17..." -ForegroundColor Yellow
    winget install Oracle.OpenJDK.17 --accept-source-agreements --accept-package-agreements
    
    Write-Host "Java установлена!" -ForegroundColor Green
}

# Проверяем Android SDK
Write-Host "Проверяем Android SDK..." -ForegroundColor Yellow
if (Test-Path "$env:LOCALAPPDATA\Android\Sdk") {
    Write-Host "Android SDK найден" -ForegroundColor Green
} else {
    Write-Host "Android SDK не найден. Устанавливаем Android Studio..." -ForegroundColor Yellow
    
    # Устанавливаем Android Studio
    Write-Host "Устанавливаем Android Studio..." -ForegroundColor Yellow
    winget install Google.AndroidStudio --accept-source-agreements --accept-package-agreements
    
    Write-Host "Android Studio установлен!" -ForegroundColor Green
}

Write-Host "========================================" -ForegroundColor Green
Write-Host "Установка завершена!" -ForegroundColor Green
Write-Host "Перезапустите терминал для применения изменений" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Green

Read-Host "Нажмите Enter для продолжения"





