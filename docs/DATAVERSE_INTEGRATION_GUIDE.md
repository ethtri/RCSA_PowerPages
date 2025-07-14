# Power Pages Dataverse Integration Guide

## 🎯 **Overview**

This guide provides a comprehensive approach to implement Dataverse Web API integration on Power Pages screens, based on our successful implementation in Risk Identification V2. **This document contains critical learnings from debugging and resolving real-world Web API issues.**

## 🏗️ **Architecture Overview**

### **Components**
1. **Web API Wrapper Template** - Handles authentication and token management
2. **Site Settings** - Enable Web API globally and per-table
3. **Table Permissions** - Control access with Web API checkbox
4. **Page Implementation** - JavaScript using webapi.safeAjax()

### **Data Flow**
```
User Action → JavaScript → webapi.safeAjax() → shell.getTokenDeferred() → Dataverse Web API → Database
```

## 🚨 **CRITICAL SUCCESS FACTORS** 

### **1. Option Set Values Must Match Dataverse Schema**
❌ **Common Mistake**: Using large option set values (e.g., `756150000`) in Web API calls
✅ **Correct Approach**: Use the actual Dataverse values (e.g., `0`, `1`, `2`, `3`, `4`)

**Example - Risk Category Field**:
```javascript
// ❌ WRONG - Will cause 400 Bad Request
cr129_riskcategory: 756150000

// ✅ CORRECT - Matches Dataverse schema
cr129_riskcategory: 0  // Operational
cr129_riskcategory: 1  // Fraud
cr129_riskcategory: 2  // Technology
cr129_riskcategory: 3  // Credit
cr129_riskcategory: 4  // Compliance
```

### **2. POST Requests Need 'Prefer: return=representation' Header**
❌ **Default Behavior**: Dataverse returns `204 No Content` with no response body
✅ **Required Header**: Add `Prefer: return=representation` to get the created record back

```javascript
// ✅ CORRECT - Returns full record including ID
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
```

### **3. Relationship Permissions Require Append/AppendTo**
❌ **403 Forbidden**: "You don't have permission to associate or disassociate table"
✅ **Solution**: Enable `adx_append: true` and `adx_appendto: true` on BOTH related tables

**Table Permissions Example**:
```yaml
# Risk table permissions
adx_append: true
adx_appendto: true

# Process table permissions (for relationship)
adx_append: true      # CRITICAL - Was missing!
adx_appendto: true    # CRITICAL - Was missing!
```

### **4. Always Use Defensive Programming**
❌ **Unsafe**: `response.cr129_riskid` (crashes if response is undefined)
✅ **Safe**: `response && response.cr129_riskid ? response.cr129_riskid : 'fallback'`

```javascript
// ✅ DEFENSIVE PROGRAMMING
const newRisk = {
  id: response && response.cr129_riskid ? response.cr129_riskid : 'temp-' + Date.now(),
  // ... other fields
};
```

## 🔧 **One-Time Setup (Already Done)**

### **1. Web API Wrapper Template**
**Location**: Portal Management App → Content → Web Templates → "Portal Web API Wrapper"

**Purpose**: Provides `webapi.safeAjax()` method with proper authentication

**Key Features**:
- Uses Microsoft's recommended `shell.getTokenDeferred()` pattern
- Automatic token management
- Promise-based error handling
- Fallback mechanisms

### **2. Global Site Settings**
**Location**: Portal Management App → Site Settings

**Required Settings**:
```
Webapi/Enabled = true
Webapi/error/innererror = true (optional, for debugging)
```

## 📋 **Per-Screen Implementation Checklist**

### **Step 1: Identify Your Dataverse Table**
- **Table Name**: e.g., `cr129_assessment`, `cr129_control`
- **Key Fields**: List fields you need to read/write
- **Logical Name**: Confirm the exact logical name

### **Step 2: Configure Table-Specific Settings**
**Location**: Portal Management App → Site Settings

