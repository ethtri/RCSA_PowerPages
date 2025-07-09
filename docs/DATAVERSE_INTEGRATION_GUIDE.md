# Dataverse Integration Guide for Power Pages
## Key Insights and Learnings for RCSA Power Pages V3

### Overview
This document captures the essential patterns, techniques, and best practices for successfully integrating Dataverse data into Power Pages screens. These learnings were developed through the successful implementation of the Dashboard and Process Selection pages and should be used as the foundation for all future screen development.

## 🔑 Core Integration Principles

### 1. Contact-Based Authentication Architecture
**Key Insight**: Power Pages uses Contact records for user authentication, NOT System Users.

```liquid
<!-- Always use user.contactid for authentication -->
{{ user.contactid }}

<!-- NOT user.systemuserid (this doesn't work in Power Pages) -->
```

**Implementation Pattern**:
- All user-related data should link to Contact records via lookup fields
- Use `cr129_assessor` (Contact lookup) instead of email-based filtering
- Contact record contains role and business unit information

### 2. Enhanced Contact Table Structure
**Required Contact Fields** for role-based access:
- `cr129_userrole` (Choice): Analyst=100000000, Manager=100000001, Executive=100000002
- `cr129_businessunitname` (Lookup): Links to Business Unit table
- `cr129_accesslevel` (Choice): Own Process=100000000, Business Unit=100000001, Cross BU=100000002

**Contact Enhancement Pattern**:
```liquid
<!-- Access user role and business unit -->
Role: {{ user.cr129_userrole.value }}
Business Unit: {{ user.cr129_businessunitname.name }}
Access Level: {{ user.cr129_accesslevel.value }}
```

## 🎯 Role-Based Data Filtering Patterns

### Pattern 1: Assessment/Record Filtering
```liquid
<!-- Role-based filtering for assessments -->
{% if user.cr129_userrole.value == 100000000 %}
  <!-- Analyst: See only own records -->
  <condition attribute="cr129_assessor" operator="eq" value="{{ user.contactid }}" />
{% else %}
  <!-- Manager/Executive: See all records in their Business Unit -->
  <condition attribute="cr129_assessor" operator="in">
    <value>{{ user.contactid }}</value>
    <!-- Add other Contact IDs from same Business Unit -->
  </condition>
{% endif %}
```

### Pattern 2: Process Ownership Filtering
```liquid
<!-- Process ownership filtering -->
{% if user.cr129_userrole.value == 100000000 %}
  <!-- Analyst: See only processes they own -->
  <condition attribute="cr129_processowner" operator="eq" value="{{ user.contactid }}" />
{% else %}
  <!-- Manager: See all processes in their Business Unit -->
  <condition attribute="cr129_businessunitname" operator="eq" value="{{ user.cr129_businessunitname.cr129_buid }}" />
{% endif %}
```

## 📊 FetchXML Best Practices

### 1. Essential FetchXML Structure
```liquid
{% fetchxml entityData %}
  <fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">
    <entity name="cr129_entityname">
      <!-- Always include primary key -->
      <attribute name="cr129_entitynameid" />
      
      <!-- Include display fields -->
      <attribute name="cr129_displayname" />
      
      <!-- Include lookup fields -->
      <attribute name="cr129_lookupfield" />
      
      <!-- Include choice fields -->
      <attribute name="cr129_choicefield" />
      
      <!-- Include audit fields -->
      <attribute name="createdon" />
      <attribute name="modifiedon" />
      
      <!-- Role-based filtering -->
      <filter type="and">
        <condition attribute="statecode" operator="eq" value="0" />
        <!-- Add role-based conditions here -->
      </filter>
      
      <!-- Consistent ordering -->
      <order attribute="cr129_displayname" descending="false" />
    </entity>
  </fetch>
{% endfetchxml %}
```

### 2. Choice Field Handling
**Critical Pattern**: Choice fields require `.value` property for numeric comparison and `.label` for display.

```liquid
<!-- Choice field comparison (use .value) -->
{% if record.cr129_status.value == 0 %}
  <span class="badge bg-warning">Draft</span>
{% elsif record.cr129_status.value == 1 %}
  <span class="badge bg-info">Submitted</span>
{% elsif record.cr129_status.value == 2 %}
  <span class="badge bg-warning">Challenged</span>
{% elsif record.cr129_status.value == 3 %}
  <span class="badge bg-success">Agreed</span>
{% endif %}

<!-- Choice field display (use .label) -->
Status: {{ record.cr129_status.label }}
```

