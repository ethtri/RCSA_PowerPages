# Power Platform CLI Quick Reference

## Essential Commands for RCSA Power Pages V3

### Authentication Commands

```powershell
# Check current authentication status
pac auth list

# Create new authentication profile
pac auth create --url https://org601a79e1.crm.dynamics.com/

# Select authentication profile
pac auth select --index 0

# Clear authentication
pac auth clear
```

### Power Pages Upload Commands

```powershell
# ✅ CORRECT - Upload with enhanced data model
pac paportal upload --path "powerpages/rcsa-copilot---site-5joks" --modelVersion 2

# ✅ Force upload all files (troubleshooting)
pac paportal upload --path "powerpages/rcsa-copilot---site-5joks" --modelVersion 2 --forceUploadAll

# ✅ Upload specific component
pac paportal upload --path "powerpages/rcsa-copilot---site-5joks/web-pages" --modelVersion 2
```

### Power Pages Download Commands

```powershell
# Download entire site
pac paportal download --path "downloaded-site" --modelVersion 2

# Download to specific directory
pac paportal download --path "backups/backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')" --modelVersion 2
```

### Site Management Commands

```powershell
# List Power Pages sites
pac paportal list

# Get site details
pac paportal show --website-id [SITE-ID]

# Publish site
pac paportal publish
```

## Common Error Solutions

### ❌ Error: "Power Pages entities for standard data model (v1) aren't available"
**Fix:** Add `--modelVersion 2` parameter

### ❌ Error: "An unknown argument --model-version was passed"
**Fix:** Use `--modelVersion` (camelCase) not `--model-version` (hyphenated)

### ❌ Error: Authentication failures
**Fix:** Run `pac auth list` and `pac auth create` if needed

### ❌ Error: Upload timeouts
**Fix:** Use `--forceUploadAll` parameter

## Project-Specific Information

- **Environment URL:** `https://org601a79e1.crm.dynamics.com/`
- **Site Path:** `powerpages/rcsa-copilot---site-5joks`
- **Data Model:** Enhanced (v2)
- **Required Parameter:** `--modelVersion 2`

## Quick Deployment Workflow

```powershell
# 1. Check authentication
pac auth list

# 2. Upload changes
pac paportal upload --path "powerpages/rcsa-copilot---site-5joks" --modelVersion 2

# 3. Verify upload success
# Check the output for "Power Pages website upload succeeded"
```

## Best Practices

1. ✅ Always use `--modelVersion 2` for this environment
2. ✅ Check authentication before uploading
3. ✅ Use camelCase parameter names
4. ✅ Test single page uploads for debugging
5. ✅ Keep backups before major changes
6. ✅ Verify upload success messages

---

*Last Updated: January 2025*
*Project: RCSA Power Pages V3* 