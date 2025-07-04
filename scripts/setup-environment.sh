#!/bin/bash
set -e

# RCSA Power Pages Environment Setup Script
# This script helps set up the local environment for Power Pages deployment

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if pac CLI is installed
check_pac_cli() {
    print_status "Checking Power Platform CLI installation..."
    
    if command -v pac &> /dev/null; then
        PAC_VERSION=$(pac --version 2>/dev/null | head -1 || echo "Unknown")
        print_success "Power Platform CLI is installed: $PAC_VERSION"
        return 0
    else
        print_error "Power Platform CLI is not installed"
        return 1
    fi
}

# Function to install pac CLI
install_pac_cli() {
    print_status "Installing Power Platform CLI..."
    
    # Check OS
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        print_status "Windows detected. Please install manually:"
        echo "1. Download from: https://aka.ms/PowerPlatformCLI"
        echo "2. Or use: winget install Microsoft.PowerPlatformCLI"
        echo "3. Or use: dotnet tool install --global Microsoft.PowerPlatform.CLI.Tool"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        print_status "macOS detected. Installing via brew..."
        if command -v brew &> /dev/null; then
            brew tap microsoft/powerplatform-cli https://github.com/Microsoft/powerplatform-cli
            brew install pac
        else
            print_error "Homebrew not found. Please install manually:"
            echo "Download from: https://aka.ms/PowerPlatformCLI"
        fi
    else
        print_status "Linux detected. Installing via .NET tool..."
        if command -v dotnet &> /dev/null; then
            dotnet tool install --global Microsoft.PowerPlatform.CLI.Tool
        else
            print_error ".NET not found. Please install manually:"
            echo "Download from: https://aka.ms/PowerPlatformCLI"
        fi
    fi
}

# Function to authenticate with Power Platform
authenticate_powerplatform() {
    print_status "Setting up Power Platform authentication..."
    
    echo "Please provide your Power Platform environment details:"
    
    # Get environment URL
    read -p "Enter your Power Platform environment URL (e.g., https://yourenvironment.crm.dynamics.com): " ENV_URL
    
    if [ -z "$ENV_URL" ]; then
        print_error "Environment URL is required"
        return 1
    fi
    
    # Authenticate
    print_status "Authenticating with Power Platform..."
    pac auth create --url "$ENV_URL"
    
    if [ $? -eq 0 ]; then
        print_success "Authentication successful"
    else
        print_error "Authentication failed"
        return 1
    fi
}

# Function to get environment and website IDs
get_environment_info() {
    print_status "Getting environment and website information..."
    
    # List environments
    print_status "Available environments:"
    pac env list
    
    echo ""
    read -p "Enter your Environment ID: " ENV_ID
    
    if [ -z "$ENV_ID" ]; then
        print_error "Environment ID is required"
        return 1
    fi
    
    # List websites in the environment
    print_status "Getting websites for environment $ENV_ID..."
    pac paportal list --environment-id "$ENV_ID"
    
    echo ""
    read -p "Enter your Website ID: " WEBSITE_ID
    
    if [ -z "$WEBSITE_ID" ]; then
        print_error "Website ID is required"
        return 1
    fi
    
    # Create .env file
    print_status "Creating .env file..."
    cat > .env << EOF
# Power Pages Environment Configuration
POWERPAGES_ENVIRONMENT_ID=$ENV_ID
POWERPAGES_WEBSITE_ID=$WEBSITE_ID
POWERPAGES_ENVIRONMENT_URL=$ENV_URL
EOF
    
    print_success ".env file created with environment configuration"
    
    # Create PowerShell version for Windows
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        cat > .env.ps1 << EOF
# Power Pages Environment Configuration (PowerShell)
\$env:POWERPAGES_ENVIRONMENT_ID = "$ENV_ID"
\$env:POWERPAGES_WEBSITE_ID = "$WEBSITE_ID"
\$env:POWERPAGES_ENVIRONMENT_URL = "$ENV_URL"
EOF
        print_success ".env.ps1 file created for PowerShell"
    fi
}

# Function to verify setup
verify_setup() {
    print_status "Verifying setup..."
    
    # Source environment variables
    if [ -f .env ]; then
        source .env
    fi
    
    # Check authentication
    if ! pac auth list &> /dev/null; then
        print_error "Authentication verification failed"
        return 1
    fi
    
    # Check environment variables
    if [ -z "$POWERPAGES_ENVIRONMENT_ID" ]; then
        print_error "POWERPAGES_ENVIRONMENT_ID not set"
        return 1
    fi
    
    if [ -z "$POWERPAGES_WEBSITE_ID" ]; then
        print_error "POWERPAGES_WEBSITE_ID not set"
        return 1
    fi
    
    # Test connection
    print_status "Testing connection to Power Pages..."
    pac paportal list --environment-id "$POWERPAGES_ENVIRONMENT_ID" > /dev/null
    
    if [ $? -eq 0 ]; then
        print_success "Connection test successful"
    else
        print_error "Connection test failed"
        return 1
    fi
    
    print_success "Setup verification complete"
}

# Function to create deployment directories
create_directories() {
    print_status "Creating deployment directories..."
    
    mkdir -p backups
    mkdir -p logs
    
    print_success "Directories created"
}

# Main setup function
main() {
    echo "🔧 RCSA Power Pages Environment Setup"
    echo "====================================="
    
    # Check if pac CLI is installed
    if ! check_pac_cli; then
        read -p "Would you like to install Power Platform CLI? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            install_pac_cli
        else
            print_error "Power Platform CLI is required. Please install it manually."
            exit 1
        fi
    fi
    
    # Check if already authenticated
    if pac auth list &> /dev/null; then
        print_success "Already authenticated with Power Platform"
        read -p "Would you like to add a new authentication? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            authenticate_powerplatform
        fi
    else
        authenticate_powerplatform
    fi
    
    # Get environment info if not already configured
    if [ ! -f .env ]; then
        get_environment_info
    else
        print_success ".env file already exists"
        read -p "Would you like to reconfigure environment settings? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            get_environment_info
        fi
    fi
    
    # Create directories
    create_directories
    
    # Verify setup
    verify_setup
    
    print_success "🎉 Environment setup complete!"
    echo ""
    echo "Next steps:"
    echo "1. Source your environment variables:"
    echo "   - Bash/Zsh: source .env"
    echo "   - PowerShell: .\.env.ps1"
    echo "2. Run deployment: ./scripts/local-deploy.sh"
    echo "3. Check deployment logs in the logs/ directory"
}

# Run main function
main "$@" 