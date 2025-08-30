@echo off
echo ========================================
echo Автоматическая установка Java для React Native
echo ========================================

echo Устанавливаем OpenJDK 17 через winget...
winget install Oracle.OpenJDK.17

echo Устанавливаем Android Studio (включает Android SDK)...
winget install Google.AndroidStudio

echo ========================================
echo Установка завершена!
echo Перезапустите терминал и попробуйте снова
echo ========================================
pause





