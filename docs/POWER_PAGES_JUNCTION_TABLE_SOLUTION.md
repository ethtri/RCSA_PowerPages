# Power Pages Junction Table Web API - Complete Solution Guide

## 🎯 **Overview**

This document provides the **definitive solution** for implementing Web API access to junction tables in Power Pages, based on successfully resolving the cr129_riskctrl junction table implementation in the RCSA project.

## 🚨 **Critical Success Factors**

### **1. Use Physical Field Names Consistently**
Junction tables in Power Pages require **physical field names** (not logical names) across ALL configurations:

```yaml
# ✅ CORRECT - Physical field names (note the exact casing)
cr129_ControlTitle  # Physical name for control lookup
cr129_RIskTitle     # Physical name for risk lookup (note capital "I")

# ❌ WRONG - Logical field names
cr129_controltitle
cr129_risktitle
```

### **2. Use $expand for Data Retrieval (NOT Lookup Value Fields)**
**Never try to access system-generated lookup value fields** like `_cr129_risktitle_value` - these cannot be enabled for Web API.

```javascript
// ✅ CORRECT - Use $expand with physical field names
const response = await webapi.safeAjax({
  url: '/_api/cr129_riskctrls?$select=cr129_riskctrlid&$expand=cr129_RIskTitle($select=cr129_riskid),cr129_ControlTitle($select=cr129_controlid)&$filter=statecode eq 0',
  type: 'GET'
});

// Extract GUIDs from expanded objects
const riskId = record.cr129_RIskTitle?.cr129_riskid;
const controlId = record.cr129_ControlTitle?.cr129_controlid;
```

```javascript
// ❌ WRONG - Trying to access lookup value fields directly
url: '/_api/cr129_riskctrls?$select=_cr129_risktitle_value,_cr129_controltitle_value'
// Results in: 403 Forbidden - "Attribute _cr129_risktitle_value is not enabled for Web Api"
```

### **3. Complete Configuration Requirements**

#### **A. Site Settings**
```yaml
- adx_name: Webapi/cr129_riskctrls/enabled
  adx_value: true

- adx_name: Webapi/cr129_riskctrls/fields
  adx_value: cr129_riskctrlid,cr129_ControlTitle,cr129_RIskTitle,statecode,statuscode

- adx_name: Webapi/cr129_riskctrls/disableodatafilter
  adx_value: true  # Critical for complex relationships
```

#### **B. Table Permissions**
```yaml
# Main junction table permission
adx_entitylogicalname: cr129_riskctrl
adx_enablewebapi: true
adx_create: true
adx_write: true
adx_read: true

# Column permissions for physical field names
adx_columnpermissions:
- adx_columnlogicalname: cr129_ControlTitle
  adx_permissions: 7  # Read, Write, Create
- adx_columnlogicalname: cr129_RIskTitle  
  adx_permissions: 7  # Read, Write, Create

# Child table permissions for referenced entities
adx_childTablePermissions:
- adx_entitylogicalname: cr129_risk
  adx_parentrelationship: cr129_RIskTitle  # Physical field name
  adx_read: true
- adx_entitylogicalname: cr129_control
  adx_parentrelationship: cr129_ControlTitle  # Physical field name
  adx_read: true
```

### **4. API Operation Patterns**

#### **CREATE (POST) Operations**
```javascript
// Use @odata.bind with physical field names
const junctionData = {
  "cr129_RIskTitle@odata.bind": `/cr129_risks(${riskGuid})`,
  "cr129_ControlTitle@odata.bind": `/cr129_controls(${controlGuid})`
};

await webapi.safeAjax({
  url: '/_api/cr129_riskctrls',
  type: 'POST',
  data: JSON.stringify(junctionData),
  contentType: 'application/json; charset=utf-8'
});
```

#### **READ (GET) Operations**
```javascript
// Use $expand to get related entity data
const response = await webapi.safeAjax({
  url: '/_api/cr129_riskctrls?$select=cr129_riskctrlid&$expand=cr129_RIskTitle($select=cr129_riskid),cr129_ControlTitle($select=cr129_controlid)',
  type: 'GET'
});

// Extract GUIDs from expanded objects
response.value.forEach(record => {
  const riskId = record.cr129_RIskTitle?.cr129_riskid;
  const controlId = record.cr129_ControlTitle?.cr129_controlid;
});
```