### 3. Lookup Field Handling
```liquid
<!-- Lookup field display patterns -->
{% if record.cr129_lookupfield %}
  <!-- Try multiple name properties -->
  {% if record.cr129_lookupfield.fullname %}
    {{ record.cr129_lookupfield.fullname }}
  {% elsif record.cr129_lookupfield.name %}
    {{ record.cr129_lookupfield.name }}
  {% else %}
    {{ record.cr129_lookupfield }}
  {% endif %}
{% else %}
  <span class="text-muted">Not assigned</span>
{% endif %}
```

### 4. DateTime Field Formatting
```liquid
<!-- DateTime formatting using .NET format strings -->
{{ record.createdon | date: "M/d/yyyy" }}
{{ record.modifiedon | date: "M/d/yyyy h:mm tt" }}
```

## 🎨 UI/UX Integration Patterns

### 1. Status Metrics Dashboard Pattern
```liquid
<!-- Calculate metrics from FetchXML results -->
{% assign totalRecords = entityData.results.entities.size %}
{% assign completedCount = 0 %}
{% assign inProgressCount = 0 %}

{% for record in entityData.results.entities %}
  {% if record.cr129_status.value == 3 %}
    {% assign completedCount = completedCount | plus: 1 %}
  {% elsif record.cr129_status.value == 1 or record.cr129_status.value == 2 %}
    {% assign inProgressCount = inProgressCount | plus: 1 %}
  {% endif %}
{% endfor %}

<!-- Display metrics -->
<div class="metrics-card">
  <div class="metric">
    <div class="metric-value">{{ totalRecords }}</div>
    <div class="metric-label">Total</div>
  </div>
  <div class="metric">
    <div class="metric-value">{{ completedCount }}</div>
    <div class="metric-label">Completed</div>
  </div>
</div>
```

### 2. Data Card Display Pattern
```liquid
<!-- Consistent card layout for data display -->
<div class="row">
  {% for record in entityData.results.entities %}
    <div class="col-md-6 col-lg-4 mb-4">
      <div class="card h-100" 
           data-record-id="{{ record.cr129_recordid }}"
           data-record-name="{{ record.cr129_name | escape }}">
        
        <!-- Card Header with Status -->
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="card-title mb-0">{{ record.cr129_name | escape }}</h5>
          
          <!-- Status Badge -->
          {% if record.cr129_status %}
            <span class="badge status-{{ record.cr129_status.value }}">
              {{ record.cr129_status.label }}
            </span>
          {% endif %}
        </div>
        
        <!-- Card Body with Details -->
        <div class="card-body">
          <div class="record-details">
            {% if record.cr129_businessunit %}
              <div class="detail-item">
                <i class="fas fa-building me-2"></i>
                <span class="fw-medium">Business Unit:</span>
                {{ record.cr129_businessunit.name }}
              </div>
            {% endif %}
            
            <div class="detail-item">
              <i class="fas fa-calendar me-2"></i>
              <span class="fw-medium">Updated:</span>
              {{ record.modifiedon | date: "M/d/yyyy" }}
            </div>
          </div>
        </div>
        
        <!-- Card Footer with Actions -->
        <div class="card-footer">
          <button class="btn btn-primary w-100" 
                  onclick="selectRecord(this.closest('.card'))">
            Select Record
          </button>
        </div>
      </div>
    </div>
  {% endfor %}
</div>
```

## 🔧 Debugging and Troubleshooting Patterns

### 1. Comprehensive Debug Panel
**Always include** debug information during development:

