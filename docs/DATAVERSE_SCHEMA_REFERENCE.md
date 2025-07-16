# RCSA Dataverse Schema Reference

## 🎯 Overview
This document provides a complete reference for all RCSA Dataverse entities, their naming conventions, and Web API usage patterns. This is the authoritative source for entity names, logical names, and EntitySetNames.

## 📊 **Complete Entity Mapping Table**

| Display Name | Logical Name | EntitySetName (Web API) | Primary Field | Purpose |
|--------------|--------------|------------------------|---------------|---------|
| **Assessment** | `cr129_assess` | `cr129_assesses` | `cr129_assessmentname` | Risk assessment records |
| **Business Unit** | `cr129_bu` | `cr129_bus` | `cr129_buname` | Organizational units |
| **Control** | `cr129_control` | `cr129_controls` | `cr129_controltitle` | Risk mitigation controls |
| **Issue** | `cr129_issue` | `cr129_issues` | `cr129_issuetitle` | Risk remediation issues |
| **Key Risk Indicator** | `cr129_kri` | `cr129_kris` | `cr129_metricname` | Risk monitoring metrics |
| **Process** | `cr129_proc` | `cr129_processes` | `cr129_processname` | Business processes |
| **Risk** | `cr129_risk` | `cr129_risks` | `cr129_risktitle` | Risk records |
| **Risk-Control Mapping** | `cr129_riskctrl` | `cr129_riskctrls` | `cr129_riskctrlid` | N:N junction table |
| **Risk Scale** | `cr129_scale` | `cr129_scales` | `cr129_scaleid` | Risk scoring definitions |

## 🔧 **Web API Usage Patterns**

### **EntitySetName Rules** [[memory:3346968]]
Power Pages Web API requires EntitySetName (plural) for endpoints, but site settings use logical table names (singular):

```javascript
// ✅ CORRECT Web API endpoint usage
GET /_api/cr129_risks           // Uses plural EntitySetName
GET /_api/cr129_controls        // Uses plural EntitySetName  
GET /_api/cr129_processes       // Uses plural EntitySetName

// ✅ CORRECT Site Settings usage  
Webapi/cr129_risk/fields        // Uses singular logical name
Webapi/cr129_control/fields     // Uses singular logical name
Webapi/cr129_proc/fields        // Uses singular logical name
```

### **Lookup Field Patterns**
```javascript
// ✅ Lookup field reference patterns
"cr129_risktitle@odata.bind": "/cr129_risks(${riskId})"
"cr129_controltitle@odata.bind": "/cr129_controls(${controlId})"  
"cr129_processname@odata.bind": "/cr129_processes(${procId})"
"cr129_businessunitname@odata.bind": "/cr129_bus(${buId})"
```

## 📋 **Detailed Entity Schemas**

### 🎯 **cr129_assess (Assessments)**
**Purpose**: Risk assessment records with residual scoring  
**EntitySetName**: `cr129_assesses`

| Logical Name | Display Name | Type | Description | Example |
|--------------|--------------|------|-------------|---------|
| `cr129_assessmentname` | Assessment Name | Text | Assessment identifier | "Wire Transfers Assessment 2025-01" |
| `cr129_risktitle` | Risk Title | Lookup→cr129_risk | Associated risk | → Unauthorized Wire Transfer |
| `cr129_assessor` | Assessor | Email | Person performing assessment | etrifari@captechventures.com |
| `cr129_assmntdate` | Assessment Date | DateTime | Date assessed | 2025-01-15T09:30:00Z |
| `cr129_residuall` | Residual Likelihood | Integer | Final likelihood score (1-5) | 3 |
| `cr129_residuali` | Residual Impact | Integer | Final impact score (1-5) | 4 |
| `cr129_rationale` | Rationale | Text (Multi-line) | Assessment justification | "Controls reduce likelihood..." |
| `cr129_assessmentstatus` | Status | Choice | Workflow status | Draft/Submitted/Challenged/Agreed |

### 🏢 **cr129_bu (Business Units)**  
**Purpose**: Organizational structure and ownership  
**EntitySetName**: `cr129_bus`

| Logical Name | Display Name | Type | Description | Example |
|--------------|--------------|------|-------------|---------|
| `cr129_buname` | BU Name | Text | Business unit identifier | "Retail Banking" |
| `cr129_execowner` | Executive Owner | Email | BU executive owner | etrifari@captechventures.com |
| `cr129_parentbu` | Parent BU | Lookup→cr129_bu | Parent business unit | → Corporate Banking |

### 🛡️ **cr129_control (Controls)**
**Purpose**: Risk mitigation controls and their effectiveness  
**EntitySetName**: `cr129_controls`

