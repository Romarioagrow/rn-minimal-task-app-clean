Write-Host "Installing Java..." -ForegroundColor Green

# Try to install Java using winget
try {
    Write-Host "Attempting to install OpenJDK 17..." -ForegroundColor Yellow
    winget install Oracle.OpenJDK.17 --accept-source-agreements --accept-package-agreements
    Write-Host "Java installation completed!" -ForegroundColor Green
} catch {
    Write-Host "Failed to install via winget. Trying alternative method..." -ForegroundColor Red
    
    # Alternative: Download and install manually
    Write-Host "Downloading OpenJDK 17..." -ForegroundColor Yellow
    $url = "https://download.java.net/java/GA/jdk17.0.2/dfd4a8d0985749f896bed50d7138ee7f/8/GPL/openjdk-17.0.2_windows-x64_bin.zip"
    $output = "openjdk.zip"
    
    Invoke-WebRequest -Uri $url -OutFile $output
    
    Write-Host "Extracting..." -ForegroundColor Yellow
    Expand-Archive -Path $output -DestinationPath "C:\" -Force
    
    Write-Host "Setting environment variables..." -ForegroundColor Yellow
    [Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\jdk-17.0.2", "Machine")
    [Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";C:\jdk-17.0.2\bin", "Machine")
    
    Write-Host "Cleaning up..." -ForegroundColor Yellow
    Remove-Item $output
    
    Write-Host "Java installation completed!" -ForegroundColor Green
}

Write-Host "Please restart your terminal and try running the project again." -ForegroundColor Yellow
Read-Host "Press Enter to continue"





