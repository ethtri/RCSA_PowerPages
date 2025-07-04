# RCSA Power Pages Environment Setup Script (PowerShell)
# This script helps set up the local environment for Power Pages deployment

param(
    [switch]$Help
)

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
    Write-Host "RCSA Power Pages Environment Setup (PowerShell)" -ForegroundColor Cyan
    Write-Host "Usage: .\scripts\setup-environment.ps1" -ForegroundColor White
    Write-Host ""
    Write-Host "This script sets up the local environment for Power Pages deployment." -ForegroundColor White
    Write-Host "It will guide you through authentication and configuration." -ForegroundColor White
}

# Function to check if pac CLI is installed
function Test-PacCli {
    Write-Status "Checking Power Platform CLI installation..."
    
    try {
        $PacVersion = & pac --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Power Platform CLI is installed: $($PacVersion[0])"
            return $true
        } else {
            throw "pac command failed"
        }
    } catch {
        Write-Error "Power Platform CLI is not installed"
        return $false
    }
}

# Function to install pac CLI
function Install-PacCli {
    Write-Status "Installing Power Platform CLI..."
    
    Write-Status "Windows detected. Installation options:"
    Write-Host "1. winget install Microsoft.PowerPlatformCLI" -ForegroundColor Yellow
    Write-Host "2. dotnet tool install --global Microsoft.PowerPlatform.CLI.Tool" -ForegroundColor Yellow
    Write-Host "3. Download from: https://aka.ms/PowerPlatformCLI" -ForegroundColor Yellow
    Write-Host ""
    
    $choice = Read-Host "Choose installation method (1-3, or 'manual' to install manually)"
    
    switch ($choice) {
        "1" {
            if (Get-Command winget -ErrorAction SilentlyContinue) {
                Write-Status "Installing via winget..."
                winget install Microsoft.PowerPlatformCLI
            } else {
                Write-Error "winget not found. Please install manually."
                return $false
            }
        }
        "2" {
            if (Get-Command dotnet -ErrorAction SilentlyContinue) {
                Write-Status "Installing via .NET tool..."
                dotnet tool install --global Microsoft.PowerPlatform.CLI.Tool
            } else {
                Write-Error ".NET not found. Please install manually."
                return $false
            }
        }
        "3" {
            Write-Status "Please download and install from: https://aka.ms/PowerPlatformCLI"
            Read-Host "Press Enter when installation is complete"
        }
        "manual" {
            Write-Status "Please install Power Platform CLI manually and re-run this script"
            return $false
        }
        default {
            Write-Error "Invalid choice. Please install manually."
            return $false
        }
    }
    
    return $true
}

# Function to authenticate with Power Platform
function Initialize-PowerPlatformAuth {
    Write-Status "Setting up Power Platform authentication..."
    
    Write-Host "Please provide your Power Platform environment details:" -ForegroundColor White
    
    # Get environment URL
    $EnvUrl = Read-Host "Enter your Power Platform environment URL (e.g., https://yourenvironment.crm.dynamics.com)"
    
    if (-not $EnvUrl) {
        Write-Error "Environment URL is required"
        return $false
    }
    
    # Authenticate
    Write-Status "Authenticating with Power Platform..."
    try {
        & pac auth create --url $EnvUrl
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Authentication successful"
            return $EnvUrl
        } else {
            throw "Authentication failed"
        }
    } catch {
        Write-Error "Authentication failed: $($_.Exception.Message)"
        return $false
    }
}

