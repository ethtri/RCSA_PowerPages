# Control Mapping Technical Reference
## Complete Entity Schema & Configuration Details

**Created:** 2025-01-15  
**Purpose:** Complete technical reference for debugging N:N relationship issues in Control Mapping  
**Environment:** https://org601a79e1.crm.dynamics.com/  
**Website:** RCSA Copilot - site-5joks  

---

## 1. Entity Logical Names & Schema Names

### Primary Tables
| **Display Name** | **Logical Name** | **EntitySetName (API)** | **Schema Name** |
|------------------|------------------|-------------------------|------------------|
| Risks | `cr129_risk` | `cr129_risks` | `cr129_risk` |
| Controls | `cr129_control` | `cr129_controls` | `cr129_control` |
| Processes | `cr129_proc` | `cr129_processes` | `cr129_proc` |
| Business Units | `cr129_bu` | `cr129_bus` | `cr129_bu` |
| Assessments | `cr129_assess` | `cr129_assesses` | `cr129_assess` |
| Issues | `cr129_issue` | `cr129_issues` | `cr129_issue` |
| Scales | `cr129_scale` | `cr129_scales` | `cr129_scale` |
| KRIs | `cr129_kri` | `cr129_kris` | `cr129_kri` |

### Junction/Relationship Tables
| **Display Name** | **Logical Name** | **EntitySetName (API)** | **Purpose** |
|------------------|------------------|-------------------------|-------------|
| Risk-Control Mappings | `cr129_riskctrl` | `cr129_riskctrls` | Legacy junction table |

### N:N Relationship Schema
| **Relationship Name** | **From Entity** | **To Entity** | **Intersection Table** | **Lookup Column** |
|----------------------|-----------------|---------------|------------------------|-------------------|
| `cr129_risk_cr129_control_cr129_control` | `cr129_risk` | `cr129_control` | `cr129_risk_ctrl` | `cr129_LinkedControls` |

**Note:** The N:N relationship was created in Dataverse to replace the manual junction table approach.

### Exact N:N Relationship Schema Details

**✅ CONFIRMED RELATIONSHIP DETAILS:**
- **Relationship Name:** `cr129_risk_cr129_control_cr129_control`
- **Intersection Table (Hidden):** `cr129_risk_ctrl` 
- **Lookup Column from Risk Table:** `cr129_LinkedControls`
- **Relationship Type:** Many-to-Many (N:N)
- **Created Method:** Dataverse native N:N relationship (not custom junction table)

**Expected Navigation Properties:**
- **From Risk to Controls:** `cr129_LinkedControls` or `cr129_risk_cr129_control_cr129_control`
- **From Control to Risks:** `cr129_control_cr129_risk_cr129_risk` (reverse navigation)

**Intersection Table Details:**
- **Logical Name:** `cr129_risk_ctrl`
- **EntitySetName:** `cr129_risk_ctrls` (predicted)
- **Purpose:** Hidden system table for N:N relationship storage
- **Access:** Should not be directly accessed via Web API

---

## 2. EnableEntitySetNaming Configuration

### Current Configuration: ✅ CUSTOM PLURAL ENDPOINTS

We are using **custom EntitySetName mappings** configured via site settings:

```yaml
# Site Settings Pattern: Webapi/EntitySetName/{logical_name}
Webapi/EntitySetName/cr129_risk: "cr129_risks"
Webapi/EntitySetName/cr129_control: "cr129_controls"
Webapi/EntitySetName/cr129_proc: "cr129_processes"
Webapi/EntitySetName/cr129_riskctrl: "cr129_riskctrls"
Webapi/EntitySetName/cr129_bu: "cr129_bus"
Webapi/EntitySetName/cr129_assess: "cr129_assesses"
Webapi/EntitySetName/cr129_issue: "cr129_issues"
Webapi/EntitySetName/cr129_scale: "cr129_scales"
Webapi/EntitySetName/cr129_kri: "cr129_kris"
```

