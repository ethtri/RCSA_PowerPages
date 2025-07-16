# PowerPages Web API Troubleshooting Guide

## Overview
Building an RCSA workflow tool in PowerPages and Dataverse requires reliable interactions with the portals Web API. This guide consolidates key insights from official Microsoft documentation, community resources, and real-world troubleshooting experience.

## Official Microsoft Documentation
- **Primary Reference**: [Power Pages Web API Overview](https://learn.microsoft.com/en-us/power-pages/configure/web-api-overview#site-settings-for-the-web-api)
- **HTTP Requests & Error Handling**: [Compose HTTP requests and handle errors](https://learn.microsoft.com/en-us/power-pages/configure/web-api-http-requests-handle-errors)
- **Table Permissions**: [Power Pages table permissions](https://learn.microsoft.com/en-us/power-pages/security/table-permissions)

## Site Settings for Web API (Official Requirements)

According to [Microsoft's official documentation](https://learn.microsoft.com/en-us/power-pages/configure/web-api-overview#site-settings-for-the-web-api), the following site settings are **required** for Web API functionality:

### Core Web API Settings
```yaml
# Enable Web API globally
Webapi/enabled: true

# Enable entity permissions (REQUIRED)
Webapi/EntityPermissions/Enabled: true

# Enable field-level security (REQUIRED for custom tables)
Webapi/FieldSecurity/Enabled: true
```

### Per-Entity Configuration
For each custom table (e.g., `cr129_riskctrl`):

```yaml
# Enable the entity for Web API access
Webapi/<entitylogicalname>/enabled: true

# Specify allowed fields (* for all, or comma-separated list)
Webapi/<entitylogicalname>/fields: "*"

# Disable OData filtering if needed (default: false)
Webapi/<entitylogicalname>/disableodatafilter: false

# Custom entity set name (optional - overrides default plural)
Webapi/EntitySetName/<entitylogicalname>: <customsetname>
```

### Example Configuration
```yaml
# For cr129_riskctrl entity
- adx_name: Webapi/cr129_riskctrl/enabled
  adx_value: true

- adx_name: Webapi/cr129_riskctrl/fields  
  adx_value: "*"  # Use "*" for all fields or specify: "field1,field2,field3"

- adx_name: Webapi/cr129_riskctrl/disableodatafilter
  adx_value: false

- adx_name: Webapi/EntitySetName/cr129_riskctrl
  adx_value: cr129_riskctrls  # Maps cr129_riskctrl -> cr129_riskctrls
```

## Table Permissions (Critical Requirements)

Based on [official table permissions documentation](https://learn.microsoft.com/en-us/power-pages/security/table-permissions) and our successful resolution:

### Required Permission Structure
```yaml
# Example: cr129_riskctrl.tablepermission.yml
adx_entitylogicalname: cr129_riskctrl
adx_entityname: cr129_riskctrl
adx_read: true                    # REQUIRED for Web API GET operations
adx_write: false                  # Set based on needs (false for read-only)
adx_create: false                 # Junction tables typically don't need this
adx_delete: false                 # Junction tables typically don't need this
adx_scope: 756150000              # Global scope (most common)
adx_entitypermission_webrole:     # Assign to appropriate web roles
- role-guid-1
- role-guid-2
```

### Critical Rules
1. **Single Permission Record**: Only ONE table permission record per entity to avoid conflicts
2. **Web Role Assignment**: Ensure authenticated users have the assigned web roles
3. **Scope Alignment**: Use consistent scope across related entities
4. **Related Entity Access**: Junction tables require permissions on parent entities

## Common Issues and Solutions

### 1. Multiple Conflicting Permission Records
**Problem**: Multiple table permission files for the same entity cause 403/400 errors
**Solution**: Keep only ONE authoritative permission record per entity
**Example**: Remove duplicate `Web-API-EntityName-Simple.tablepermission.yml` files

### 2. Incorrect Entity Set Names
**Problem**: Using singular entity name instead of plural entity set name
**Correct**: `/_api/cr129_riskctrls` (plural)
**Incorrect**: `/_api/cr129_riskctrl` (singular)
**Reference**: [Entity Set Names Documentation](https://learn.microsoft.com/en-us/power-pages/configure/web-api-overview#site-settings-for-the-web-api)

### 3. Missing Required Site Settings
**Problem**: Web API not enabled or missing core settings
**Solution**: Verify all required settings exist:
```javascript
// Test in browser console
console.log('Testing required site settings...');
// These should be configured in portal admin
```

### 4. Field Security Restrictions
**Problem**: Specific fields blocked even with table permissions
**Solution**: 
- Use `Webapi/<entity>/fields: "*"` for testing
- Gradually restrict to required fields only
- Ensure `Webapi/FieldSecurity/Enabled: true` is set

### 5. Authentication and Web Role Issues
**Problem**: User authenticated but lacks proper web role assignments
**Diagnostic**: Check user's web role membership matches table permission assignments
**Reference**: [Web Role Assignment](https://learn.microsoft.com/en-us/power-pages/security/table-permissions)

## Metadata Inspection

### Check Available Entities
```http
GET /_api/$metadata
```
Look for your entity in the metadata response:
```xml
<EntitySet Name="cr129_riskctrls" EntityType="Microsoft.Dynamics.CRM.cr129_riskctrl"/>
```

### Verify Service Document
```http  
GET /_api/
```
Should list all available entity sets including your custom entities.

## CRUD Operations with Proper Authentication

### Safe AJAX Wrapper (Microsoft Recommended)
```javascript
(function(webapi, $){
    function safeAjax(options) {
        var deferred = $.Deferred();
        shell.getTokenDeferred().done(function(token) {
            options.headers = options.headers || {};
            options.headers["__RequestVerificationToken"] = token;
            options.contentType = "application/json";
            options.accept = "application/json";
            $.ajax(options).done(deferred.resolve).fail(deferred.reject);
        }).fail(deferred.reject);
        return deferred.promise();
    }
    webapi.safeAjax = safeAjax;
})(window.webapi = window.webapi || {}, jQuery);
```  

### Examples with Error Handling

**Read Records (Most Common)**
```javascript
webapi.safeAjax({
    type: "GET",
    url: "/_api/cr129_riskctrls?$top=10",
    success: function(data) {
        console.log("Success:", data.value);
    },
    error: function(xhr) {
        console.error("Failed:", xhr.status, xhr.responseText);
        handleWebApiError(xhr);
    }
});
```

**Read with Relationships**
```javascript
webapi.safeAjax({
  type: "GET",
    url: "/_api/cr129_riskctrls?$expand=cr129_risktitle,cr129_controltitle&$top=5",
    success: function(data) {
        console.log("Records with relationships:", data.value);
    },
    error: handleWebApiError
});
```

## Error Handling and Diagnostics

### Enhanced Error Handler
```javascript
function handleWebApiError(jqXHR) {
    const status = jqXHR.status;
    let errorMessage = "Unknown error";
    
    try {
        const errorData = JSON.parse(jqXHR.responseText);
        errorMessage = errorData.error?.message || errorData.message || errorMessage;
    } catch (e) {
        errorMessage = jqXHR.responseText || jqXHR.statusText;
    }
    
    switch (status) {
        case 400:
            console.error("🔴 Bad Request (400):", errorMessage);
            console.log("💡 Check: Query syntax, field names, OData format");
            break;
        case 403:
            console.error("🔴 Forbidden (403):", errorMessage);
            console.log("💡 Check: Table permissions, web role assignments, field security");
            break;
        case 404:
            console.error("🔴 Not Found (404):", errorMessage);
            console.log("💡 Check: Entity set name, site settings enabled, metadata");
      break;
    case 500:
            console.error("🔴 Server Error (500):", errorMessage);
            console.log("💡 Check: Server logs, relationship integrity, business logic");
      break;
        default:
            console.error(`🔴 HTTP ${status}:`, errorMessage);
  }
}
```

### Diagnostic Checklist
```javascript
// Web API Diagnostic Checklist
const diagnostics = {
    // 1. Test basic connectivity
    testConnectivity: () => fetch('/_api/').then(r => r.json()),
    
    // 2. Check metadata
    testMetadata: () => fetch('/_api/$metadata').then(r => r.text()),
    
    // 3. Test entity access
    testEntity: (entitySet) => fetch(`/_api/${entitySet}?$top=1`).then(r => r.json()),
    
    // 4. Test with authentication
    testWithAuth: (url) => webapi.safeAjax({ type: "GET", url })
};
```

## Best Practices (Microsoft Recommended)

### Configuration Management
1. **Single Source of Truth**: One table permission record per entity
2. **Consistent Naming**: Use standard entity set naming conventions
3. **Progressive Restrictions**: Start with `*` fields, then restrict gradually
4. **Version Control**: Track permission changes in source control

### Security Considerations
1. **Least Privilege**: Grant minimum required permissions
2. **Web Role Hygiene**: Regularly audit web role assignments
3. **Field Security**: Use field-level restrictions for sensitive data
4. **Audit Trail**: Monitor API access patterns

### Performance Optimization
1. **Cache Metadata**: Retrieve `$metadata` once and cache
2. **Selective Fields**: Use `$select` to limit returned data
3. **Paging**: Implement proper paging for large datasets
4. **Batch Requests**: Use `$batch` for multiple operations

### Troubleshooting Workflow
1. **Verify Site Settings**: Check all required Web API settings
2. **Test Basic Access**: Start with simple `?$top=1` queries
3. **Check Permissions**: Verify table permissions and web roles
4. **Examine Metadata**: Confirm entity appears in `/_api/$metadata`
5. **Progressive Testing**: Add complexity gradually (filters, expands, etc.)

## Real-World Case Study: cr129_riskctrls Resolution

**Problem**: `/_api/cr129_riskctrls` returned 403/400 errors consistently
**Root Cause**: Multiple conflicting permission records
**Solution Applied**:
1. Removed duplicate `Web-API-RiskCtrl-Simple.tablepermission.yml`
2. Set `Webapi/cr129_riskctrl/fields: "*"`
3. Optimized main permission record to read-only
4. Published changes via `pac paportal upload --modelVersion 2`

**Result**: API now returns 200 OK with proper data structure

## Additional Resources

### Official Microsoft Documentation
- [Power Pages Web API Overview](https://learn.microsoft.com/en-us/power-pages/configure/web-api-overview)
- [Table Permissions](https://learn.microsoft.com/en-us/power-pages/security/table-permissions)
- [HTTP Requests & Error Handling](https://learn.microsoft.com/en-us/power-pages/configure/web-api-http-requests-handle-errors)
- [Enhanced Data Model](https://learn.microsoft.com/en-us/power-pages/admin/enhanced-data-model)

### Community Resources
- [Softchief CRUD Operations Guide](https://softchief.com/2021/06/10/create-update-delete-records-from-power-portals-using-web-api/)
- [Dynamics Community Troubleshooting](https://community.dynamics.com/blogs/post/?postid=1f501eba-49f4-41cd-b477-0a6acda2c6ef)

### CLI Tools
- [Power Platform CLI](https://learn.microsoft.com/en-us/power-platform/developer/cli/introduction)
- Enhanced Data Model Upload: `pac paportal upload --modelVersion 2`