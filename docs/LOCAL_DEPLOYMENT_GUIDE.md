# RCSA Power Pages V2 - Local Deployment Guide

## Overview

This guide provides a comprehensive strategy for local CLI-based deployment of the RCSA Power Pages V2 platform. This approach ensures deployment hygiene, efficiency, and reliability when automated CI/CD is not available.

## Prerequisites

### 1. Power Platform CLI Installation

The deployment process requires the Microsoft Power Platform CLI (`pac`).

**Installation Options:**

- **Windows:** 
  ```powershell
  winget install Microsoft.PowerPlatformCLI
  # OR
  dotnet tool install --global Microsoft.PowerPlatform.CLI.Tool
  ```

- **macOS:**
  ```bash
  brew tap microsoft/powerplatform-cli https://github.com/Microsoft/powerplatform-cli
  brew install pac
  ```

- **Linux:**
  ```bash
  dotnet tool install --global Microsoft.PowerPlatform.CLI.Tool
  ```

### 2. Environment Setup

Run the automated setup script:

**For Windows (PowerShell):**
```powershell
# Run environment setup
.\scripts\setup-environment.ps1
# OR
npm run setup:ps
```

**For Linux/macOS (Bash):**
```bash
# Make scripts executable
chmod +x scripts/*.sh

# Run environment setup
./scripts/setup-environment.sh
# OR
npm run setup
```

This script will:
- Verify Power Platform CLI installation
- Authenticate with your Power Platform environment
- Configure environment variables
- Create necessary directories
- Verify connection to your Power Pages site

## Power Platform CLI Best Practices

### ⚠️ Critical CLI Requirements

**Enhanced Data Model Version:**
Power Pages environments using enhanced data model (v2) require the `--modelVersion 2` parameter:

```powershell
# ✅ CORRECT - Enhanced data model upload
pac paportal upload --path "powerpages/rcsa-copilot---site-5joks" --modelVersion 2

# ❌ INCORRECT - Will fail with "Power Pages entities for standard data model (v1) aren't available"
pac paportal upload --path "powerpages/rcsa-copilot---site-5joks"
```

**Common CLI Parameter Mistakes:**
- `--model-version` ❌ (Wrong parameter name)
- `--modelVersion` ✅ (Correct parameter name)
- Missing version parameter ❌ (Will fail on enhanced data model environments)

### 1. Development Upload (Recommended)

For development iterations and testing:

```powershell
# Upload to Power Pages environment with enhanced data model
pac paportal upload --path "powerpages/rcsa-copilot---site-5joks" --modelVersion 2
```

**When to use:**
- Testing individual page changes
- Debugging functionality
- Iterative development
- Quick fixes

### 2. Full Production Deployment

For production releases and major updates:

**Windows (PowerShell):**
```powershell
# Full deployment with backup and validation
.\scripts\local-deploy.ps1
# OR
npm run deploy:ps
```

**Linux/macOS (Bash):**
```bash
# Full deployment with backup and validation
./scripts/local-deploy.sh
# OR
npm run deploy
```

**Features:**
- ✅ Pre-deployment validation
- ✅ Automatic backup creation
- ✅ Comprehensive error handling
- ✅ Deployment verification
- ✅ Detailed logging

### 3. Quick Development Deployment

For rapid development iterations:

**Windows (PowerShell):**
```powershell
# Quick deployment without backup
.\scripts\quick-deploy.ps1
# OR
npm run deploy:quick:ps
```

**Linux/macOS (Bash):**
```bash
# Quick deployment without backup
./scripts/quick-deploy.sh
# OR
npm run deploy:quick
```

**Features:**
- ⚡ Fast deployment (no backup)
- ✅ Basic validation
- ✅ Error handling
- ⚠️ Use for development only

## Deployment Hygiene Best Practices

### 1. Pre-Deployment Validation

Always validate your changes before deployment:

**Windows (PowerShell):**
```powershell
# Run all validations
npm run validate:ps

# Or run specific validations
npm run validate:structure:ps  # Directory structure
npm run validate:paths:ps     # Design system paths
npm run validate:webfiles:ps  # Web file configurations
```

