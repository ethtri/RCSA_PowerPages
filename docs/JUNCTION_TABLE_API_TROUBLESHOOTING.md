# Junction Table API Troubleshooting Guide

## 🔧 **cr129_riskctrl Junction Table 400 Bad Request Fix**

### **Problem Symptoms**
- 400 Bad Request errors on GET `/api/cr129_riskctrls` queries
- 400 Bad Request errors on POST `/api/cr129_riskctrls` operations
- Error: "XRM Network error" or similar validation errors

### **Root Cause Analysis**

#### **1. Field Name Discrepancies**
The junction table has inconsistent field naming:
- **Physical Name**: `cr129_RIskTitle` (capital "I" in "RIsk")
- **Logical Name**: `cr129_risktitle` (lowercase)
- **Navigation Property**: Can vary in OData queries

#### **2. $expand vs Lookup Values**
Complex `$expand` queries on junction tables often fail due to:
- Multiple relationship paths
- Case sensitivity in navigation properties
- Power Pages Web API limitations on junction tables

### **Solution Implemented**

#### **1. Use Lookup Value Fields Instead of $expand**
```javascript
// ❌ BROKEN: Complex $expand query
url: '/_api/cr129_riskctrls?$select=cr129_riskctrlid&$expand=cr129_risktitle($select=cr129_riskid),cr129_controltitle($select=cr129_controlid)'

// ✅ WORKING: Use lookup value fields
url: '/_api/cr129_riskctrls?$select=cr129_riskctrlid,_cr129_risktitle_value,_cr129_controltitle_value'
```

#### **2. Updated Site Settings**
Added all required fields to Web API field lists:
```yaml
- adx_name: Webapi/cr129_riskctrls/fields
  adx_value: cr129_riskctrlid,cr129_controltitle,cr129_risktitle,_cr129_risktitle_value,_cr129_controltitle_value,statecode,statuscode
```

#### **3. Simplified API Pattern**
```javascript
// Load existing mappings
const response = await webapi.safeAjax({
  url: '/_api/cr129_riskctrls?$select=cr129_riskctrlid,_cr129_risktitle_value,_cr129_controltitle_value&$filter=statecode eq 0',
  type: 'GET',
  contentType: 'application/json; charset=utf-8'
});

// Create junction record
const junctionData = {
  "cr129_risktitle@odata.bind": `/cr129_risks(${riskGuid})`,
  "cr129_controltitle@odata.bind": `/cr129_controls(${controlGuid})`
};

// Delete junction record
await webapi.safeAjax({
  url: `/_api/cr129_riskctrls(${recordId})`,
  type: 'DELETE'
});
```

### **Testing Steps**

#### **1. Verify Basic Access**
```javascript
// Test basic endpoint access
const testResponse = await webapi.safeAjax({
  url: '/_api/cr129_riskctrls?$select=cr129_riskctrlid&$top=5',
  type: 'GET',
  contentType: 'application/json; charset=utf-8'
});
```

#### **2. Verify Field Access**
```javascript
// Test lookup value fields
const response = await webapi.safeAjax({
  url: '/_api/cr129_riskctrls?$select=_cr129_risktitle_value,_cr129_controltitle_value&$top=1',
  type: 'GET'
});
```

#### **3. Test Create Operation**
```javascript
// Test junction record creation
const junctionData = {
  "cr129_risktitle@odata.bind": "/cr129_risks(test-guid)",
  "cr129_controltitle@odata.bind": "/cr129_controls(test-guid)"
};
```

### **Key Lessons Learned**

1. **Lookup Value Fields Are More Reliable**: Use `_fieldname_value` instead of complex `$expand` queries
2. **Site Settings Must Include All Fields**: Add both logical names and lookup value fields
3. **Junction Tables Need Simple Queries**: Avoid complex OData operations on junction tables
4. **Test Incrementally**: Start with basic endpoint access before complex operations

### **Related Documentation**
- [POWER_PAGES_WEB_API_403_TROUBLESHOOTING.md](./POWER_PAGES_WEB_API_403_TROUBLESHOOTING.md) - Table permissions issues
- [DATAVERSE_INTEGRATION_GUIDE.md](./DATAVERSE_INTEGRATION_GUIDE.md) - General Web API patterns

### **Future Prevention**
- Always test basic endpoint access before complex queries
- Use lookup value fields for junction table operations
- Include comprehensive field lists in site settings
- Add error logging to identify specific failure points 