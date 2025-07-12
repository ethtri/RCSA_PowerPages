# Power Pages Dataverse Integration Guide

## 🎯 **Overview**

This guide provides a step-by-step approach to implement Dataverse Web API integration on Power Pages screens, based on our successful implementation in Risk Identification V2.

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

### **Test Function Template**
Add this to any page for testing:
```javascript
function testWebApi() {
  console.log('🧪 Testing Web API setup...');
  console.log('🔍 webapi available:', typeof webapi !== 'undefined');
  console.log('🔍 shell available:', typeof shell !== 'undefined');
  
  if (typeof webapi !== 'undefined' && webapi.get) {
    webapi.get('cr129_yourtable')
      .done(function(response) {
        console.log('✅ Web API test successful:', response);
        alert('✅ Web API is working!');
      })
      .fail(function(xhr) {
        console.error('❌ Web API test failed:', xhr.status, xhr.statusText);
        alert(`❌ Web API failed: ${xhr.status} ${xhr.statusText}`);
      });
  } else {
    alert('❌ Web API not available');
  }
}
```

### **Common Error Codes**
- **401 Unauthorized**: Site settings not configured or Web API not enabled
- **403 Forbidden**: Table permissions missing or Web API checkbox not checked
- **404 Not Found**: Incorrect table name or record ID
- **400 Bad Request**: Invalid data format or field names

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