### API Endpoints in Use:
```
/_api/cr129_risks          (Risk records)
/_api/cr129_controls       (Control records)
/_api/cr129_processes      (Process records)
/_api/cr129_riskctrls      (Legacy junction table)
/_api/cr129_bus            (Business Unit records)
/_api/cr129_assesses       (Assessment records)
/_api/cr129_issues         (Issue records)
/_api/cr129_scales         (Scale records)
/_api/cr129_kris           (KRI records)
```

---

## 3. $metadata Snippet

### Known Issue: $metadata Endpoint Returns 500 Error

**Current Status:** `/_api/$metadata` returns **500 Internal Server Error**

**Error Details:**
```
GET https://site-5joks.powerappsportals.com/_api/$metadata
Status: 500 (Internal Server Error)
```

**This prevents us from getting the exact EntityType definitions and NavigationProperty entries.**

### Expected EntityType Structure (Based on Dataverse Schema):

```xml
<!-- Expected structure for cr129_risk -->
<EntityType Name="cr129_risk">
  <Key>
    <PropertyRef Name="cr129_riskid" />
  </Key>
  <Property Name="cr129_riskid" Type="Edm.Guid" Nullable="false" />
  <Property Name="cr129_risktitle" Type="Edm.String" />
  <Property Name="cr129_riskcategory" Type="Edm.Int32" />
  <Property Name="cr129_inherentl" Type="Edm.Int32" />
  <Property Name="cr129_inherenti" Type="Edm.Int32" />
  
  <!-- Navigation Properties for N:N Relationship -->
  <NavigationProperty Name="cr129_risk_cr129_control_cr129_control" 
                      Type="Collection(cr129_control)" 
                      Partner="cr129_control_cr129_risk_cr129_risk" />
</EntityType>

<!-- Expected structure for cr129_control -->
<EntityType Name="cr129_control">
  <Key>
    <PropertyRef Name="cr129_controlid" />
  </Key>
  <Property Name="cr129_controlid" Type="Edm.Guid" Nullable="false" />
  <Property Name="cr129_controltitle" Type="Edm.String" />
  <Property Name="cr129_controltype" Type="Edm.Int32" />
  <Property Name="cr129_designefficiency" Type="Edm.Int32" />
  <Property Name="cr129_operationalefficiency" Type="Edm.Int32" />
  
  <!-- Navigation Properties for N:N Relationship -->
  <NavigationProperty Name="cr129_control_cr129_risk_cr129_risk" 
                      Type="Collection(cr129_risk)" 
                      Partner="cr129_risk_cr129_control_cr129_control" />
</EntityType>
```

**Action Required:** Fix the $metadata endpoint to get exact navigation property names.

### $metadata Response (Once Fixed)

**Status:** ❌ **PENDING - $metadata endpoint currently returns 500 error**

**Expected Response Structure:**
Once the $metadata endpoint is fixed, we need to capture the exact `<NavigationProperty>` entries:

```xml
<!-- EXPECTED: cr129_risk EntityType -->
<EntityType Name="cr129_risk">
  <Key>
    <PropertyRef Name="cr129_riskid" />
  </Key>
  <!-- Properties omitted for brevity -->
  
  <!-- CRITICAL: Need exact NavigationProperty name -->
  <NavigationProperty Name="cr129_LinkedControls" 
                      Type="Collection(cr129_control)" 
                      Partner="[REVERSE_PROPERTY_NAME]" />
  <!-- OR -->
  <NavigationProperty Name="cr129_risk_cr129_control_cr129_control" 
                      Type="Collection(cr129_control)" 
                      Partner="[REVERSE_PROPERTY_NAME]" />
</EntityType>

<!-- EXPECTED: cr129_control EntityType -->
<EntityType Name="cr129_control">
  <Key>
    <PropertyRef Name="cr129_controlid" />
  </Key>
  <!-- Properties omitted for brevity -->
  
  <!-- CRITICAL: Need exact reverse NavigationProperty name -->
  <NavigationProperty Name="[REVERSE_PROPERTY_NAME]" 
                      Type="Collection(cr129_risk)" 
                      Partner="cr129_LinkedControls" />
</EntityType>
```

**ACTION REQUIRED:** 
1. Fix $metadata 500 error
2. Capture exact `<NavigationProperty Name="...">` values
3. Update JavaScript code with correct property names

---

## 4. Site Settings - Web API Configuration