| Logical Name | Display Name | Type | Description | Example |
|--------------|--------------|------|-------------|---------|
| `cr129_controltitle` | Control Title | Text | Control identifier | "Dual Authorization for Wires" |
| `cr129_controltype` | Control Type | Choice | Control classification | Preventive/Detective |
| `cr129_automatedflag` | Automated Flag | Yes/No | Is control automated? | Yes |
| `cr129_designeff` | Design Effectiveness | Integer | Design rating (1-5) | 5 |
| `cr129_opereff` | Operating Effectiveness | Integer | Operating rating (1-5) | 3 |
| `cr129_controlowner` | Control Owner | Email | Responsible person | etrifari@captechventures.com |

### 🚨 **cr129_issue (Issues)**
**Purpose**: Risk remediation and action items  
**EntitySetName**: `cr129_issues`

| Logical Name | Display Name | Type | Description | Example |
|--------------|--------------|------|-------------|---------|
| `cr129_issuetitle` | Issue Title | Text | Issue identifier | "High Residual Risk: Wire Fraud" |
| `cr129_risktitle` | Risk Title | Lookup→cr129_risk | Related risk | → Unauthorized Wire Transfer |
| `cr129_owner` | Owner | Email | Issue owner | etrifari@captechventures.com |
| `cr129_targetdate` | Target Date | DateTime | Remediation deadline | 2025-03-15T23:59:59Z |
| `cr129_status` | Status | Choice | Issue status | Open/In Progress/Closed |
| `cr129_severity` | Severity | Choice | Issue priority | High/Medium/Low |
| `cr129_issuerootcause` | Root Cause | Choice | Cause category | People/Process/Technology/External |

### 📊 **cr129_kri (Key Risk Indicators)**
**Purpose**: Risk monitoring metrics and thresholds  
**EntitySetName**: `cr129_kris`

| Logical Name | Display Name | Type | Description | Example |
|--------------|--------------|------|-------------|---------|
| `cr129_metricname` | Metric Name | Text | KRI identifier | "Wire Exception Rate" |
| `cr129_risktitle` | Risk Title | Lookup→cr129_risk | Associated risk | → Wire Processing Errors |
| `cr129_currentval` | Current Value | Decimal | Current metric value | 0.15 |
| `cr129_amberthres` | Amber Threshold | Decimal | Warning threshold | 0.10 |
| `cr129_redthres` | Red Threshold | Decimal | Critical threshold | 0.20 |
| `cr129_lastupdated` | Last Updated | DateTime | Last metric update | 2025-01-15T14:22:00Z |

### ⚙️ **cr129_proc (Processes)**
**Purpose**: Business processes and their criticality  
**EntitySetName**: `cr129_processes`

| Logical Name | Display Name | Type | Description | Example |
|--------------|--------------|------|-------------|---------|
| `cr129_processname` | Process Name | Text | Process identifier | "Wire Transfer Processing" |
| `cr129_processid` | Process ID | Text | Internal process code | "P-001" |
| `cr129_businessunitname` | Business Unit | Lookup→cr129_bu | Owning business unit | → Retail Banking |
| `cr129_processcriticality` | Criticality | Choice | Business criticality | Critical/High/Standard |

### ⚠️ **cr129_risk (Risks)**
**Purpose**: Risk records with inherent scoring  
**EntitySetName**: `cr129_risks`

| Logical Name | Display Name | Type | Description | Example |
|--------------|--------------|------|-------------|---------|
| `cr129_risktitle` | Risk Title | Text | Risk identifier | "Unauthorized Wire Transfer" |
| `cr129_processname` | Process Name | Lookup→cr129_proc | Associated process | → Wire Transfer Processing |
| `cr129_riskcategory` | Risk Category | Choice | Risk taxonomy | Operational/Fraud/Technology/Credit/Compliance |
| `cr129_inherentl` | Inherent Likelihood | Integer | Inherent likelihood (1-5) | 4 |
| `cr129_inherenti` | Inherent Impact | Integer | Inherent impact (1-5) | 5 |
| `cr129_riskdescription` | Risk Description | Text (Multi-line) | Detailed risk description | "Risk of unauthorized..." |
| `cr129_linkedcontrols` | Linked Controls | Text | Control summary | "Dual auth, system controls" |
| `cr129_mappedcontrol` | Mapped Control | Lookup→cr129_control | **1:1 control mapping** | → Dual Authorization Control |

### 🔗 **cr129_riskctrl (Risk-Control Junction)**
**Purpose**: N:N relationship between risks and controls  
**EntitySetName**: `cr129_riskctrls`

| Logical Name | Display Name | Type | Description | Example |
|--------------|--------------|------|-------------|---------|
| `cr129_riskctrlid` | Risk Control ID | GUID | Junction record ID | Auto-generated |
| `cr129_risktitle` | Risk Title | Lookup→cr129_risk | Associated risk | → Unauthorized Wire Transfer |
| `cr129_controltitle` | Control Title | Lookup→cr129_control | Associated control | → Dual Authorization Control |