**Required Settings**:
```
Webapi/[table_logical_name]/enabled = true
Webapi/[table_logical_name]/fields = field1,field2,field3,...
```

**Example for Assessment table**:
```
Webapi/cr129_assessment/enabled = true
Webapi/cr129_assessment/fields = cr129_assessmentid,cr129_assessmenttitle,cr129_status,cr129_processname
```

### **Step 3: Create Table Permissions**
**Location**: Portal Management App → Security → Table Permissions

**Configuration**:
- **Name**: `[TableName] - Web API Access`
- **Table**: Select your table
- **Access Type**: Global or Contact-based
- **Privileges**: Read, Write, Create, Delete (as needed)
- **Web Role**: Authenticated Users
- **🚨 CRITICAL**: Check the **"Web API"** checkbox!

### **Step 4: Implement Page Code**

#### **A. Include the Web API Wrapper**
Add this at the top of your page template:
```liquid
{% include 'Portal Web API Wrapper' %}
```

#### **B. Add CSRF Token Support**
```html
{% if user %}
  <input type="hidden" name="__RequestVerificationToken" value="{{ request.verification_token }}" />
{% endif %}
```

#### **C. JavaScript Implementation**

**Basic Pattern**:
```javascript
// Check if Web API is available
if (typeof webapi !== 'undefined' && webapi.safeAjax) {
  // Use Web API
  webapi.update('cr129_yourtable', recordId, data)
    .done(function(response) {
      console.log('✅ Success:', response);
      // Handle success
    })
    .fail(function(xhr, status, error) {
      console.error('❌ Error:', xhr.status, xhr.statusText);
      // Handle error
    });
} else {
  console.error('Web API not available');
  // Fallback logic
}
```

## 🛠️ **Common Operations**

### **1. Read Data (GET)**
```javascript
// Get all records
webapi.get('cr129_yourtable')
  .done(function(response) {
    console.log('Records:', response.value);
  });

// Get specific record
webapi.get('cr129_yourtable', recordId)
  .done(function(response) {
    console.log('Record:', response);
  });
```

### **2. Update Data (PATCH)**
```javascript
const data = {
  cr129_fieldname: 'new value',
  cr129_anotherfield: 123
};

webapi.update('cr129_yourtable', recordId, data)
  .done(function(response) {
    console.log('Updated successfully');
  })
  .fail(function(xhr) {
    console.error('Update failed:', xhr.status, xhr.statusText);
  });
```

### **3. Create Data (POST)**
```javascript
const data = {
  cr129_fieldname: 'value',
  cr129_anotherfield: 456
};

webapi.create('cr129_yourtable', data)
  .done(function(response) {
    console.log('Created successfully, ID:', response.id);
  });
```

### **4. Delete Data (DELETE)**
```javascript
webapi.delete('cr129_yourtable', recordId)
  .done(function(response) {
    console.log('Deleted successfully');
  });
```

## 🔍 **Debugging and Testing**