**Linux/macOS (Bash):**
```bash
# Run all validations
npm run validate

# Or run specific validations
npm run validate:structure  # Directory structure
npm run validate:paths     # Design system paths
npm run validate:webfiles  # Web file configurations
```

### 2. Environment Configuration

Ensure your environment is properly configured:

```bash
# Check environment variables
echo $POWERPAGES_ENVIRONMENT_ID
echo $POWERPAGES_WEBSITE_ID

# Verify authentication
pac auth list

# Test connection
pac paportal list --environment-id $POWERPAGES_ENVIRONMENT_ID
```

### 3. Backup Strategy

**Automatic Backups:**
- Full deployments automatically create timestamped backups
- Backups are stored in `backups/YYYYMMDD_HHMMSS/`
- Each backup contains complete site content

**Manual Backup:**
```bash
# Create manual backup
BACKUP_DIR="backups/manual_$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR
pac paportal download --path $BACKUP_DIR --environment-id $POWERPAGES_ENVIRONMENT_ID --website-id $POWERPAGES_WEBSITE_ID
```

### 4. Change Management

**Before Making Changes:**
1. Create a backup

## Common CLI Errors and Solutions

### Error: "Power Pages entities for standard data model (v1) aren't available"

**Problem:** Trying to upload to an enhanced data model environment without specifying the model version.

**Solution:**
```powershell
# Add --modelVersion 2 parameter
pac paportal upload --path "powerpages/rcsa-copilot---site-5joks" --modelVersion 2
```

### Error: "An unknown argument --model-version was passed"

**Problem:** Using incorrect parameter name with hyphens instead of camelCase.

**Solution:**
```powershell
# Use camelCase parameter name
pac paportal upload --path "powerpages/rcsa-copilot---site-5joks" --modelVersion 2

# NOT: --model-version (with hyphens)
```

### Error: Authentication Issues

**Problem:** CLI not authenticated or authentication expired.

**Solution:**
```powershell
# Check current authentication
pac auth list

# Authenticate if needed
pac auth create --url https://org601a79e1.crm.dynamics.com/

# Select the correct auth profile
pac auth select --index 0
```

### Error: Upload Timeouts or Failures

**Problem:** Large uploads failing or timing out.

**Solution:**
```powershell
# Use force upload for all files
pac paportal upload --path "powerpages/rcsa-copilot---site-5joks" --modelVersion 2 --forceUploadAll

# Or try uploading specific components
pac paportal upload --path "powerpages/rcsa-copilot---site-5joks/web-pages" --modelVersion 2
```

### Best Practices Summary

1. **Always use `--modelVersion 2`** for enhanced data model environments
2. **Use camelCase parameter names** (--modelVersion, not --model-version)
3. **Verify authentication** before uploading (`pac auth list`)
4. **Test with single pages** before full site uploads
5. **Use force upload** (`--forceUploadAll`) for troubleshooting
6. **Check environment connectivity** before deployment

### 5. Change Management

**Before Making Changes:**
1. Create a backup
2. Document the changes
3. Test locally if possible
4. Validate file structure

**After Making Changes:**
1. Run validation scripts
2. Deploy using appropriate strategy
3. Verify deployment
4. Test functionality
5. Document deployment in logs

## Troubleshooting

### Common Issues

**1. Authentication Errors**
```bash
# Re-authenticate
pac auth create --url https://yourenvironment.crm.dynamics.com

# List current authentications
pac auth list

# Clear and re-authenticate
pac auth clear
pac auth create --url https://yourenvironment.crm.dynamics.com
```

**2. Environment Variable Issues**
```bash
# Recreate environment configuration
rm .env
./scripts/setup-environment.sh
```

**3. Upload Failures**
```bash
# Check file permissions
ls -la powerpages/rcsa-copilot---site-5joks/

# Verify directory structure
npm run validate:structure

# Check for large files or invalid characters
find powerpages/ -name "*.tmp" -o -name ".*" | grep -v ".webfile.yml"
```

**4. Design System Path Issues**
```bash
# Validate design system files
npm run validate:paths

# Check file existence
ls -la powerpages/rcsa-copilot---site-5joks/web-files/logicgate-*
```