```liquid
<!-- Debug Information Panel -->
<div class="mt-5">
  <details class="debug-panel">
    <summary class="fw-bold mb-2">Debug Information</summary>
    
    <!-- Query Results -->
    <div class="row">
      <div class="col-md-6">
        <strong>Query Results:</strong><br>
        Total Records: {{ entityData.results.entities.size }}<br>
        Entity Name: {{ entityData.results.entityname }}<br>
        More Records: {{ entityData.results.morerecords }}<br>
      </div>
      
      <!-- User Context -->
      <div class="col-md-6">
        <strong>User Context:</strong><br>
        Contact ID: {{ user.contactid }}<br>
        Role: {{ user.cr129_userrole.label }} ({{ user.cr129_userrole.value }})<br>
        Business Unit: {{ user.cr129_businessunitname.name }}<br>
        Access Level: {{ user.cr129_accesslevel.label }}<br>
      </div>
    </div>
    
    <!-- Sample Record Data -->
    {% if entityData.results.entities.size > 0 %}
      {% assign firstRecord = entityData.results.entities[0] %}
      <div class="mt-3">
        <strong>Sample Record:</strong><br>
        ID: {{ firstRecord.cr129_recordid }}<br>
        Name: {{ firstRecord.cr129_name }}<br>
        Status: {{ firstRecord.cr129_status.label }} ({{ firstRecord.cr129_status.value }})<br>
        Created: {{ firstRecord.createdon | date: "M/d/yyyy" }}<br>
      </div>
    {% endif %}
  </details>
</div>
```

### 2. Field Existence Checking
```liquid
<!-- Always check if fields exist before using them -->
{% if record.cr129_fieldname %}
  <!-- Field exists, safe to use -->
  {{ record.cr129_fieldname }}
{% else %}
  <!-- Field doesn't exist or is null -->
  <span class="text-muted">Not available</span>
{% endif %}
```

## 🚀 Implementation Workflow for New Screens

### Step 1: Design Data Requirements
1. Identify the primary Dataverse table
2. Determine required fields (display, lookup, choice, audit)
3. Define role-based access requirements
4. Plan user context integration

### Step 2: Create FetchXML Query
1. Start with basic entity and primary key
2. Add required attributes
3. Implement role-based filtering using Contact patterns
4. Add proper ordering

### Step 3: Implement UI Components
1. Use consistent card/table layouts
2. Implement choice field handling with .value/.label
3. Add lookup field fallback logic
4. Include DateTime formatting

### Step 4: Add Debug Information
1. Include comprehensive debug panel
2. Show query results and user context
3. Display sample record data
4. Test with different user roles

### Step 5: Test and Validate
1. Test with different user roles (Analyst, Manager, Executive)
2. Verify role-based filtering works correctly
3. Check choice field values and labels
4. Validate DateTime formatting
5. Test lookup field display

## 📋 Common Pitfalls to Avoid

### 1. Authentication Mistakes
- ❌ Using `user.systemuserid` (doesn't work in Power Pages)
- ❌ Using email-based filtering instead of Contact lookups
- ✅ Always use `user.contactid` and Contact-based relationships

### 2. Choice Field Mistakes
- ❌ Using choice field labels for comparison (`record.status.label == "Draft"`)
- ❌ Using string comparison for numeric values
- ✅ Use `.value` for comparison, `.label` for display

### 3. Role-Based Access Mistakes
- ❌ Hardcoding user IDs or roles
- ❌ Not implementing proper Business Unit filtering
- ✅ Use dynamic Contact-based filtering with role checks

### 4. Data Display Mistakes
- ❌ Not handling null/empty fields
- ❌ Not providing fallback values for lookup fields
- ✅ Always check field existence and provide fallbacks

## 🎯 Success Metrics

A successful Dataverse integration should achieve:
- ✅ Correct role-based data filtering
- ✅ Proper choice field value handling
- ✅ Consistent UI/UX patterns
- ✅ Comprehensive error handling
- ✅ Debug information for troubleshooting
- ✅ Scalable patterns for future screens

## 📚 Reference Examples

### Successful Implementations
1. **Dashboard Page**: Perfect example of assessment status metrics and role-based filtering
2. **Process Selection Page**: Excellent pattern for record selection with business unit display

### Key Files to Reference
- `Dashboard.en-US.webpage.copy.html` - Status metrics and role-based filtering
- `Process-Selection.en-US.webpage.copy.html` - Record selection and business unit integration

---

*This document should be used as the foundation for all future Dataverse integration work. Each new screen should follow these patterns to ensure consistency, reliability, and scalability.*

*Last Updated: January 2025*
*Project: RCSA Power Pages V3* 