### **Comprehensive Test Function Template**
Add this to any page for systematic testing:
```javascript
function testWebApi() {
  console.log('🧪 COMPREHENSIVE WEB API DIAGNOSTIC TEST');
  console.log('==========================================');
  
  // 1. Check basic availability
  console.log('1. BASIC AVAILABILITY CHECK:');
  console.log('🔍 webapi object:', typeof webapi !== 'undefined' ? webapi : 'Not available');
  console.log('🔍 webapi.safeAjax:', typeof webapi !== 'undefined' && webapi.safeAjax ? 'Available' : 'Not available');
  console.log('🔍 shell object:', typeof shell !== 'undefined' ? shell : 'Not available');
  console.log('🔍 shell.getTokenDeferred:', typeof shell !== 'undefined' && shell.getTokenDeferred ? 'Available' : 'Not available');
  console.log('🔍 jQuery:', typeof $ !== 'undefined' ? $.fn.jquery : 'Not available');
  console.log('🔍 Request token:', document.querySelector('input[name="__RequestVerificationToken"]')?.value || 'Not found');
  
  // 2. Test GET request first
  console.log('\n2. TESTING GET REQUEST:');
  if (typeof webapi !== 'undefined' && webapi.safeAjax) {
    webapi.safeAjax({
      url: "/_api/cr129_yourtable", // Replace with your table
      type: "GET",
      contentType: "application/json; charset=utf-8"
    })
    .done(function(response) {
      console.log('✅ GET request successful:', response);
      
      // 3. Test simple POST without relationships
      console.log('\n3. TESTING SIMPLE POST (no relationships):');
      const simpleData = {
        cr129_fieldname: "Test Record - " + new Date().toISOString(),
        // Add your fields here with CORRECT option set values
      };
      
      webapi.safeAjax({
        url: "/_api/cr129_yourtable",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        headers: {
          'OData-Version': '4.0',
          'Prefer': 'return=representation'  // CRITICAL!
        },
        data: JSON.stringify(simpleData)
      })
      .done(function(response) {
        console.log('✅ Simple POST successful:', response);
        alert('✅ Simple POST works!');
        
        // Clean up - delete the test record
        if (response && response.cr129_yourtableid) {
          webapi.safeAjax({
            url: "/_api/cr129_yourtable(" + response.cr129_yourtableid + ")",
            type: "DELETE",
            headers: { 'If-Match': '*' }
          })
          .done(function() {
            console.log('🗑️ Test record cleaned up');
          });
        }
      })
      .fail(function(xhr, status, error) {
        console.error('❌ Simple POST failed:', {
          status: xhr.status,
          statusText: xhr.statusText,
          responseText: xhr.responseText,
          headers: xhr.getAllResponseHeaders()
        });
        alert(`❌ Simple POST failed: ${xhr.status} ${xhr.statusText}`);
      });
      
    })
    .fail(function(xhr, status, error) {
      console.error('❌ GET request failed:', {
        status: xhr.status,
        statusText: xhr.statusText,
        responseText: xhr.responseText,
        headers: xhr.getAllResponseHeaders()
      });
      alert(`❌ GET request failed: ${xhr.status} ${xhr.statusText}`);
    });
  } else {
    console.error('❌ webapi.safeAjax not available');
    alert('❌ webapi.safeAjax not available. Web API wrapper failed to load.');
  }
}
```

### **Error Codes and Solutions**

| Error Code | Common Cause | Solution |
|------------|--------------|----------|
| **400 Bad Request** | Wrong option set values (e.g., using `756150000` instead of `0-4`) | Check Dataverse schema for correct values |
| **401 Unauthorized** | Site settings not configured | Enable `Webapi/Enabled = true` |
| **403 Forbidden (Basic)** | Table permissions missing | Add table permissions with Web API enabled |
| **403 Forbidden (Relationship)** | Missing append permissions | Enable `adx_append: true` and `adx_appendto: true` on BOTH tables |
| **404 Not Found** | Wrong table/entity name | Verify table logical name (e.g., `cr129_risks` not `cr129_risk`) |
| **Response is undefined** | Missing `Prefer` header | Add `Prefer: return=representation` to POST requests |

### **Debugging Checklist**
When Web API fails, check in this order:

1. **✅ Basic Setup**
   - [ ] `webapi` object available in console
   - [ ] `shell.getTokenDeferred` available
   - [ ] CSRF token present in page
   - [ ] Web API wrapper template included

2. **✅ Configuration**
   - [ ] `Webapi/Enabled = true` in site settings
   - [ ] Table-specific settings: `Webapi/cr129_yourtable/enabled = true`
   - [ ] Table permissions exist with Web API enabled
   - [ ] Append/AppendTo permissions for relationships

3. **✅ Data Format**
   - [ ] Option set values match Dataverse schema (0-4, not large numbers)
   - [ ] Field names match exactly (case-sensitive)
   - [ ] Required headers included (`Prefer: return=representation`)
   - [ ] Relationship syntax correct (`@odata.bind`)

