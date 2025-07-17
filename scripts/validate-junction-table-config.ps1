# Junction Table Configuration Validator
# Validates that all critical settings are correctly configured

param(
    [string]$PowerPagesPath = "powerpages/rcsa-copilot---site-5joks"
)

Write-Host "🔍 JUNCTION TABLE CONFIGURATION VALIDATOR" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$errors = @()
$warnings = @()

# Check Site Settings
Write-Host "`n📋 Checking Site Settings..." -ForegroundColor Yellow

$siteSettingsPath = "$PowerPagesPath/sitesetting.yml"
if (-not (Test-Path $siteSettingsPath)) {
    $errors += "❌ Site settings file not found: $siteSettingsPath"
} else {
    $content = Get-Content $siteSettingsPath -Raw
    
    # Check critical wildcard settings
    if ($content -notmatch 'Webapi/cr129_riskctrls/fields.*adx_value:\s*"\*"') {
        $errors += "❌ CRITICAL: cr129_riskctrls/fields must be wildcard (*)"
    } else {
        Write-Host "✅ cr129_riskctrls/fields is wildcard" -ForegroundColor Green
    }
    
    if ($content -notmatch 'Webapi/cr129_riskctrl/fields.*adx_value:\s*"\*"') {
        $errors += "❌ CRITICAL: cr129_riskctrl/fields must be wildcard (*)"
    } else {
        Write-Host "✅ cr129_riskctrl/fields is wildcard" -ForegroundColor Green
    }
    
    # Check disableodatafilter settings
    if ($content -notmatch 'Webapi/cr129_riskctrls/disableodatafilter.*adx_value:\s*true') {
        $errors += "❌ CRITICAL: cr129_riskctrls/disableodatafilter must be true"
    } else {
        Write-Host "✅ cr129_riskctrls/disableodatafilter is enabled" -ForegroundColor Green
    }
    
    if ($content -notmatch 'Webapi/cr129_riskctrl/disableodatafilter.*adx_value:\s*true') {
        $errors += "❌ CRITICAL: cr129_riskctrl/disableodatafilter must be true"
    } else {
        Write-Host "✅ cr129_riskctrl/disableodatafilter is enabled" -ForegroundColor Green
    }
}

# Check Table Permissions
Write-Host "`n🔐 Checking Table Permissions..." -ForegroundColor Yellow

$tablePermPath = "$PowerPagesPath/table-permissions/Web-API-RiskCtrl.tablepermission.yml"
if (-not (Test-Path $tablePermPath)) {
    $errors += "❌ Table permission file not found: $tablePermPath"
} else {
    $content = Get-Content $tablePermPath -Raw
    
    # Check essential permissions
    if ($content -notmatch 'adx_enablewebapi:\s*true') {
        $errors += "❌ CRITICAL: adx_enablewebapi must be true"
    } else {
        Write-Host "✅ Web API enabled" -ForegroundColor Green
    }
    
    if ($content -notmatch 'adx_entitylogicalname:\s*cr129_riskctrl') {
        $errors += "❌ CRITICAL: Entity logical name must be cr129_riskctrl"
    } else {
        Write-Host "✅ Entity logical name correct" -ForegroundColor Green
    }
    
    # Check for problematic complex permissions
    if ($content -match 'adx_columnpermissionprofiles') {
        $warnings += "⚠️ WARNING: Complex column permissions detected - these can cause issues"
    }
    
    if ($content -match 'adx_childTablePermissions') {
        $warnings += "⚠️ WARNING: Child table permissions detected - these can cause circular dependencies"
    }
}

# Check for conflicting permission files
Write-Host "`n🔍 Checking for Conflicting Permission Files..." -ForegroundColor Yellow

$nestedTablePermPath = "$PowerPagesPath/rcsa-copilot---site-5joks/table-permissions"
if (Test-Path $nestedTablePermPath) {
    $conflictingFiles = Get-ChildItem $nestedTablePermPath -Filter "*riskctrl*.yml" | Where-Object { $_.Name -ne "Web-API-RiskCtrl.tablepermission.yml" }
    
    if ($conflictingFiles.Count -gt 0) {
        $errors += "❌ CRITICAL: Conflicting permission files detected in nested directory:"
        foreach ($file in $conflictingFiles) {
            $errors += "   - $($file.FullName)"
        }
    } else {
        Write-Host "✅ No conflicting permission files found" -ForegroundColor Green
    }
}

# Check JavaScript Implementation
Write-Host "`n📜 Checking JavaScript Implementation..." -ForegroundColor Yellow

$jsPath = "$PowerPagesPath/web-pages/control-mapping-overview/content-pages/Control-Mapping-Overview.en-US.webpage.copy.html"
if (-not (Test-Path $jsPath)) {
    $errors += "❌ JavaScript file not found: $jsPath"
} else {
    $content = Get-Content $jsPath -Raw
    
    # Check for correct field names
    if ($content -notmatch 'cr129_RIskTitle') {
        $errors += "❌ CRITICAL: Missing correct field name 'cr129_RIskTitle' (note casing)"
    } else {
        Write-Host "✅ Correct risk field name found" -ForegroundColor Green
    }
    
    if ($content -notmatch 'cr129_ControlTitle') {
        $errors += "❌ CRITICAL: Missing correct field name 'cr129_ControlTitle' (note casing)"
    } else {
        Write-Host "✅ Correct control field name found" -ForegroundColor Green
    }
    
    # Check for expand usage
    if ($content -notmatch '\$expand=.*cr129_ControlTitle.*cr129_RIskTitle') {
        $warnings += "⚠️ WARNING: $expand pattern not found - ensure using expand instead of lookup value fields"
    } else {
        Write-Host "✅ Using $expand pattern" -ForegroundColor Green
    }
    
    # Check for problematic field names
    $problematicFields = @('_cr129_risktitle_value', '_cr129_controltitle_value', '_cr129_risk_value', '_cr129_control_value')
    foreach ($field in $problematicFields) {
        if ($content -match [regex]::Escape($field)) {
            $warnings += "⚠️ WARNING: Found problematic field name '$field' - these don't work reliably"
        }
    }
}

# Report Results
Write-Host "`n📊 VALIDATION RESULTS" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan

if ($errors.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "✅ ALL CHECKS PASSED - Configuration is healthy!" -ForegroundColor Green
    exit 0
} else {
    if ($errors.Count -gt 0) {
        Write-Host "`n❌ CRITICAL ERRORS FOUND:" -ForegroundColor Red
        foreach ($error in $errors) {
            Write-Host $error -ForegroundColor Red
        }
    }
    
    if ($warnings.Count -gt 0) {
        Write-Host "`n⚠️ WARNINGS:" -ForegroundColor Yellow
        foreach ($warning in $warnings) {
            Write-Host $warning -ForegroundColor Yellow
        }
    }
    
    Write-Host "`n🔧 ACTION REQUIRED:" -ForegroundColor Red
    Write-Host "Review the critical configuration guide: docs/CRITICAL_JUNCTION_TABLE_CONFIGURATION.md" -ForegroundColor Red
    
    if ($errors.Count -gt 0) {
        exit 1
    } else {
        exit 0
    }
} 