### Error Recovery

**If Deployment Fails:**
1. Check error logs in `logs/` directory
2. Verify environment variables
3. Run validation scripts
4. Check authentication status
5. Restore from backup if needed

**Rollback Process:**
```bash
# List available backups
ls -la backups/

# Restore from backup
BACKUP_DIR="backups/20240101_120000"  # Replace with actual backup
cd $BACKUP_DIR
pac paportal upload --path . --environment-id $POWERPAGES_ENVIRONMENT_ID --website-id $POWERPAGES_WEBSITE_ID
```

## Development Workflow

### 1. Daily Development Cycle

```bash
# Start of day - verify environment
pac auth list
npm run validate

# Make changes to files...

# Quick deploy for testing
npm run deploy:quick

# Test changes in Power Pages

# Repeat as needed...

# End of day - full deployment
npm run deploy
```

### 2. Feature Development

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes...

# Validate changes
npm run validate

# Test with quick deploy
npm run deploy:quick

# Once satisfied, full deploy
npm run deploy

# Commit and merge
git add .
git commit -m "feat: implement new feature"
git push origin feature/new-feature
```

### 3. Release Process

```bash
# Ensure clean state
git status
npm run validate

# Create release backup
./scripts/local-deploy.sh  # Creates automatic backup

# Deploy to production
npm run deploy

# Verify deployment
# Test all critical functionality

# Tag release
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

## Monitoring and Logging

### Deployment Logs

All deployments are logged:
- Full deployments: `logs/deployment.log`
- Quick deployments: `logs/quick-deploy.log`

```bash
# View recent deployments
npm run logs

# View all deployment history
cat logs/quick-deploy.log
```

### Health Checks

Regular health checks ensure deployment integrity:

```bash
# Validate current state
npm run validate

# Test page functionality
npm run test

# Check for broken links or missing files
# (Manual verification recommended)
```

## Security Considerations

### 1. Environment Variables

- Store sensitive information in `.env` file
- Never commit `.env` to version control
- Use different configurations for different environments

### 2. Authentication

- Use service principal authentication for automated processes
- Regularly rotate authentication tokens
- Limit permissions to minimum required

### 3. Backup Security

- Encrypt backups if they contain sensitive data
- Store backups in secure location
- Implement backup retention policy

## Performance Optimization

### 1. Deployment Speed

- Use quick deploy for development iterations
- Skip validation for trusted changes (use sparingly)
- Optimize file sizes before deployment

### 2. File Management

- Remove unused files regularly
- Compress large assets
- Use appropriate file formats

## Directory Structure

```
RCSA_PowerPages_V2/
├── powerpages/
│   └── rcsa-copilot---site-5joks/    # Main deployment directory
├── scripts/
│   ├── local-deploy.sh               # Full deployment script
│   ├── quick-deploy.sh               # Quick deployment script
│   ├── setup-environment.sh          # Environment setup
│   └── validate-*.sh                 # Validation scripts
├── backups/                          # Automatic backups
├── logs/                             # Deployment logs
├── .env                              # Environment variables
└── package.json                      # NPM scripts
```

## Support and Maintenance

### Regular Maintenance Tasks

**Weekly:**
- Review deployment logs
- Clean up old backups
- Update documentation

**Monthly:**
- Update Power Platform CLI
- Review and optimize scripts
- Audit authentication tokens

**Quarterly:**
- Full system validation
- Performance review
- Security audit

### Getting Help

1. Check this documentation
2. Review error logs
3. Validate environment setup
4. Check Power Platform CLI documentation
5. Contact team lead for complex issues

## Best Practices Summary

✅ **DO:**
- Always validate before deployment
- Use appropriate deployment strategy
- Create backups before major changes
- Document changes and deployments
- Test after deployment
- Monitor logs regularly

❌ **DON'T:**
- Skip validation for production deployments
- Deploy without authentication verification
- Ignore error messages
- Deploy large files without optimization
- Forget to verify deployment success
- Commit sensitive environment variables

---

*This guide is maintained by the RCSA development team. Last updated: $(date)* 