### Current Site Settings (Deployed):

```yaml
# Risk Table Web API Settings
- adx_name: Webapi/cr129_risk/enabled
  adx_value: true

- adx_name: Webapi/cr129_risk/fields
  adx_value: "*"

- adx_name: Webapi/cr129_risk/disableodatafilter
  adx_value: false

# Control Table Web API Settings  
- adx_name: Webapi/cr129_control/enabled
  adx_value: true

- adx_name: Webapi/cr129_control/fields
  adx_value: "*"

- adx_name: Webapi/cr129_control/disableodatafilter
  adx_value: false

# Controls (Plural) Web API Settings
- adx_name: Webapi/cr129_controls/enabled
  adx_value: true

- adx_name: Webapi/cr129_controls/fields
  adx_value: "*"

- adx_name: Webapi/cr129_controls/disableodatafilter
  adx_value: false

# Risk (Plural) Web API Settings
- adx_name: Webapi/cr129_risks/enabled
  adx_value: true

- adx_name: Webapi/cr129_risks/fields
  adx_value: "*"

- adx_name: Webapi/cr129_risks/disableodatafilter
  adx_value: false

# EntitySetName Mappings
- adx_name: Webapi/EntitySetName/cr129_risk
  adx_value: cr129_risks

- adx_name: Webapi/EntitySetName/cr129_control
  adx_value: cr129_controls

# Cache Invalidation
- adx_name: Webapi/CacheInvalidation
  adx_value: "2025-01-15-20:30:00"
```

### Global Web API Settings:
```yaml
- adx_name: Webapi/error/innererror
  adx_value: true
```

### Site Setting Coverage for the Intersection Table

**Status:** ⚠️ **MISSING - Intersection table Web API settings not configured**

The intersection table `cr129_risk_ctrl` may need Web API settings if direct access is required:

```yaml
# MISSING: Intersection Table Web API Settings
- adx_name: Webapi/cr129_risk_ctrl/enabled
  adx_value: true

- adx_name: Webapi/cr129_risk_ctrl/fields
  adx_value: "*"

- adx_name: Webapi/cr129_risk_ctrl/disableodatafilter
  adx_value: false

# MISSING: EntitySetName mapping for intersection
- adx_name: Webapi/EntitySetName/cr129_risk_ctrl
  adx_value: cr129_risk_ctrls
```

**Note:** For native N:N relationships, direct intersection table access is typically not required. The Web API should handle associations through the primary entity endpoints. However, if $expand queries are internally hitting the intersection table, these settings may be needed.

**ACTION REQUIRED:** 
- Test if intersection table Web API settings are needed
- Add if 403/500 errors persist after primary table fixes

---

## 5. Table Permission Rules

### Current Table Permissions (Configured):

#### Risk Table Permissions
```yaml
# File: table-permissions/Web-API-Risk.tablepermission.yml
adx_tablename: cr129_risk
adx_name: Web API Risk
adx_read: true
adx_write: true
adx_create: true
adx_delete: true
adx_appendto: true
adx_append: true
adx_scope: Global
# Web API checkbox: ✅ Enabled
```

#### Control Table Permissions
```yaml
# File: table-permissions/Web-API-Control.tablepermission.yml
adx_tablename: cr129_control
adx_name: Web API Control
adx_read: true
adx_write: true
adx_create: true
adx_delete: true
adx_appendto: true
adx_append: true
adx_scope: Global
# Web API checkbox: ✅ Enabled
```

### Web Role Associations
**Current Issue:** Table permissions may not be properly associated with authenticated user web roles.

**Diagnostic Needed:**
- Verify current user has proper web role assignment
- Confirm table permissions are linked to the correct web roles
- Check if Global scope is appropriate or if Contact scope is needed

### Plugin / Business-Rule Hooks

**Status:** ❓ **UNKNOWN - Requires investigation**

**Potential Issue:** Server-side plugins or business rules firing on Associate/Disassociate messages can cause 500 Internal Server Errors.

**Investigation Required:**
```
Check for plugins/workflows on:
- Associate Message on cr129_risk_cr129_control_cr129_control relationship
- Disassociate Message on cr129_risk_cr129_control_cr129_control relationship
- Create/Update/Delete on cr129_risk_ctrl intersection table
- Business Rules on cr129_risk or cr129_control tables
```