### 📏 **cr129_scale (Risk Scales)**
**Purpose**: Risk scoring definitions and descriptions  
**EntitySetName**: `cr129_scales`

| Logical Name | Display Name | Type | Description | Example |
|--------------|--------------|------|-------------|---------|
| `cr129_scaleid` | Scale ID | GUID | Scale record ID | Auto-generated |
| `cr129_impactdescription` | Impact Description | Text | Impact level description | "Significant financial loss" |
| `cr129_likelihooddescription` | Likelihood Description | Text | Likelihood level description | "Likely to occur monthly" |

## ⚙️ **Choice Field Value Mappings**

### **cr129_assessmentstatus (Assessment Status)**
```javascript
0: "Draft"
1: "Submitted" 
2: "Challenged"
3: "Agreed"
```

### **cr129_controltype (Control Type)**
```javascript
0: "Preventive"
1: "Detective"
```

### **cr129_processcriticality (Process Criticality)**
```javascript
0: "Critical"
1: "High" 
2: "Standard"
```

### **cr129_riskcategory (Risk Category)**
```javascript
0: "Operational"
1: "Fraud"
2: "Technology"
3: "Credit"
4: "Compliance"
```

### **cr129_severity (Issue Severity)**
```javascript
0: "High"
1: "Medium"
2: "Low" 
```

### **cr129_status (Issue Status)**
```javascript
0: "Open"
1: "In Progress"
2: "Closed"
```

## 🔐 **Web API Security Patterns**

### **Table Permissions Required** (Based on 403 fix)
All RCSA tables require:
```yaml
adx_enablewebapi: true
adx_entitypermission_webrole:
  - 27b95ddd-4d8e-409b-acb1-5b679dd2282c  # Anonymous Users
  - a3f35e16-a398-428c-b9db-986df58ce13e  # Administrators
  - b912c42b-d467-42b7-88c9-2427536440e4  # Authenticated Users
```

### **Site Settings Field Restrictions**
```
Webapi/cr129_risk/fields: cr129_risktitle,cr129_riskdescription,cr129_processname,_cr129_processname_value,cr129_inherentl,cr129_inherenti,cr129_riskcategory,cr129_linkedcontrols,cr129_mappedcontrol,_cr129_mappedcontrol_value,statecode,statuscode,createdon,modifiedon

Webapi/cr129_control/fields: cr129_controltitle,cr129_controltype,cr129_automatedflag,cr129_designeff,cr129_opereff,cr129_controlowner,statecode,statuscode,createdon,modifiedon

Webapi/cr129_assess/fields: cr129_assessmentname,cr129_risktitle,_cr129_risktitle_value,cr129_assessor,cr129_assmntdate,cr129_residuall,cr129_residuali,cr129_rationale,cr129_assessmentstatus,statecode,statuscode,createdon,modifiedon
```

### **Child Table Permissions for Lookups**
```yaml
# Example: Risk table accessing Control via cr129_mappedcontrol
adx_childTablePermissions:
- adx_entitylogicalname: cr129_control
  adx_entityname: Risk-Control-Lookup-Access
  adx_parentrelationship: cr129_mappedcontrol
  adx_parententitypermission: [parent-permission-id]
  adx_read: true
```

## 🚀 **Quick Reference for Developers**

### **Common Web API Endpoints**
```javascript
// GET operations
GET /_api/cr129_risks?$select=cr129_risktitle,cr129_inherentl,cr129_inherenti
GET /_api/cr129_controls?$select=cr129_controltitle,cr129_controltype,cr129_designeff
GET /_api/cr129_processes?$select=cr129_processname,cr129_processcriticality

// POST operations  
POST /_api/cr129_risks
POST /_api/cr129_assesses
POST /_api/cr129_issues

// PATCH operations
PATCH /_api/cr129_risks(${riskId})
PATCH /_api/cr129_assesses(${assessId})
```

### **Lookup Relationship Patterns**
```javascript
// Risk → Process relationship
"cr129_processname@odata.bind": "/cr129_processes(${processId})"

// Assessment → Risk relationship  
"cr129_risktitle@odata.bind": "/cr129_risks(${riskId})"

// Risk → Control relationship (1:1)
"cr129_mappedcontrol@odata.bind": "/cr129_controls(${controlId})"

// Junction table relationships (N:N)
"cr129_risktitle@odata.bind": "/cr129_risks(${riskId})",
"cr129_controltitle@odata.bind": "/cr129_controls(${controlId})"
```

---

## 📝 **Notes**

- **EntitySetName vs Logical Name**: Always use EntitySetName (plural) for Web API endpoints
- **Choice Field Values**: Use integer values (0, 1, 2...) not large option set values
- **Lookup Fields**: Include both the field and its `_value` property in site settings
- **Child Permissions**: Required for lookup field validation in Web API operations
- **GUIDs**: Always use proper GUID format with hyphens for ID fields

This reference should be updated whenever schema changes are made to the Dataverse model. 