# RCSA Power Pages Quick Deploy Script (PowerShell)
# For rapid development iterations - skips backup and some validations

param(
    [switch]$SkipValidation,
    [switch]$Help
)

# Configuration
$SITE_NAME = "rcsa-copilot---site-5joks"
$POWERPAGES_DIR = "powerpages\$SITE_NAME"

# Function to print colored output
function Write-Status {
    param($Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param($Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Function to show help
function Show-Help {
    Write-Host "RCSA Power Pages Quick Deploy (PowerShell)" -ForegroundColor Cyan
    Write-Host "Usage: .\scripts\quick-deploy.ps1 [OPTIONS]" -ForegroundColor White
    Write-Host ""
    Write-Host "Options:" -ForegroundColor White
    Write-Host "  -SkipValidation  Skip validation checks" -ForegroundColor Gray
    Write-Host "  -Help           Show this help message" -ForegroundColor Gray
    Write-Host ""
    Write-Host "This script performs a quick deployment without backup or extensive validation." -ForegroundColor Yellow
    Write-Host "Use for rapid development iterations only." -ForegroundColor Yellow
}

# Load environment variables
function Import-Environment {
    if (Test-Path ".env") {
        Get-Content ".env" | ForEach-Object {
            if ($_ -match "^([^#][^=]*)=(.*)$") {
                $name = $matches[1].Trim()
                $value = $matches[2].Trim()
                Set-Item -Path "env:$name" -Value $value
            }
        }
    } else {
        Write-Error ".env file not found. Run .\scripts\setup-environment.ps1 first"
        exit 1
    }
}

# Quick validation
function Invoke-QuickValidation {
    Write-Status "Running quick validation..."
    
    # Check if directory exists
    if (-not (Test-Path $POWERPAGES_DIR)) {
        Write-Error "Power Pages directory not found: $POWERPAGES_DIR"
        exit 1
    }
    
    # Check if key design system files exist
    if (-not (Test-Path "$POWERPAGES_DIR\web-files\logicgate-design-system.css")) {
        Write-Warning "LogicGate design system CSS not found"
    }
    
    if (-not (Test-Path "$POWERPAGES_DIR\web-files\logicgate-components.js")) {
        Write-Warning "LogicGate components JS not found"
    }
    
    Write-Success "Quick validation complete"
}

# Quick deploy function
function Invoke-QuickDeploy {
    Write-Status "🚀 Quick deploying to Power Pages..."
    
    # Change to powerpages directory
    $CurrentDir = Get-Location
    Set-Location $POWERPAGES_DIR
    
    try {
        # Upload with minimal output
        Write-Status "Uploading changes..."
        & pac paportal upload --path . --environment-id $env:POWERPAGES_ENVIRONMENT_ID --website-id $env:POWERPAGES_WEBSITE_ID
        if ($LASTEXITCODE -ne 0) {
            throw "Upload failed"
        }
    } catch {
        Write-Error "Quick deploy failed"
        Set-Location $CurrentDir
        exit 1
    } finally {
        # Return to root directory
        Set-Location $CurrentDir
    }
    
    Write-Success "✅ Quick deploy completed!"
}

# Log deployment
function Write-DeploymentLog {
    $LogFile = "logs\quick-deploy.log"
    if (-not (Test-Path "logs")) {
        New-Item -ItemType Directory -Path "logs" -Force | Out-Null
    }
    Add-Content -Path $LogFile -Value "$(Get-Date): Quick deploy completed"
}

# Main execution
try {
    if ($Help) {
        Show-Help
        exit 0
    }
    
    Write-Host "⚡ RCSA Power Pages Quick Deploy" -ForegroundColor Cyan
    Write-Host "===============================" -ForegroundColor White
    
    # Load environment variables
    Import-Environment
    
    # Check prerequisites
    if (-not $env:POWERPAGES_ENVIRONMENT_ID -or -not $env:POWERPAGES_WEBSITE_ID) {
        Write-Error "Environment variables not set. Run .\scripts\setup-environment.ps1 first"
        exit 1
    }
    
    # Run quick validation unless skipped
    if (-not $SkipValidation) {
        Invoke-QuickValidation
    }
    
    # Deploy
    Invoke-QuickDeploy
    
    # Log
    Write-DeploymentLog
    
    Write-Success "🎉 Quick deployment complete!"
    Write-Warning "⚠️  Remember to run full deployment before production releases"
    
} catch {
    Write-Error "Quick deploy failed: $($_.Exception.Message)"
    exit 1
} 