# Power Pages Web API Best Practices

## 🎯 **Critical Success Factors**

Based on our successful implementation of Risk Identification V2 and resolution of real-world Web API issues.

## 🚨 **MUST-FOLLOW Rules**

### **1. Option Set Values - Schema Alignment**

**❌ WRONG APPROACH:**
```javascript
// Using large option set values from forms
cr129_riskcategory: 756150000  // Will cause 400 Bad Request
```

**✅ CORRECT APPROACH:**
```javascript
// Use actual Dataverse schema values
cr129_riskcategory: 0  // Operational
cr129_riskcategory: 1  // Fraud
cr129_riskcategory: 2  // Technology
cr129_riskcategory: 3  // Credit
cr129_riskcategory: 4  // Compliance
```

**How to Find Correct Values:**
1. Check `solution-src/RCSA_POC_V2/src/Entities/[TableName]/Entity.xml`
2. Look for `<option value="X">` in the optionset definition
3. Use the `value` attribute, not the large option set numbers

### **2. POST Requests - Return Data**

**❌ DEFAULT BEHAVIOR:**
```javascript
webapi.create('cr129_risks', data)
  .done(function(response) {
    console.log(response.cr129_riskid); // ❌ CRASHES - response is undefined
  });
```

**✅ REQUIRED HEADERS:**
```javascript
webapi.safeAjax({
  url: "/_api/cr129_risks",
  type: "POST",
  contentType: "application/json; charset=utf-8",
  headers: {
    'OData-Version': '4.0',
    'Prefer': 'return=representation'  // CRITICAL!
  },
  data: JSON.stringify(data)
})
.done(function(response) {
  console.log(response.cr129_riskid); // ✅ WORKS - response contains full record
});
```

### **3. Relationship Permissions - Both Tables**

**❌ COMMON MISTAKE:**
```yaml
# Risk table permissions
adx_append: true
adx_appendto: true

# Process table permissions
adx_append: false     # ❌ MISSING - Causes 403 Forbidden
adx_appendto: false   # ❌ MISSING - Causes 403 Forbidden
```

**✅ CORRECT CONFIGURATION:**
```yaml
# Risk table permissions
adx_append: true
adx_appendto: true

# Process table permissions (for relationships)
adx_append: true      # ✅ REQUIRED for associations
adx_appendto: true    # ✅ REQUIRED for associations
```

### **4. Defensive Programming - Always**

**❌ UNSAFE CODE:**
```javascript
const newRisk = {
  id: response.cr129_riskid,  // ❌ CRASHES if response is undefined
  title: formData.title
};
```

**✅ SAFE CODE:**
```javascript
const newRisk = {
  id: response && response.cr129_riskid ? response.cr129_riskid : 'temp-' + Date.now(),
  title: formData.title
};
```

## 🏗️ **Web API Wrapper Implementation**

### **Enhanced Create Method**
```javascript
window.webapi.create = function(entitySetName, data, options) {
  return window.webapi.safeAjax($.extend({
    url: '/_api/' + entitySetName,
    type: 'POST',
    contentType: 'application/json; charset=utf-8',
    headers: {
      'OData-Version': '4.0',
      'Prefer': 'return=representation'  // Always include this
    },
    data: JSON.stringify(data)
  }, options));
};
```

### **Fallback Web API Implementation**
For pages where the template might not load:
```javascript
// Check if Web API wrapper loaded successfully
if (typeof webapi === 'undefined' || !webapi.safeAjax) {
  console.warn('🔄 Web API wrapper not loaded, creating fallback implementation...');
  
  window.webapi = window.webapi || {};
  
  window.webapi.safeAjax = function(options) {
    var deferred = $.Deferred();
    
    // Use Power Pages' built-in token management
    if (typeof shell !== 'undefined' && shell.getTokenDeferred) {
      shell.getTokenDeferred().done(function(token) {
        options.headers = options.headers || {};
        options.headers["__RequestVerificationToken"] = token;
        console.log('✅ Using shell.getTokenDeferred token for Web API call');
        $.ajax(options).done(deferred.resolve).fail(deferred.reject);
      }).fail(function(error) {
        console.error('❌ Failed to get token from shell.getTokenDeferred:', error);
        deferred.reject(error);
      });
    } else {
      // Fallback for when shell is not available
      console.warn('⚠️ shell.getTokenDeferred not available, using fallback token method');
      options.headers = options.headers || {};
      var token = $('input[name="__RequestVerificationToken"]').val();
      if (token) {
        options.headers["__RequestVerificationToken"] = token;
        console.log('✅ Using fallback token for Web API call');
      } else {
        console.error('❌ No token found for Web API call');
      }
      $.ajax(options).done(deferred.resolve).fail(deferred.reject);
    }
    
    return deferred.promise();
  };
  
  // Add convenience methods
  window.webapi.create = function(entitySetName, data, options) {
    return window.webapi.safeAjax($.extend({
      url: '/_api/' + entitySetName,
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      headers: {
        'OData-Version': '4.0',
        'Prefer': 'return=representation'
      },
      data: JSON.stringify(data)
    }, options));
  };
  
  console.log('✅ Fallback Web API wrapper created successfully');
}
```

