# 🔒 WORKING JUNCTION TABLE CONFIGURATION BACKUP

## ⚠️ CRITICAL BACKUP - DO NOT DELETE

This directory contains a **verified working snapshot** of the junction table configuration that enables multi-select control mapping to work perfectly.

**Status**: ✅ Confirmed working as of $(Get-Date)
- Multi-select control mapping functional
- Controls persist on risk cards after refresh  
- No API errors (403/400)
- All CRUD operations working

## 📂 Backup Contents

### Core Configuration Files
- `sitesetting.yml` - Site settings with wildcard fields and disableodatafilter
- `Web-API-RiskCtrl.tablepermission.yml` - Simplified table permissions
- `Control-Mapping-Overview.en-US.webpage.copy.html` - JavaScript with $expand pattern

### Documentation
- `config-summary.md` - Summary of critical settings
- `field-names-reference.md` - Exact field names that work vs don't work

## 🚨 EMERGENCY RESTORATION

If the junction table configuration breaks:

1. **Stop all changes immediately**
2. **Copy files from this backup** to restore working state:
   ```powershell
   Copy-Item "archive/junction-table-working-backup/sitesetting.yml" "powerpages/rcsa-copilot---site-5joks/sitesetting.yml" -Force
   Copy-Item "archive/junction-table-working-backup/Web-API-RiskCtrl.tablepermission.yml" "powerpages/rcsa-copilot---site-5joks/table-permissions/Web-API-RiskCtrl.tablepermission.yml" -Force
   Copy-Item "archive/junction-table-working-backup/Control-Mapping-Overview.en-US.webpage.copy.html" "powerpages/rcsa-copilot---site-5joks/web-pages/control-mapping-overview/content-pages/Control-Mapping-Overview.en-US.webpage.copy.html" -Force
   ```
3. **Upload immediately**: `pac paportal upload --path ./rcsa-copilot---site-5joks --modelVersion 2`
4. **Test functionality** to confirm restoration

## 📋 Verification Checklist

After restoration, verify:
- [ ] Control Mapping page loads without errors
- [ ] Can create new control mappings
- [ ] Controls persist on risk cards after page refresh
- [ ] Browser console shows no 403/400 errors
- [ ] API calls use $expand pattern successfully

## 🔗 Related Files

- Main documentation: `docs/CRITICAL_JUNCTION_TABLE_CONFIGURATION.md`
- Validation script: `scripts/validate-junction-table-config.ps1`
- Original guide: `docs/Junctiontableguide.md`

---
**⚠️ This backup represents hours of troubleshooting work. Treat as production-critical.** 