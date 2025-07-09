# RCSA Power Pages Local Deployment Script (PowerShell)
# This script automates the local CLI deployment process for Power Pages

param(
    [switch]$SkipBackup,
    [switch]$SkipValidation,
    [switch]$Help
)

# Configuration
$SITE_NAME = "rcsa-copilot---site-5joks"
$POWERPAGES_DIR = "powerpages\$SITE_NAME"
$ENVIRONMENT_ID = $env:POWERPAGES_ENVIRONMENT_ID
$WEBSITE_ID = $env:POWERPAGES_WEBSITE_ID

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
    Write-Host "RCSA Power Pages Local Deployment (PowerShell)" -ForegroundColor Cyan
    Write-Host "Usage: .\scripts\local-deploy.ps1 [OPTIONS]" -ForegroundColor White
    Write-Host ""
    Write-Host "Options:" -ForegroundColor White
    Write-Host "  -SkipBackup      Skip creating backup before deployment" -ForegroundColor Gray
    Write-Host "  -SkipValidation  Skip pre-deployment validation" -ForegroundColor Gray
    Write-Host "  -Help           Show this help message" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor White
    Write-Host "  .\scripts\local-deploy.ps1                    # Full deployment" -ForegroundColor Gray
    Write-Host "  .\scripts\local-deploy.ps1 -SkipBackup        # Deploy without backup" -ForegroundColor Gray
    Write-Host "  .\scripts\local-deploy.ps1 -SkipValidation    # Deploy without validation" -ForegroundColor Gray
}

# Function to check prerequisites
function Test-Prerequisites {
    Write-Status "Checking prerequisites..."
    
    # Check if pac CLI is installed
    try {
        $pacVersion = & pac --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Power Platform CLI is installed: $($pacVersion[0])"
        } else {
            throw "pac command failed"
        }
    } catch {
        Write-Error "Power Platform CLI (pac) is not installed or not in PATH"
        Write-Error "Install from: https://docs.microsoft.com/en-us/power-platform/developer/cli/introduction"
        exit 1
    }
    
    # Check if authenticated
    try {
        & pac auth list 2>$null | Out-Null
        if ($LASTEXITCODE -ne 0) {
            throw "Not authenticated"
        }
    } catch {
        Write-Error "Not authenticated with Power Platform CLI"
        Write-Error "Run: pac auth create --url https://yourenvironment.crm.dynamics.com"
        exit 1
    }
    
    # Check environment variables
    if (-not $ENVIRONMENT_ID) {
        Write-Error "POWERPAGES_ENVIRONMENT_ID environment variable not set"
        exit 1
    }
    
    if (-not $WEBSITE_ID) {
        Write-Error "POWERPAGES_WEBSITE_ID environment variable not set"
        exit 1
    }
    
    Write-Success "Prerequisites validated"
}

# Function to run pre-deployment validation
function Invoke-Validation {
    Write-Status "Running pre-deployment validation..."
    
    # Run structure validation
    try {
        & powershell -ExecutionPolicy Bypass -File "scripts\validate-structure.ps1"
        if ($LASTEXITCODE -ne 0) {
            throw "Structure validation failed"
        }
    } catch {
        Write-Error "Structure validation failed"
        exit 1
    }
    
    # Run design system path validation
    try {
        & powershell -ExecutionPolicy Bypass -File "scripts\check-design-paths.ps1"
        if ($LASTEXITCODE -ne 0) {
            throw "Design system path validation failed"
        }
    } catch {
        Write-Error "Design system path validation failed"
        exit 1
    }
    
    # Run webfile validation
    try {
        & powershell -ExecutionPolicy Bypass -File "scripts\validate-webfiles.ps1"
        if ($LASTEXITCODE -ne 0) {
            throw "Webfile validation failed"
        }
    } catch {
        Write-Error "Webfile validation failed"
        exit 1
    }
    
    Write-Success "All validations passed"
}

# Function to create backup
function New-Backup {
    Write-Status "Creating backup..."
    
    $BackupDir = "backups\$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
    
    # Download current site content
    Write-Status "Downloading current site content for backup..."
    try {
        & pac paportal download --path $BackupDir --environment-id $ENVIRONMENT_ID --website-id $WEBSITE_ID
        if ($LASTEXITCODE -ne 0) {
            throw "Backup download failed"
        }
    } catch {
        Write-Error "Failed to create backup"
        exit 1
    }
    
    Write-Success "Backup created at: $BackupDir"
}

# Function to deploy to Power Pages
function Deploy-ToPowerPages {
    Write-Status "Deploying to Power Pages..."
    
    # Change to powerpages directory
    $CurrentDir = Get-Location
    Set-Location $POWERPAGES_DIR
    
    try {
        # Upload the site
        Write-Status "Uploading site content..."
        & pac paportal upload --path . --environment-id $ENVIRONMENT_ID --website-id $WEBSITE_ID
        if ($LASTEXITCODE -ne 0) {
            throw "Upload failed"
        }
    } catch {
        Write-Error "Deployment failed"
        Set-Location $CurrentDir
        exit 1
    } finally {
        # Return to root directory
        Set-Location $CurrentDir
    }
    
    Write-Success "Upload completed successfully"
}

# Function to verify deployment
function Test-Deployment {
    Write-Status "Verifying deployment..."
    
    # Wait a moment for deployment to propagate
    Start-Sleep -Seconds 5
    
    # Check if key files are accessible (this would need to be customized based on your site)
    Write-Status "Deployment verification complete"
    Write-Warning "Manual verification recommended: Check your Power Pages site in browser"
}

# Function to show deployment summary
function Show-Summary {
    Write-Success "🚀 Deployment Summary"
    Write-Host "==========================" -ForegroundColor White
    Write-Host "Site: $SITE_NAME" -ForegroundColor White
    Write-Host "Environment: $ENVIRONMENT_ID" -ForegroundColor White
    Write-Host "Website: $WEBSITE_ID" -ForegroundColor White
    Write-Host "Deployed at: $(Get-Date)" -ForegroundColor White
    Write-Host "==========================" -ForegroundColor White
    Write-Success "Deployment completed successfully!"
}

# Main execution
try {
    if ($Help) {
        Show-Help
        exit 0
    }
    
    Write-Host "🚀 RCSA Power Pages Local Deployment" -ForegroundColor Cyan
    Write-Host "=====================================" -ForegroundColor White
    
    # Run deployment steps
    Test-Prerequisites
    
    if (-not $SkipValidation) {
        Invoke-Validation
    }
    
    if (-not $SkipBackup) {
        New-Backup
    }
    
    Deploy-ToPowerPages
    Test-Deployment
    Show-Summary
    
} catch {
    Write-Error "Deployment failed: $($_.Exception.Message)"
    exit 1
} 