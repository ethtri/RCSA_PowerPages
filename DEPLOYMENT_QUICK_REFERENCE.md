# RCSA Power Pages V2 - Deployment Quick Reference

## 🚀 Quick Commands

### Initial Setup
```powershell
# Windows PowerShell
npm run setup:ps
.\.env.ps1
```

```bash
# Linux/macOS Bash
npm run setup
source .env
```

### Deployment Commands

| Purpose | Windows (PowerShell) | Linux/macOS (Bash) |
|---------|---------------------|---------------------|
| **Full Deploy** | `npm run deploy:ps` | `npm run deploy` |
| **Quick Deploy** | `npm run deploy:quick:ps` | `npm run deploy:quick` |
| **Skip Backup** | `npm run deploy:skip-backup:ps` | `npm run deploy:skip-backup` |

### Validation Commands

| Check | Windows (PowerShell) | Linux/macOS (Bash) |
|-------|---------------------|---------------------|
| **All Validations** | `npm run validate:ps` | `npm run validate` |
| **Structure** | `npm run validate:structure:ps` | `npm run validate:structure` |
| **Design Paths** | `npm run validate:paths:ps` | `npm run validate:paths` |
| **Web Files** | `npm run validate:webfiles:ps` | `npm run validate:webfiles` |

### Monitoring

| Action | Windows (PowerShell) | Linux/macOS (Bash) |
|--------|---------------------|---------------------|
| **View Logs** | `npm run logs:ps` | `npm run logs` |
| **Test Pages** | `npm test` | `npm test` |

## 📋 Daily Workflow

### Development Cycle
1. **Load Environment**: `.\.env.ps1` (Windows) or `source .env` (Linux/macOS)
2. **Make Changes**: Edit files in `powerpages/rcsa-copilot---site-5joks/`
3. **Validate**: `npm run validate:ps` (Windows) or `npm run validate` (Linux/macOS)
4. **Quick Deploy**: `npm run deploy:quick:ps` (Windows) or `npm run deploy:quick` (Linux/macOS)
5. **Test**: Verify changes in Power Pages
6. **Full Deploy**: `npm run deploy:ps` (Windows) or `npm run deploy` (Linux/macOS)

### Before Production
1. **Full Validation**: Run all validation scripts
2. **Create Backup**: Use full deployment (automatic backup)
3. **Test Thoroughly**: Verify all functionality
4. **Document Changes**: Update logs and documentation

## 🛠️ Troubleshooting

### Authentication Issues
```powershell
# Check authentication
pac auth list

# Re-authenticate
pac auth create --url https://yourenvironment.crm.dynamics.com
```

### Environment Issues
```powershell
# Windows - Reload environment
.\.env.ps1

# Linux/macOS - Reload environment
source .env
```

### Validation Failures
```powershell
# Windows - Check specific issues
npm run validate:structure:ps
npm run validate:paths:ps
npm run validate:webfiles:ps

# Linux/macOS - Check specific issues
npm run validate:structure
npm run validate:paths
npm run validate:webfiles
```

## 📁 Key Directories

- **Main Site**: `powerpages/rcsa-copilot---site-5joks/`
- **Design System**: `powerpages/rcsa-copilot---site-5joks/web-files/`
- **Pages**: `powerpages/rcsa-copilot---site-5joks/web-pages/`
- **Scripts**: `scripts/`
- **Backups**: `backups/`
- **Logs**: `logs/`

## 🔧 Environment Variables

Required variables (set in `.env`):
- `POWERPAGES_ENVIRONMENT_ID`: Your Power Platform environment ID
- `POWERPAGES_WEBSITE_ID`: Your Power Pages website ID
- `POWERPAGES_ENVIRONMENT_URL`: Your Power Platform environment URL

## 📝 Script Options

### Full Deploy Options
```powershell
# Windows
.\scripts\local-deploy.ps1 -SkipBackup
.\scripts\local-deploy.ps1 -SkipValidation
.\scripts\local-deploy.ps1 -Help

# Linux/macOS
./scripts/local-deploy.sh --skip-backup
./scripts/local-deploy.sh --skip-validation
./scripts/local-deploy.sh --help
```

### Quick Deploy Options
```powershell
# Windows
.\scripts\quick-deploy.ps1 -SkipValidation
.\scripts\quick-deploy.ps1 -Help

# Linux/macOS
./scripts/quick-deploy.sh --skip-validation
./scripts/quick-deploy.sh --help
```

## 🚨 Emergency Procedures

### Rollback Process
1. **Identify Backup**: Check `backups/` directory
2. **Navigate to Backup**: `cd backups/YYYYMMDD_HHMMSS`
3. **Deploy Backup**: `pac paportal upload --path . --environment-id $env:POWERPAGES_ENVIRONMENT_ID --website-id $env:POWERPAGES_WEBSITE_ID`
4. **Verify Rollback**: Test critical functionality

### Critical Hotfix
1. **Quick Fix**: Make minimal changes
2. **Skip Validation**: Use `--skip-validation` if time-critical
3. **Quick Deploy**: Use quick deploy for speed
4. **Immediate Test**: Verify fix works
5. **Follow-up**: Plan full deployment later

## 📊 Deployment Types

| Type | Backup | Validation | Speed | Use Case |
|------|--------|------------|-------|----------|
| **Full** | ✅ | ✅ | Slow | Production releases |
| **Quick** | ❌ | Basic | Fast | Development iterations |
| **Skip Backup** | ❌ | ✅ | Medium | Trusted environments |

## 🔍 Health Checks

### Pre-Deployment
- [ ] Authentication active (`pac auth list`)
- [ ] Environment variables loaded
- [ ] Directory structure valid
- [ ] Design system files present
- [ ] No validation errors

### Post-Deployment
- [ ] Site loads correctly
- [ ] All pages accessible
- [ ] LogicGate design system applied
- [ ] JavaScript functionality works
- [ ] No console errors

---

*Keep this reference handy during deployment activities!* 