**Common Plugin Issues:**
- **Synchronous plugins** throwing exceptions during Associate/Disassociate
- **Business rules** with invalid logic triggered by relationship changes  
- **Workflow steps** failing during N:N operations
- **Custom validation logic** rejecting valid relationship data

**ACTION REQUIRED:**
1. Check Solution Components for plugins on relationship operations
2. Review Business Rules on Risk and Control tables
3. Test Associate/Disassociate operations in Dataverse directly (bypassing Power Pages)
4. Disable plugins temporarily to isolate Web API vs. platform issues

### Permissions in Practice

**Status:** ❓ **REQUIRES VERIFICATION**

**Current Test Scenario:**
- **Test User:** `etrifari@captechventures.com` (from console logs)
- **Authentication Method:** Microsoft Entra ID (Azure AD)
- **Expected Web Role:** [UNKNOWN - needs verification]

**Diagnostic Questions:**
1. **Which web role is the test user actually assigned to?**
   - Check in Power Pages Management for user role assignments
   - Verify role has appropriate table permissions linked

2. **Are table permissions properly linked to web roles?**
   - Confirm Web-API-Risk and Web-API-Control permissions are associated with user's role
   - Check if permissions are inherited from parent roles

3. **Is Global scope appropriate?**
   - Current table permissions use Global scope
   - Consider if Contact scope is more appropriate for security model

**ACTION REQUIRED:**
1. Verify actual web role assignment for test user
2. Confirm table permission associations
3. Test with known working user/role combination
4. Consider scope adjustments if needed

---

## 6. Sample Expand/Associate Call Code

### Current JavaScript Code (Failing):

#### N:N Query (Get Existing Mappings)
```javascript
// Current failing code from Control-Mapping-Overview.js
getRiskMappings: function(riskId) {
    console.log('🔄 Loading N:N risk mappings from Dataverse...');
    console.log('📋 Risk ID:', riskId);
    
    // ❌ FAILING: This query returns 403 Forbidden
    const queryUrl = `/_api/cr129_risks(${riskId})?$expand=cr129_risk_cr129_control_cr129_control($select=cr129_controlid,cr129_controltitle,cr129_controltype,cr129_designefficiency,cr129_operationalefficiency)`;
    
    console.log('🔗 N:N Query URL:', queryUrl);
    
    return webapi.safeAjax({
        type: 'GET',
        url: queryUrl,
        contentType: 'application/json'
    });
}
```

#### N:N Associate (Create Mapping)
```javascript
// Current failing code for creating associations
createMapping: function(riskId, controlId) {
    console.log('🔄 Creating N:N risk-control mapping via Associate API...');
    
    // ❌ FAILING: This returns 500 Internal Server Error
    const associateUrl = `/_api/cr129_risks(${riskId})/cr129_risk_cr129_control_cr129_control/$ref`;
    const targetReference = `/_api/cr129_controls(${controlId})`;
    
    return webapi.safeAjax({
        type: 'POST',
        url: associateUrl,
        data: JSON.stringify({
            "@odata.id": targetReference
        }),
        contentType: 'application/json'
    });
}
```

#### N:N Disassociate (Delete Mapping)
```javascript
// Current failing code for deleting associations
deleteMapping: function(riskId, controlId) {
    // ❌ FAILING: This returns 500 Internal Server Error
    const disassociateUrl = `/_api/cr129_risks(${riskId})/cr129_risk_cr129_control_cr129_control(${controlId})/$ref`;
    
    return webapi.safeAjax({
        type: 'DELETE',
        url: disassociateUrl,
        contentType: 'application/json'
    });
}
```

### Alternative Patterns Tested (All Failed):
```javascript
// Alternative relationship names tested:
// cr129_control_cr129_risk_cr129_control ❌ 400 Bad Request
// cr129_risk_cr129_control ❌ 400 Bad Request  
// cr129_controls ❌ 400 Bad Request
// cr129_risk_controls ❌ 400 Bad Request
```

---

## 7. Full Error Payloads

