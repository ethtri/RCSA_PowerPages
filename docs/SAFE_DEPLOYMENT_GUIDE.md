# 🚀 Safe Power Pages Deployment Guide

## ⚡ Quick Deployment Checklist

### 📋 Pre-Upload Validation
```powershell
# 1. Validate current configuration
.\scripts\validate-junction-table-config.ps1

# 2. Clean any conflicting permission files  
.\scripts\clean-conflicting-permissions.ps1

# 3. If validation fails, restore from backup:
Copy-Item "archive/junction-table-working-backup/*" "powerpages/rcsa-copilot---site-5joks/" -Recurse -Force
```

### 🚀 Upload Command
```powershell
# REQUIRED: Use enhanced data model v2
pac paportal upload --path powerpages/rcsa-copilot---site-5joks --modelVersion 2
```

**Expected Output:**
- ✅ Upload progress bar reaches 100%
- ⚠️ XRM Network errors are NORMAL (metadata cache issues)
- ✅ "Power Pages website upload succeeded" message

### 🔍 Post-Upload Validation
```powershell
# Immediately verify junction table configuration
.\scripts\validate-junction-table-config.ps1
```

**Expected Result:** All checks should pass with ✅ green checkmarks

## 🛑 Common Issues & Solutions

### ❌ Issue: "Power Pages entities for standard data model (v1) aren't available"
**Solution:** Add `--modelVersion 2` to upload command

### ❌ Issue: Validation script shows wildcard fields lost
**Solution:** Restore from backup and re-upload:
```powershell
Copy-Item "archive/junction-table-working-backup/sitesetting.yml" "powerpages/rcsa-copilot---site-5joks/" -Force
pac paportal upload --path powerpages/rcsa-copilot---site-5joks --modelVersion 2
```

### ❌ Issue: Permission conflicts detected
**Solution:** Clean conflicting files and re-upload:
```powershell
.\scripts\clean-conflicting-permissions.ps1
pac paportal upload --path powerpages/rcsa-copilot---site-5joks --modelVersion 2
```

## 🔒 Critical Configuration Protection

### 🎯 What Must NEVER Change:
1. **Site Settings**: Wildcard fields (`"*"`) for cr129_riskctrls/cr129_riskctrl
2. **Site Settings**: `disableodatafilter: true` for both entities
3. **Table Permissions**: Simple structure without complex column permissions
4. **JavaScript**: Exact field names `cr129_RIskTitle`, `cr129_ControlTitle`

### 🚨 Emergency Recovery:
If anything breaks during development:
```powershell
# Full restore from working backup
Remove-Item "powerpages/rcsa-copilot---site-5joks" -Recurse -Force
Copy-Item "archive/junction-table-working-backup" "powerpages/rcsa-copilot---site-5joks" -Recurse
pac paportal upload --path powerpages/rcsa-copilot---site-5joks --modelVersion 2
.\scripts\validate-junction-table-config.ps1
```

## 📊 Authentication Check
Before any deployment, verify authentication:
```powershell
pac auth list
# Should show active connection to "Risk and Compliance Assessment" environment
```

## 🔄 Complete Safe Deployment Workflow

```powershell
# 1. Pre-flight checks
pac auth list
.\scripts\validate-junction-table-config.ps1

# 2. Deploy safely  
pac paportal upload --path powerpages/rcsa-copilot---site-5joks --modelVersion 2

# 3. Post-deployment validation
.\scripts\validate-junction-table-config.ps1

# 4. If validation fails, emergency restore:
# Copy-Item "archive/junction-table-working-backup/*" "powerpages/rcsa-copilot---site-5joks/" -Recurse -Force
# pac paportal upload --path powerpages/rcsa-copilot---site-5joks --modelVersion 2
```

---
**✅ Success Criteria:** 
- Upload completes with success message
- Validation script shows all green checkmarks  
- Control mapping page functions correctly
- No 403/400 errors in browser console 