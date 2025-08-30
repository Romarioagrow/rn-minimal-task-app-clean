@echo off
echo Устанавливаем зависимости...
"C:\Program Files\nodejs\npm.cmd" install
if %errorlevel% neq 0 (
    echo Ошибка при установке зависимостей
    pause
    exit /b 1
)

echo Запускаем проект...
"C:\Program Files\nodejs\npm.cmd" start
pause







