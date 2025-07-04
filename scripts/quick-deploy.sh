#!/bin/bash
set -e

# RCSA Power Pages Quick Deploy Script
# For rapid development iterations - skips backup and some validations

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

# Configuration
SITE_NAME="rcsa-copilot---site-5joks"
POWERPAGES_DIR="powerpages/$SITE_NAME"

# Source environment variables
if [ -f .env ]; then
    source .env
else
    print_error ".env file not found. Run ./scripts/setup-environment.sh first"
    exit 1
fi

# Quick validation
quick_validation() {
    print_status "Running quick validation..."
    
    # Check if directory exists
    if [ ! -d "$POWERPAGES_DIR" ]; then
        print_error "Power Pages directory not found: $POWERPAGES_DIR"
        exit 1
    fi
    
    # Check if key design system files exist
    if [ ! -f "$POWERPAGES_DIR/web-files/logicgate-design-system.css" ]; then
        print_warning "LogicGate design system CSS not found"
    fi
    
    if [ ! -f "$POWERPAGES_DIR/web-files/logicgate-components.js" ]; then
        print_warning "LogicGate components JS not found"
    fi
    
    print_success "Quick validation complete"
}

# Quick deploy function
quick_deploy() {
    print_status "🚀 Quick deploying to Power Pages..."
    
    # Change to powerpages directory
    cd "$POWERPAGES_DIR"
    
    # Upload with minimal output
    print_status "Uploading changes..."
    pac paportal upload --path . --environment-id "$POWERPAGES_ENVIRONMENT_ID" --website-id "$POWERPAGES_WEBSITE_ID"
    
    # Return to root directory
    cd ../..
    
    print_success "✅ Quick deploy completed!"
}

# Log deployment
log_deployment() {
    LOG_FILE="logs/quick-deploy.log"
    mkdir -p logs
    echo "$(date): Quick deploy completed" >> "$LOG_FILE"
}

# Main function
main() {
    echo "⚡ RCSA Power Pages Quick Deploy"
    echo "==============================="
    
    # Parse arguments
    SKIP_VALIDATION=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-validation)
                SKIP_VALIDATION=true
                shift
                ;;
            --help)
                echo "Usage: $0 [OPTIONS]"
                echo "Options:"
                echo "  --skip-validation  Skip validation checks"
                echo "  --help            Show this help message"
                echo ""
                echo "This script performs a quick deployment without backup or extensive validation."
                echo "Use for rapid development iterations only."
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    # Check prerequisites
    if [ -z "$POWERPAGES_ENVIRONMENT_ID" ] || [ -z "$POWERPAGES_WEBSITE_ID" ]; then
        print_error "Environment variables not set. Run ./scripts/setup-environment.sh first"
        exit 1
    fi
    
    # Run quick validation unless skipped
    if [ "$SKIP_VALIDATION" = false ]; then
        quick_validation
    fi
    
    # Deploy
    quick_deploy
    
    # Log
    log_deployment
    
    print_success "🎉 Quick deployment complete!"
    print_warning "⚠️  Remember to run full deployment before production releases"
}

# Error handling
trap 'print_error "Quick deploy failed at line $LINENO"' ERR

# Run main function
main "$@" 