### Error 1: 403 Forbidden (Basic Table Access)
```
Request: GET /_api/cr129_risks(3be61b40-2f60-f011-bec2-7c1e521687a7)
Status: 403 (Forbidden)
Response Body: [Empty - no detailed error message returned]
```

### Error 2: 500 Internal Server Error ($metadata)
```
Request: GET /_api/$metadata
Status: 500 (Internal Server Error)
Response Body: [Empty - no detailed error message returned]
```

### Error 3: 400 Bad Request (N:N Expand)
```
Request: GET /_api/cr129_risks(3be61b40-2f60-f011-bec2-7c1e521687a7)?$expand=cr129_risk_cr129_control_cr129_control
Status: 400 (Bad Request)
Response Body: [Empty - no detailed error message returned]
```

### Error 4: 500 Internal Server Error (Associate API)
```
Request: POST /_api/cr129_risks(3be61b40-2f60-f011-bec2-7c1e521687a7)/cr129_risk_cr129_control_cr129_control/$ref
Status: 500 (Internal Server Error)
Data: {"@odata.id": "/_api/cr129_controls(controlId)"}
Response Body: [Empty - no detailed error message returned]
```

**Note:** Power Pages Web API appears to not return detailed error messages in response bodies, making debugging challenging.

### Raw Error Details - Enhanced Capture Needed

**Current Status:** ❌ **Limited error details captured**

**Current Error Capture Method:** Browser console and network tab show only status codes

**ACTION REQUIRED - Enhanced Error Capture:**

1. **Enable Full Network Logging:**
   ```javascript
   // Add to browser console for detailed error capture
   fetch('/_api/cr129_risks?$top=1')
     .then(response => response.text())
     .then(text => console.log('Full Response Body:', text))
     .catch(error => console.log('Full Error:', error));
   ```

2. **Capture Full Response Headers:**
   ```javascript
   // Check for additional error headers
   fetch('/_api/cr129_risks?$top=1')
     .then(response => {
       console.log('Status:', response.status);
       console.log('Headers:', [...response.headers.entries()]);
       return response.text();
     })
     .then(text => console.log('Body:', text));
   ```

3. **Use Browser Network Tab:**
   - **Request Headers:** Copy full request headers including authentication
   - **Response Headers:** Look for X-Error-* headers or custom error indicators
   - **Response Body:** Copy full response body even for error status codes

4. **Try Alternative Error Formats:**
   ```javascript
   // Test if JSON error details are available
   fetch('/_api/cr129_risks?$top=1')
     .then(response => response.json())
     .catch(() => response.text())
     .then(data => console.log('Error Data:', data));
   ```

**Expected Enhanced Error Information:**
- Inner exception messages
- OData error codes
- Permission-specific error details
- Plugin exception details (if applicable)

### Alternate Keys or Redirect Rules

**Status:** ❓ **REQUIRES INVESTIGATION**

**Potential Issues:**

1. **Alternate Keys on Risk or Control Tables:**
   ```
   CHECK: Do cr129_risk or cr129_control tables have alternate keys defined?
   - Alternate keys can affect Web API URL patterns
   - May cause unexpected redirects or resolution issues
   ```

2. **URL Rewrites / Redirects:**
   ```
   CHECK: Are there portal URL rewrite rules affecting /_api/* paths?
   - Web Files with redirect rules
   - Custom routing in page templates
   - IIS-level redirects or URL rewriting
   ```

3. **Base URL Configuration:**
   ```
   CHECK: Is the portal's base URL configuration correct?
   - Site settings for portal base URL
   - SSL/TLS configuration
   - Domain/subdomain routing
   ```

**ACTION REQUIRED:**
1. Check table definitions for alternate keys
2. Review portal configuration for URL rewrite rules
3. Test direct API calls with absolute URLs
4. Verify portal base URL settings

### OData Filter Settings - Troubleshooting

**Current Configuration:** `disableodatafilter: false` (OData filtering enabled)

**Troubleshooting Strategy:**

1. **Temporarily Disable OData Filters:**
   ```yaml
   # Test configuration to isolate permission issues
   - adx_name: Webapi/cr129_risk/disableodatafilter
     adx_value: true
   
   - adx_name: Webapi/cr129_control/disableodatafilter
     adx_value: true
   ```