#### **DELETE Operations**
```javascript
// First find the junction record, then delete by ID
const records = await webapi.safeAjax({
  url: `/_api/cr129_riskctrls?$select=cr129_riskctrlid&$expand=cr129_RIskTitle($select=cr129_riskid),cr129_ControlTitle($select=cr129_controlid)&$filter=cr129_RIskTitle/cr129_riskid eq ${riskGuid} and cr129_ControlTitle/cr129_controlid eq ${controlGuid}`,
  type: 'GET'
});

for (const record of records.value) {
  await webapi.safeAjax({
    url: `/_api/cr129_riskctrls(${record.cr129_riskctrlid})`,
    type: 'DELETE'
  });
}
```

## 🔍 **Common Error Patterns and Solutions**

| Error | Cause | Solution |
|-------|-------|----------|
| `403 Forbidden` on GET | Missing table permissions or wrong field names | Verify physical field names in table permissions |
| `403 Forbidden` on POST | Missing child table permissions | Add child table permissions for lookup relationships |
| `Attribute _cr129_risktitle_value is not enabled for Web Api` | Trying to access system lookup value fields | Use $expand with physical field names instead |
| `undefined` GUID extraction | Wrong field access pattern | Use `record.PhysicalFieldName?.primarykeyfield` pattern |
| `400 Bad Request` | Wrong field names in @odata.bind | Ensure exact physical field name casing |

## 🧪 **Testing Checklist**

### **Verification Steps:**
1. **✅ GET Request Works**: Junction records load without 403 errors
2. **✅ GUID Extraction**: Console shows actual GUIDs, not "undefined"
3. **✅ POST Operations**: Can create new junction records without 403 errors
4. **✅ DELETE Operations**: Can remove junction records
5. **✅ Data Integrity**: Created records appear correctly in Dataverse

### **Debug Commands:**
```javascript
// Test basic GET access
webapi.safeAjax({
  url: '/_api/cr129_riskctrls?$top=1',
  type: 'GET'
}).done(console.log).fail(console.error);

// Test expanded GET access
webapi.safeAjax({
  url: '/_api/cr129_riskctrls?$select=cr129_riskctrlid&$expand=cr129_RIskTitle($select=cr129_riskid),cr129_ControlTitle($select=cr129_controlid)&$top=1',
  type: 'GET'
}).done(console.log).fail(console.error);
```

## 🎯 **Key Insights Discovered**

1. **Physical vs Logical Names**: Junction tables require physical field names throughout, but the exact casing matters (e.g., `cr129_RIskTitle` not `cr129_risktitle`)

2. **Lookup Value Fields Are Off-Limits**: Never try to access `_fieldname_value` fields through Web API - they're system-generated and not Web API accessible

3. **$expand Is Essential**: To get related entity data, use $expand rather than trying to access lookup value fields directly

4. **Child Permissions Required**: Junction tables need child table permissions for the referenced entities, even when the main entities have their own Web API permissions

5. **OData Filter Disable**: Complex junction table relationships often require `disableodatafilter: true` to work properly

## 🚀 **Implementation Template**

For any new junction table implementation, follow this pattern:

```yaml
# 1. Site Settings
- adx_name: Webapi/[tablename]/enabled
  adx_value: true
- adx_name: Webapi/[tablename]/fields  
  adx_value: [primarykey],[physicallookup1],[physicallookup2],statecode,statuscode
- adx_name: Webapi/[tablename]/disableodatafilter
  adx_value: true
```

```yaml
# 2. Table Permissions
adx_entitylogicalname: [tablename]
adx_enablewebapi: true
adx_create: true
adx_write: true
adx_read: true
adx_columnpermissions:
- adx_columnlogicalname: [physicallookup1]
  adx_permissions: 7
- adx_columnlogicalname: [physicallookup2]
  adx_permissions: 7
adx_childTablePermissions:
- adx_entitylogicalname: [relatedtable1]
  adx_parentrelationship: [physicallookup1]
  adx_read: true
- adx_entitylogicalname: [relatedtable2]
  adx_parentrelationship: [physicallookup2]
  adx_read: true
```

```javascript
// 3. JavaScript Implementation
// GET with $expand
const response = await webapi.safeAjax({
  url: `/_api/[tablenames]?$select=[primarykey]&$expand=[physicallookup1]($select=[relatedprimarykey1]),[physicallookup2]($select=[relatedprimarykey2])`,
  type: 'GET'
});

// POST with @odata.bind
const data = {
  "[physicallookup1]@odata.bind": `/[relatedtablename1s](${guid1})`,
  "[physicallookup2]@odata.bind": `/[relatedtablename2s](${guid2})`
};
```

---

**Document Status**: ✅ **VALIDATED** - Solution successfully implemented and tested in RCSA Control Mapping  
**Last Updated**: January 2025  
**Author**: RCSA Development Team 