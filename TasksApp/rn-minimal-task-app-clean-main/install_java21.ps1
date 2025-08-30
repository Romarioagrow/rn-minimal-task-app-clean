Write-Host "Installing Java 21..." -ForegroundColor Green

# Download and install Java 21
Write-Host "Downloading OpenJDK 21..." -ForegroundColor Yellow
$url = "https://download.java.net/java/GA/jdk21.0.2/13d5b2a4be90462f896e6f96bcf36db2/13/GPL/openjdk-21.0.2_windows-x64_bin.zip"
$output = "openjdk21.zip"

try {
    Invoke-WebRequest -Uri $url -OutFile $output
    
    Write-Host "Extracting Java 21..." -ForegroundColor Yellow
    Expand-Archive -Path $output -DestinationPath "C:\" -Force
    
    Write-Host "Setting Java 21 as default..." -ForegroundColor Yellow
    [Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\jdk-21.0.2", "Machine")
    
    # Update PATH to prioritize Java 21
    $currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
    $java21Path = "C:\jdk-21.0.2\bin"
    
    if ($currentPath -notlike "*$java21Path*") {
        $newPath = "$java21Path;$currentPath"
        [Environment]::SetEnvironmentVariable("PATH", $newPath, "Machine")
    }
    
    Write-Host "Cleaning up..." -ForegroundColor Yellow
    Remove-Item $output -ErrorAction SilentlyContinue
    
    Write-Host "Java 21 installation completed!" -ForegroundColor Green
    Write-Host "JAVA_HOME set to: C:\jdk-21.0.2" -ForegroundColor Cyan
    
} catch {
    Write-Host "Error during installation: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Please restart your terminal for changes to take effect." -ForegroundColor Yellow
Read-Host "Press Enter to continue"