# Function to get environment and website IDs
function Get-EnvironmentInfo {
    param($EnvUrl)
    
    Write-Status "Getting environment and website information..."
    
    # List environments
    Write-Status "Available environments:"
    & pac env list
    
    Write-Host ""
    $EnvId = Read-Host "Enter your Environment ID"
    
    if (-not $EnvId) {
        Write-Error "Environment ID is required"
        return $false
    }
    
    # List websites in the environment
    Write-Status "Getting websites for environment $EnvId..."
    & pac paportal list --environment-id $EnvId
    
    Write-Host ""
    $WebsiteId = Read-Host "Enter your Website ID"
    
    if (-not $WebsiteId) {
        Write-Error "Website ID is required"
        return $false
    }
    
    # Create .env file
    Write-Status "Creating .env file..."
    $EnvContent = @"
# Power Pages Environment Configuration
POWERPAGES_ENVIRONMENT_ID=$EnvId
POWERPAGES_WEBSITE_ID=$WebsiteId
POWERPAGES_ENVIRONMENT_URL=$EnvUrl
"@
    
    Set-Content -Path ".env" -Value $EnvContent
    Write-Success ".env file created with environment configuration"
    
    # Create PowerShell version
    Write-Status "Creating .env.ps1 file..."
    $EnvPs1Content = @"
# Power Pages Environment Configuration (PowerShell)
`$env:POWERPAGES_ENVIRONMENT_ID = "$EnvId"
`$env:POWERPAGES_WEBSITE_ID = "$WebsiteId"
`$env:POWERPAGES_ENVIRONMENT_URL = "$EnvUrl"
"@
    
    Set-Content -Path ".env.ps1" -Value $EnvPs1Content
    Write-Success ".env.ps1 file created for PowerShell"
    
    return @{
        EnvironmentId = $EnvId
        WebsiteId = $WebsiteId
        EnvironmentUrl = $EnvUrl
    }
}

# Function to verify setup
function Test-Setup {
    param($Config)
    
    Write-Status "Verifying setup..."
    
    # Load environment variables
    if (Test-Path ".env.ps1") {
        & .\.env.ps1
    }
    
    # Check authentication
    try {
        & pac auth list 2>$null | Out-Null
        if ($LASTEXITCODE -ne 0) {
            throw "Authentication verification failed"
        }
    } catch {
        Write-Error "Authentication verification failed"
        return $false
    }
    
    # Check environment variables
    if (-not $env:POWERPAGES_ENVIRONMENT_ID) {
        Write-Error "POWERPAGES_ENVIRONMENT_ID not set"
        return $false
    }
    
    if (-not $env:POWERPAGES_WEBSITE_ID) {
        Write-Error "POWERPAGES_WEBSITE_ID not set"
        return $false
    }
    
    # Test connection
    Write-Status "Testing connection to Power Pages..."
    try {
        & pac paportal list --environment-id $env:POWERPAGES_ENVIRONMENT_ID 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Connection test successful"
        } else {
            throw "Connection test failed"
        }
    } catch {
        Write-Error "Connection test failed"
        return $false
    }
    
    Write-Success "Setup verification complete"
    return $true
}

# Function to create deployment directories
function New-DeploymentDirectories {
    Write-Status "Creating deployment directories..."
    
    $directories = @("backups", "logs")
    foreach ($dir in $directories) {
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
        }
    }
    
    Write-Success "Directories created"
}

# Function to create PowerShell validation scripts
function New-PowerShellValidationScripts {
    Write-Status "Creating PowerShell validation scripts..."
    
    # Create validate-structure.ps1
    $ValidateStructureContent = @'
# RCSA Power Pages Structure Validation (PowerShell)
Write-Host "🔍 Validating Power Pages directory structure..." -ForegroundColor Blue

# Check if duplicate directory exists
if ((Test-Path "rcsa-copilot---site-5joks") -and -not (Get-Item "rcsa-copilot---site-5joks").LinkType) {
    Write-Host "❌ ERROR: Duplicate directory detected!" -ForegroundColor Red
    Write-Host "   Found: rcsa-copilot---site-5joks\" -ForegroundColor Red
    Write-Host "   Expected: Only powerpages\rcsa-copilot---site-5joks\" -ForegroundColor Red
    Write-Host "" -ForegroundColor Red
    Write-Host "🔧 FIX: Remove duplicate directory:" -ForegroundColor Yellow
    Write-Host "   Remove-Item -Recurse -Force rcsa-copilot---site-5joks\" -ForegroundColor Yellow
    exit 1
}

# Check if powerpages directory exists
if (-not (Test-Path "powerpages\rcsa-copilot---site-5joks")) {
    Write-Host "❌ ERROR: Power Pages directory missing!" -ForegroundColor Red
    Write-Host "   Expected: powerpages\rcsa-copilot---site-5joks\" -ForegroundColor Red
    exit 1
}

# Check for design system files in correct location
if (-not (Test-Path "powerpages\rcsa-copilot---site-5joks\web-files\logicgate-design-system.css")) {
    Write-Host "❌ ERROR: LogicGate design system CSS missing!" -ForegroundColor Red
    Write-Host "   Expected: powerpages\rcsa-copilot---site-5joks\web-files\logicgate-design-system.css" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "powerpages\rcsa-copilot---site-5joks\web-files\logicgate-components.js")) {
    Write-Host "❌ ERROR: LogicGate design system JS missing!" -ForegroundColor Red
    Write-Host "   Expected: powerpages\rcsa-copilot---site-5joks\web-files\logicgate-components.js" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Directory structure validated" -ForegroundColor Green
Write-Host "✅ Design system files present" -ForegroundColor Green
'@
    
    Set-Content -Path "scripts\validate-structure.ps1" -Value $ValidateStructureContent
    
    # Create check-design-paths.ps1
    $CheckDesignPathsContent = @'
# RCSA Power Pages Design System Path Validation (PowerShell)
Write-Host "🔍 Validating LogicGate design system paths..." -ForegroundColor Blue

$DesignSystemFiles = @(
    "powerpages\rcsa-copilot---site-5joks\web-files\logicgate-design-system.css",
    "powerpages\rcsa-copilot---site-5joks\web-files\logicgate-components.js"
)

$AllValid = $true

foreach ($file in $DesignSystemFiles) {
    if (Test-Path $file) {
        Write-Host "✅ Found: $file" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing: $file" -ForegroundColor Red
        $AllValid = $false
    }
}

if ($AllValid) {
    Write-Host "✅ All design system files validated" -ForegroundColor Green
} else {
    Write-Host "❌ Design system validation failed" -ForegroundColor Red
    exit 1
}
'@
    
    Set-Content -Path "scripts\check-design-paths.ps1" -Value $CheckDesignPathsContent
    
    # Create validate-webfiles.ps1
    $ValidateWebfilesContent = @'
# RCSA Power Pages Webfile Validation (PowerShell)
Write-Host "🔍 Validating .webfile.yml configurations..." -ForegroundColor Blue

$WebfileDir = "powerpages\rcsa-copilot---site-5joks\web-files"

if (-not (Test-Path $WebfileDir)) {
    Write-Host "❌ ERROR: Web files directory missing!" -ForegroundColor Red
    exit 1
}

$WebFiles = Get-ChildItem -Path $WebfileDir -Filter "*.webfile.yml" -Recurse

if ($WebFiles.Count -eq 0) {
    Write-Host "⚠️ WARNING: No .webfile.yml files found" -ForegroundColor Yellow
} else {
    Write-Host "✅ Found $($WebFiles.Count) .webfile.yml files" -ForegroundColor Green
    foreach ($file in $WebFiles) {
        Write-Host "  - $($file.Name)" -ForegroundColor Gray
    }
}

Write-Host "✅ Webfile validation complete" -ForegroundColor Green
'@
    
    Set-Content -Path "scripts\validate-webfiles.ps1" -Value $ValidateWebfilesContent
    
    Write-Success "PowerShell validation scripts created"
}

# Main execution
try {
    if ($Help) {
        Show-Help
        exit 0
    }
    
    Write-Host "🔧 RCSA Power Pages Environment Setup" -ForegroundColor Cyan
    Write-Host "=====================================" -ForegroundColor White
    
    # Check if pac CLI is installed
    if (-not (Test-PacCli)) {
        $install = Read-Host "Would you like to install Power Platform CLI? (y/n)"
        if ($install -eq 'y' -or $install -eq 'Y') {
            if (-not (Install-PacCli)) {
                Write-Error "Power Platform CLI installation failed. Please install manually."
                exit 1
            }
        } else {
            Write-Error "Power Platform CLI is required. Please install it manually."
            exit 1
        }
    }
    
    # Check if already authenticated
    $needsAuth = $true
    try {
        & pac auth list 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Already authenticated with Power Platform"
            $addNew = Read-Host "Would you like to add a new authentication? (y/n)"
            if ($addNew -ne 'y' -and $addNew -ne 'Y') {
                $needsAuth = $false
            }
        }
    } catch {
        # Not authenticated, will need to authenticate
    }
    
    $envUrl = $null
    if ($needsAuth) {
        $envUrl = Initialize-PowerPlatformAuth
        if (-not $envUrl) {
            Write-Error "Authentication failed"
            exit 1
        }
    }
    
    # Get environment info if not already configured
    if (-not (Test-Path ".env")) {
        $config = Get-EnvironmentInfo -EnvUrl $envUrl
        if (-not $config) {
            Write-Error "Environment configuration failed"
            exit 1
        }
    } else {
        Write-Success ".env file already exists"
        $reconfigure = Read-Host "Would you like to reconfigure environment settings? (y/n)"
        if ($reconfigure -eq 'y' -or $reconfigure -eq 'Y') {
            $config = Get-EnvironmentInfo -EnvUrl $envUrl
            if (-not $config) {
                Write-Error "Environment configuration failed"
                exit 1
            }
        }
    }
    
    # Create directories
    New-DeploymentDirectories
    
    # Create PowerShell validation scripts
    New-PowerShellValidationScripts
    
    # Verify setup
    if (-not (Test-Setup)) {
        Write-Error "Setup verification failed"
        exit 1
    }
    
    Write-Success "🎉 Environment setup complete!"
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor White
    Write-Host "1. Load your environment variables:" -ForegroundColor Gray
    Write-Host "   .\.env.ps1" -ForegroundColor Yellow
    Write-Host "2. Run deployment:" -ForegroundColor Gray
    Write-Host "   .\scripts\local-deploy.ps1" -ForegroundColor Yellow
    Write-Host "3. Or quick deploy:" -ForegroundColor Gray
    Write-Host "   .\scripts\quick-deploy.ps1" -ForegroundColor Yellow
    Write-Host "4. Check deployment logs in the logs\ directory" -ForegroundColor Gray
    
} catch {
    Write-Error "Setup failed: $($_.Exception.Message)"
    exit 1
} 