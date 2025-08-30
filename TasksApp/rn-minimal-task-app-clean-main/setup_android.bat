@echo off
echo ========================================
echo Установка Android SDK и Java для React Native
echo ========================================

echo Проверяем наличие Java...
java -version >nul 2>&1
if %errorlevel% equ 0 (
    echo Java уже установлена
    java -version
) else (
    echo Java не найдена. Устанавливаем OpenJDK...
    
    echo Скачиваем OpenJDK 17...
    powershell -Command "& {Invoke-WebRequest -Uri 'https://download.java.net/java/GA/jdk17.0.2/dfd4a8d0985749f896bed50d7138ee7f/8/GPL/openjdk-17.0.2_windows-x64_bin.zip' -OutFile 'openjdk.zip'}"
    
    echo Распаковываем...
    powershell -Command "& {Expand-Archive -Path 'openjdk.zip' -DestinationPath 'C:\' -Force}"
    
    echo Устанавливаем переменные среды...
    setx JAVA_HOME "C:\jdk-17.0.2" /M
    setx PATH "%PATH%;C:\jdk-17.0.2\bin" /M
    
    echo Удаляем временные файлы...
    del openjdk.zip
    
    echo Java установлена!
)

echo Проверяем Android SDK...
if exist "%LOCALAPPDATA%\Android\Sdk" (
    echo Android SDK найден
) else (
    echo Android SDK не найден. Устанавливаем...
    
    echo Скачиваем Android Command Line Tools...
    powershell -Command "& {Invoke-WebRequest -Uri 'https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip' -OutFile 'android-tools.zip'}"
    
    echo Создаем папку для Android SDK...
    mkdir "%LOCALAPPDATA%\Android\Sdk" 2>nul
    mkdir "%LOCALAPPDATA%\Android\Sdk\cmdline-tools" 2>nul
    
    echo Распаковываем...
    powershell -Command "& {Expand-Archive -Path 'android-tools.zip' -DestinationPath '%LOCALAPPDATA%\Android\Sdk\cmdline-tools\' -Force}"
    
    echo Переименовываем папку...
    ren "%LOCALAPPDATA%\Android\Sdk\cmdline-tools\cmdline-tools" "latest"
    
    echo Устанавливаем переменные среды...
    setx ANDROID_HOME "%LOCALAPPDATA%\Android\Sdk" /M
    setx PATH "%PATH%;%LOCALAPPDATA%\Android\Sdk\cmdline-tools\latest\bin;%LOCALAPPDATA%\Android\Sdk\platform-tools" /M
    
    echo Удаляем временные файлы...
    del android-tools.zip
    
    echo Android SDK установлен!
)

echo ========================================
echo Установка завершена!
echo Перезапустите терминал для применения изменений
echo ========================================
pause





