#!/bin/bash
set -e

# RCSA Power Pages Local Deployment Script
# This script automates the local CLI deployment process for Power Pages

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SITE_NAME="rcsa-copilot---site-5joks"
POWERPAGES_DIR="powerpages/$SITE_NAME"
ENVIRONMENT_ID="${POWERPAGES_ENVIRONMENT_ID}"
WEBSITE_ID="${POWERPAGES_WEBSITE_ID}"

# Function to print colored output
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

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if pac CLI is installed
    if ! command -v pac &> /dev/null; then
        print_error "Power Platform CLI (pac) is not installed or not in PATH"
        print_error "Install from: https://docs.microsoft.com/en-us/power-platform/developer/cli/introduction"
        exit 1
    fi
    
    # Check if authenticated
    if ! pac auth list &> /dev/null; then
        print_error "Not authenticated with Power Platform CLI"
        print_error "Run: pac auth create --url https://yourenvironment.crm.dynamics.com"
        exit 1
    fi
    
    # Check environment variables
    if [ -z "$ENVIRONMENT_ID" ]; then
        print_error "POWERPAGES_ENVIRONMENT_ID environment variable not set"
        exit 1
    fi
    
    if [ -z "$WEBSITE_ID" ]; then
        print_error "POWERPAGES_WEBSITE_ID environment variable not set"
        exit 1
    fi
    
    print_success "Prerequisites validated"
}

# Function to run pre-deployment validation
run_validation() {
    print_status "Running pre-deployment validation..."
    
    # Run structure validation
    if ! ./scripts/validate-structure.sh; then
        print_error "Structure validation failed"
        exit 1
    fi
    
    # Run design system path validation
    if ! ./scripts/check-design-paths.sh; then
        print_error "Design system path validation failed"
        exit 1
    fi
    
    # Run webfile validation
    if ! ./scripts/validate-webfiles.sh; then
        print_error "Webfile validation failed"
        exit 1
    fi
    
    print_success "All validations passed"
}

# Function to create backup
create_backup() {
    print_status "Creating backup..."
    
    BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # Download current site content
    print_status "Downloading current site content for backup..."
    pac paportal download --path "$BACKUP_DIR" --environment-id "$ENVIRONMENT_ID" --website-id "$WEBSITE_ID"
    
    print_success "Backup created at: $BACKUP_DIR"
}

# Function to deploy to Power Pages
deploy_to_powerpages() {
    print_status "Deploying to Power Pages..."
    
    # Change to powerpages directory
    cd "$POWERPAGES_DIR"
    
    # Upload the site
    print_status "Uploading site content..."
    pac paportal upload --path . --environment-id "$ENVIRONMENT_ID" --website-id "$WEBSITE_ID"
    
    # Return to root directory
    cd ../..
    
    print_success "Upload completed successfully"
}

# Function to verify deployment
verify_deployment() {
    print_status "Verifying deployment..."
    
    # Wait a moment for deployment to propagate
    sleep 5
    
    # Check if key files are accessible (this would need to be customized based on your site)
    print_status "Deployment verification complete"
    print_warning "Manual verification recommended: Check your Power Pages site in browser"
}

# Function to show deployment summary
show_summary() {
    print_success "🚀 Deployment Summary"
    echo "=========================="
    echo "Site: $SITE_NAME"
    echo "Environment: $ENVIRONMENT_ID"
    echo "Website: $WEBSITE_ID"
    echo "Deployed at: $(date)"
    echo "=========================="
    print_success "Deployment completed successfully!"
}

# Main deployment function
main() {
    echo "🚀 RCSA Power Pages Local Deployment"
    echo "====================================="
    
    # Parse command line arguments
    SKIP_BACKUP=false
    SKIP_VALIDATION=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-backup)
                SKIP_BACKUP=true
                shift
                ;;
            --skip-validation)
                SKIP_VALIDATION=true
                shift
                ;;
            --help)
                echo "Usage: $0 [OPTIONS]"
                echo "Options:"
                echo "  --skip-backup      Skip creating backup before deployment"
                echo "  --skip-validation  Skip pre-deployment validation"
                echo "  --help            Show this help message"
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    # Run deployment steps
    check_prerequisites
    
    if [ "$SKIP_VALIDATION" = false ]; then
        run_validation
    fi
    
    if [ "$SKIP_BACKUP" = false ]; then
        create_backup
    fi
    
    deploy_to_powerpages
    verify_deployment
    show_summary
}

# Error handling
trap 'print_error "Deployment failed at line $LINENO. Exit code: $?"' ERR

# Run main function
main "$@" 