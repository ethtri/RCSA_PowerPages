# Power Pages Web API 403 Forbidden Error - Complete Troubleshooting Guide

## Overview
This document captures the complete resolution process for 403 Forbidden errors when using Power Pages Web API with lookup fields and control mappings in the RCSA application.

## Problem Statement
**Error**: `403 (Forbidden)` when attempting PATCH operations on `/_api/cr129_risks` endpoint to save control mappings using the `cr129_mappedcontrol` lookup field.

**Symptom**: Control Mapping feature completely non-functional despite proper authentication and valid API calls.

## Root Cause Analysis

### 1. Missing Web API Enable Flag
**Issue**: Table permissions lacked the critical `adx_enablewebapi: true` flag
**Impact**: Web API endpoints were not accessible despite table permissions existing

**Files Affected**:
- `Web-API-Risk.tablepermission.yml`
- `Web-API-Control.tablepermission.yml`
- `Web-API-Proc.tablepermission.yml`
- `Web-API-RiskCtrl.tablepermission.yml`

### 2. Insufficient Web Role Coverage
**Issue**: Table permissions only had partial web role assignments
**Impact**: Different user types couldn't access Web API endpoints

**Required Web Roles**:
- Anonymous Users: `27b95ddd-4d8e-409b-acb1-5b679dd2282c`
- Administrators: `a3f35e16-a398-428c-b9db-986df58ce13e`
- Authenticated Users: `b912c42b-d467-42b7-88c9-2427536440e4`

### 3. Missing Child Table Permissions for Lookup Fields
**Issue**: Lookup fields require explicit child table permissions for target entities
**Impact**: Web API couldn't validate access to target Control records when setting lookup

**Solution**: Added child table permission structure:
```yaml
adx_childTablePermissions:
- adx_entitylogicalname: cr129_control
  adx_entityname: Risk-Control-Lookup-Access
  adx_parentrelationship: cr129_mappedcontrol
  adx_parententitypermission: e2447bea-c145-4778-a183-1249a2fdbb12
  adx_read: true
```

### 4. Site Settings Field Restrictions
**Issue**: `Webapi/cr129_risk/fields` site setting excluded the new `cr129_mappedcontrol` field
**Impact**: Web API rejected requests containing the excluded field

**Original Setting**:
```
cr129_riskid,cr129_risktitle,cr129_riskdescription,cr129_businessunitname,_cr129_businessunitname_value,cr129_inherentrisk,cr129_residualrisk,cr129_linkedcontrols,statecode,statuscode,createdon,modifiedon,ownerid,_ownerid_value
```

**Fixed Setting** (added lookup field and its value property):
```
cr129_riskid,cr129_risktitle,cr129_riskdescription,cr129_businessunitname,_cr129_businessunitname_value,cr129_inherentrisk,cr129_residualrisk,cr129_linkedcontrols,cr129_mappedcontrol,_cr129_mappedcontrol_value,statecode,statuscode,createdon,modifiedon,ownerid,_ownerid_value
```

## Resolution Steps

### Step 1: Update Table Permissions
1. Add `adx_enablewebapi: true` to all relevant table permissions
2. Ensure all three web roles are included in `adx_entitypermission_webrole` array
3. Upload using `pac paportal upload --path ./rcsa-copilot---site-5joks --modelVersion 2`

### Step 2: Add Child Table Permissions
1. Identify lookup field relationships (cr129_mappedcontrol → cr129_control)
2. Add child table permission structure to parent entity permission
3. Include appropriate access levels (read for lookup validation)
4. Upload updated permissions

### Step 3: Update Site Settings
1. Locate field restriction site settings (`Webapi/{table}/fields`)
2. Add new lookup fields and their `_value` properties
3. Maintain proper comma-separated format
4. Upload updated site settings

### Step 4: Clear Caches and Test
1. Wait 15-30 minutes for permission cache refresh
2. Clear browser cache
3. Test API functionality

## Key Learnings

### Lookup Field Requirements
- Lookup fields require both parent entity write permissions AND child entity read permissions
- Field restriction site settings must include both the lookup field AND its `_value` property
- Child table permissions use the relationship name (e.g., `cr129_mappedcontrol`)

### Web API Permissions Architecture
```
Table Permission (adx_enablewebapi: true)
├── Web Roles (Anonymous, Admin, Authenticated)
├── Entity Permissions (Create, Read, Update, Delete)
└── Child Table Permissions (for lookup validation)
    ├── Target Entity (cr129_control)
    ├── Relationship Name (cr129_mappedcontrol)
    └── Access Level (read)
```

### Site Settings Impact
- Field restrictions are enforced even with proper table permissions
- Both scalar field name and navigation property value are required
- Missing fields result in 403 errors, not field-level validation errors

## API Implementation Pattern

### Successful Lookup Field Update
```javascript
webapi.safeAjax({
    type: 'PATCH',
    url: `/_api/cr129_risks(${riskId})`,
    data: JSON.stringify({
        "cr129_mappedcontrol@odata.bind": `/cr129_controls(${controlId})`
    }),
    headers: {
        'Content-Type': 'application/json'
    }
});
```

### Successful Lookup Field Clear
```javascript
webapi.safeAjax({
    type: 'PATCH',
    url: `/_api/cr129_risks(${riskId})`,
    data: JSON.stringify({
        "cr129_mappedcontrol@odata.bind": null
    }),
    headers: {
        'Content-Type': 'application/json'
    }
});
```

## Troubleshooting Checklist

When encountering 403 errors with Web API:

- [ ] Verify `adx_enablewebapi: true` flag on table permissions
- [ ] Confirm all required web roles are assigned
- [ ] Check child table permissions for lookup fields
- [ ] Validate site settings field restrictions include new fields
- [ ] Ensure proper GUID formatting in API calls
- [ ] Wait for permission cache refresh (15-30 minutes)
- [ ] Clear browser cache after permission updates

## EntitySetName Mappings (for reference)
- cr129_risk → cr129_risks
- cr129_control → cr129_controls
- cr129_proc → cr129_processes
- cr129_riskctrl → cr129_riskctrls
- cr129_bu → cr129_bus
- cr129_assess → cr129_assesses
- cr129_issue → cr129_issues
- cr129_scale → cr129_scales
- cr129_kri → cr129_kris

## Performance Notes
- Permission changes require 15-30 minute cache refresh
- Child table permissions add validation overhead but are required for lookup integrity
- Site setting field restrictions provide security but must be maintained manually

---

**Document Created**: Based on successful resolution of Control Mapping 403 errors
**Last Updated**: After successful implementation of 1:1 control mapping with cr129_mappedcontrol lookup field 