4. **✅ Error Handling**
   - [ ] Defensive programming (null checks)
   - [ ] Proper error logging with full xhr details
   - [ ] Fallback mechanisms for failed operations

## 📝 **Implementation Template**

### **For New Screens**:

1. **Copy this checklist**:
   - [ ] Identify table and fields
   - [ ] Add site settings for table
   - [ ] Create table permissions with Web API checkbox
   - [ ] Include Web API wrapper in page
   - [ ] Add CSRF token
   - [ ] Implement JavaScript with webapi.safeAjax()
   - [ ] Test with debug function

2. **Use this code template**:
```javascript
// Save function template
function saveRecord(recordId, formData) {
  console.log('💾 Saving record:', recordId, formData);
  
  // Show loading state
  const saveBtn = document.getElementById('saveButton');
  saveBtn.disabled = true;
  saveBtn.innerHTML = 'Saving...';
  
  // Prepare data
  const data = {
    cr129_field1: formData.field1,
    cr129_field2: formData.field2
    // Add your fields here
  };
  
  // Save via Web API
  if (typeof webapi !== 'undefined' && webapi.safeAjax) {
    webapi.update('cr129_yourtable', recordId, data)
      .done(function(response) {
        console.log('✅ Saved successfully');
        // Show success message
        showSuccessMessage('Record saved successfully!');
        // Update UI
        updateLocalData(recordId, data);
      })
      .fail(function(xhr) {
        console.error('❌ Save failed:', xhr.status, xhr.statusText);
        // Show error message
        showErrorMessage(`Save failed: ${xhr.status} ${xhr.statusText}`);
      })
      .always(function() {
        // Restore button
        saveBtn.disabled = false;
        saveBtn.innerHTML = 'Save';
      });
  } else {
    console.error('Web API not available');
    showErrorMessage('Web API not available');
    saveBtn.disabled = false;
    saveBtn.innerHTML = 'Save';
  }
}
```

## 🎯 **Best Practices**

### **1. Error Handling**
- Always include `.fail()` handlers
- Provide user-friendly error messages
- Log detailed errors to console
- Implement fallback mechanisms

### **2. User Experience**
- Show loading states during operations
- Provide immediate feedback
- Update UI optimistically
- Handle network failures gracefully

### **3. Security**
- Never expose sensitive data in client-side code
- Use table permissions to control access
- Validate data on both client and server
- Follow principle of least privilege

### **4. Performance**
- Batch operations when possible
- Cache frequently accessed data
- Use pagination for large datasets
- Implement proper loading states

## 📚 **Reference**

### **RCSA Schema Patterns**
- **Tables**: `cr129_[displayname]` (e.g., `cr129_risk`, `cr129_assessment`)
- **Fields**: `cr129_[fieldname]` (e.g., `cr129_risktitle`, `cr129_status`)
- **Lookups**: Use proper relationship names

### **Working Example**
See **Risk Identification V2** page for a complete working implementation:
- File: `web-pages/risk-identification-v2/content-pages/Risk-Identification-V2.en-US.webpage.copy.html`
- Demonstrates all patterns and best practices

### **Resources**
- [Pascalcase Web API Guide](https://pascalcase.com/Home/Blog/how-to-set-up-web-api-in-power-pages)
- [Microsoft Power Pages Web API Documentation](https://docs.microsoft.com/en-us/power-pages/configure/web-api)

---

## 🚀 **Quick Start for Next Screen**

1. **Identify your table**: `cr129_[tablename]`
2. **Add site settings**: `Webapi/cr129_[tablename]/enabled = true`
3. **Create table permissions**: Check Web API checkbox!
4. **Copy JavaScript pattern** from Risk Identification V2
5. **Test with debug function**
6. **Deploy and verify**

**You're now ready to implement Web API on any screen! 🎉** 