2. **Common OData Filter Issues:**
   - **Complex table permissions** with multiple scopes causing filter conflicts
   - **Relationship traversal** in filters hitting permission boundaries
   - **N:N relationships** with complex permission inheritance

3. **Test Sequence:**
   ```
   Step 1: Set disableodatafilter: true for both tables
   Step 2: Test basic table access (GET /_api/cr129_risks?$top=1)
   Step 3: Test N:N expand (GET /_api/cr129_risks?$expand=...)
   Step 4: If successful, re-enable filters one at a time
   ```

**ACTION REQUIRED:**
1. Deploy with OData filters disabled temporarily
2. Test if 403 errors resolve
3. Isolate whether issue is permissions vs. OData filtering
4. Re-enable gradually to identify specific filter conflicts

---

## 8. Customizations & Environment Details

### Solution Information
- **Solution Name:** RCSA_POC_V2
- **Publisher Prefix:** cr129
- **Managed Solution:** No (unmanaged development)
- **Environment Type:** Dataverse for Power Pages

### Schema Customizations
- **No table renames** - using original Dataverse names
- **No alternate schemas** - standard publisher prefix
- **No managed solution prefixes** - development environment

### Power Pages Settings
- **Entity Permissions Inheritance:** Default (not customized)
- **Portal Version:** 9.3.3.x+ (Enhanced Data Model v2)
- **Authentication:** Microsoft Entra ID (Azure AD)

### Recent Changes
- **N:N Relationship Created:** `cr129_risk_cr129_control_cr129_control` to replace manual junction table
- **Web API Settings:** Recently updated to support both singular and plural endpoints
- **Table Permissions:** Recently updated with Web API checkbox enabled

---

## 9. Diagnostic Actions Needed

### Immediate Actions Required:

1. **Enhanced Error Capture**
   - Use browser console to capture full response bodies and headers
   - Enable detailed network logging for all API calls
   - Document exact error messages and OData error codes

2. **Table Permissions & Web Role Verification**
   - Verify `etrifari@captechventures.com` actual web role assignment
   - Confirm table permissions are linked to user's web role
   - Test with known working user/role combination

3. **Disable OData Filters (Temporary)**
   - Set `disableodatafilter: true` for cr129_risk and cr129_control
   - Test if 403 errors resolve with filters disabled
   - Isolate permissions vs. OData filtering issues

4. **Fix $metadata Endpoint**
   - Investigate why `/_api/$metadata` returns 500 error
   - This is blocking discovery of exact navigation property names
   - Check for plugins or business rules causing metadata issues

5. **Test Navigation Property Names**
   - Once $metadata works, get exact NavigationProperty names
   - Test with `cr129_LinkedControls` (confirmed lookup column name)
   - Update JavaScript code with correct property names

6. **Plugin/Business Rule Investigation**
   - Check for plugins on Associate/Disassociate messages
   - Review business rules on Risk and Control tables
   - Test relationship operations directly in Dataverse

### Enhanced Testing Sequence:
1. **Capture detailed error information** from all API calls
2. **Disable OData filters** and test basic table access
3. **Verify user permissions** and web role assignments
4. **Fix $metadata endpoint** to discover navigation properties
5. **Test N:N operations** with correct property names (`cr129_LinkedControls`)
6. **Investigate plugins/workflows** if 500 errors persist
7. **Re-enable OData filters** gradually to identify conflicts

---

## 10. Success Criteria

### Phase 1: Basic Access
- [ ] `/_api/cr129_risks` returns 200 OK
- [ ] `/_api/cr129_controls` returns 200 OK
- [ ] `/_api/$metadata` returns 200 OK

### Phase 2: N:N Discovery
- [ ] Identify correct navigation property names from $metadata
- [ ] Successfully expand N:N relationships
- [ ] Read existing risk-control mappings

### Phase 3: N:N CRUD
- [ ] Create new risk-control associations
- [ ] Update existing associations
- [ ] Delete risk-control associations

**End Goal:** Complete Control Mapping screen with real data persistence to Dataverse N:N relationships. 