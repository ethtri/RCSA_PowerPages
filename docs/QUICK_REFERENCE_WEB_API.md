# Power Pages Web API Quick Reference

## 🚀 **5-Minute Setup for New Screens**

### **1. Site Settings (Portal Management App)**
```
Webapi/[table_logical_name]/enabled = true
Webapi/[table_logical_name]/fields = field1,field2,field3,...
```

### **2. Table Permissions**
- **Name**: `[TableName] - Web API Access`
- **Table**: Your table
- **Web Role**: Authenticated Users
- **🚨 CRITICAL**: Check **"Web API"** checkbox!

### **3. Page Code**
```liquid
{% include 'Portal Web API Wrapper' %}
```

```javascript
// UPDATE
webapi.update('cr129_tablename', recordId, data)
  .done(function(response) { /* success */ })
  .fail(function(xhr) { /* error */ });

// CREATE
webapi.create('cr129_tablename', data)
  .done(function(response) { /* success */ });

// READ
webapi.get('cr129_tablename', recordId)
  .done(function(response) { /* success */ });

// DELETE
webapi.delete('cr129_tablename', recordId)
  .done(function(response) { /* success */ });
```

## 🔧 **Copy-Paste Template**

```javascript
function saveRecord(recordId, formData) {
  const data = {
    cr129_field1: formData.field1,
    cr129_field2: formData.field2
  };
  
  if (typeof webapi !== 'undefined' && webapi.safeAjax) {
    webapi.update('cr129_yourtable', recordId, data)
      .done(function(response) {
        console.log('✅ Saved successfully');
        alert('Record saved!');
      })
      .fail(function(xhr) {
        console.error('❌ Error:', xhr.status, xhr.statusText);
        alert(`Error: ${xhr.status} ${xhr.statusText}`);
      });
  } else {
    alert('Web API not available');
  }
}
```

## 🐛 **Debug Function**
```javascript
function testWebApi() {
  if (typeof webapi !== 'undefined' && webapi.get) {
    webapi.get('cr129_yourtable')
      .done(function(response) {
        alert('✅ Web API working!');
      })
      .fail(function(xhr) {
        alert(`❌ Error: ${xhr.status} ${xhr.statusText}`);
      });
  } else {
    alert('❌ Web API not available');
  }
}
```

## 🚨 **Common Issues**
- **401 Error**: Web API checkbox not checked in table permissions
- **403 Error**: Missing table permissions or wrong web role
- **404 Error**: Wrong table name or record ID
- **webapi undefined**: Web API wrapper not included

## 📋 **Checklist**
- [ ] Site settings added
- [ ] Table permissions created with Web API checkbox
- [ ] `{% include 'Portal Web API Wrapper' %}` added
- [ ] JavaScript uses `webapi.safeAjax()`
- [ ] Error handling implemented
- [ ] Tested with debug function 