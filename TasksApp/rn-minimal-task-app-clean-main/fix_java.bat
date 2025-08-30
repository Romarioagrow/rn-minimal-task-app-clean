@echo off
echo Fixing JAVA_HOME...

REM Find Java installation
for /f "tokens=*" %%i in ('where java 2^>nul') do (
    set JAVA_PATH=%%i
    goto :found
)

:found
if defined JAVA_PATH (
    echo Found Java at: %JAVA_PATH%
    
    REM Extract directory path
    for %%i in ("%JAVA_PATH%") do set JAVA_DIR=%%~dpi
    set JAVA_HOME=%JAVA_DIR:~0,-1%
    
    echo Setting JAVA_HOME to: %JAVA_HOME%
    setx JAVA_HOME "%JAVA_HOME%" /M
    
    echo JAVA_HOME fixed!
) else (
    echo Java not found in PATH
)

echo Now trying to run the project...
npm run android