## 🔍 **Error Handling Patterns**

### **Comprehensive Error Logging**
```javascript
.fail(function(xhr, status, error) {
  console.error('❌ Web API Error Details:', {
    status: xhr.status,
    statusText: xhr.statusText,
    responseText: xhr.responseText,
    headers: xhr.getAllResponseHeaders(),
    url: xhr.responseURL || 'unknown',
    method: 'POST'
  });
  
  // Try to parse error response
  try {
    const errorResponse = JSON.parse(xhr.responseText);
    console.error('❌ Parsed error response:', errorResponse);
    if (errorResponse.error && errorResponse.error.message) {
      showUserError(errorResponse.error.message);
    }
  } catch (e) {
    console.error('❌ Could not parse error response as JSON');
    showUserError(`Request failed: ${xhr.status} ${xhr.statusText}`);
  }
})
```

### **Graceful Degradation**
```javascript
// Try Web API first, fall back to session storage
if (typeof webapi !== 'undefined' && webapi.safeAjax) {
  // Primary: Save to Dataverse
  webapi.create('cr129_risks', riskData)
    .done(function(response) {
      // Success: Also save to session storage as backup
      saveToSessionStorage(response);
      showSuccessMessage('Risk saved to database');
    })
    .fail(function(xhr) {
      console.error('Web API failed, using local storage fallback');
      // Fallback: Save to session storage only
      saveToSessionStorage(riskData);
      showWarningMessage('Risk saved locally (database unavailable)');
    });
} else {
  // Fallback: Session storage only
  saveToSessionStorage(riskData);
  showInfoMessage('Risk saved locally');
}
```

## 📋 **Pre-Implementation Checklist**

Before implementing Web API on any new screen:

### **1. Schema Research**
- [ ] Identify exact table logical name (e.g., `cr129_assessment`)
- [ ] List all fields you need to read/write
- [ ] Document option set values from Entity.xml
- [ ] Identify any lookup relationships
- [ ] Check for required fields

### **2. Configuration Setup**
- [ ] Add site settings: `Webapi/[tablename]/enabled = true`
- [ ] Add site settings: `Webapi/[tablename]/fields = field1,field2,field3`
- [ ] Create table permissions with Web API enabled
- [ ] Enable append/appendto for relationship tables
- [ ] Test permissions with diagnostic function

### **3. Code Implementation**
- [ ] Include Web API wrapper template
- [ ] Add CSRF token to page
- [ ] Implement fallback Web API wrapper
- [ ] Use correct option set values
- [ ] Add `Prefer: return=representation` headers
- [ ] Implement defensive programming
- [ ] Add comprehensive error handling

### **4. Testing**
- [ ] Test GET requests first
- [ ] Test simple POST without relationships
- [ ] Test POST with relationships
- [ ] Test error scenarios (invalid data, permissions)
- [ ] Test fallback mechanisms

## 🎯 **Success Metrics**

A successful Web API implementation should:
1. ✅ Handle all CRUD operations without errors
2. ✅ Provide meaningful error messages to users
3. ✅ Gracefully degrade when Web API is unavailable
4. ✅ Maintain data consistency between UI and database
5. ✅ Log sufficient debugging information for troubleshooting

## 📚 **Reference Links**

- [Microsoft Dataverse Web API Documentation](https://docs.microsoft.com/en-us/powerapps/developer/data-platform/webapi/)
- [Power Pages Web API Implementation](https://docs.microsoft.com/en-us/power-pages/configure/web-api-overview)
- [OData Prefer Headers](https://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_PreferHeader)

---

**💡 Remember: These patterns were proven through real-world debugging and implementation. Follow them exactly to avoid the pitfalls we encountered.** 