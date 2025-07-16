# ALLDATATABLES Page Documentation

## Overview
The **ALLDATATABLES** page is a special reference page in the RCSA Power Pages application that provides direct access to view all Dataverse tables and their data. This page serves as a comprehensive data browser and administrative tool.

## Purpose
- **Data Reference**: Provides a centralized location to view all Dataverse table contents
- **Development Support**: Allows developers and administrators to inspect data relationships
- **Testing Validation**: Enables verification that data is properly stored and linked
- **Troubleshooting**: Helps diagnose data-related issues during development and testing

## Web API Entity Set Name Mappings

Per [Microsoft Power Pages Web API documentation](https://learn.microsoft.com/en-us/power-pages/configure/web-api-overview#site-settings-for-the-web-api), API calls should use **EntitySetName** (plural) while site settings use logical table names (singular).

### RCSA Table Mappings

| **Logical Table Name** | **EntitySetName (API Endpoint)** | **Display Name** | **Purpose** |
|------------------------|-----------------------------------|------------------|-------------|
| `cr129_risk` | `cr129_risks` | Risks | Risk identification and assessment |
| `cr129_control` | `cr129_controls` | Controls | Risk mitigation controls |
| `cr129_proc` | `cr129_procs` | Processes | Business processes |
| `cr129_riskctrl` | `cr129_riskctrls` | Risk-Control Mappings | Many-to-many risk/control relationships |
| `cr129_bu` | `cr129_bus` | Business Units | Organizational units |
| `cr129_assess` | `cr129_assesses` | Assessments | Risk assessments |
| `cr129_issue` | `cr129_issues` | Issues | Risk-related issues |
| `cr129_scale` | `cr129_scales` | Scales | Risk rating scales |

### API Usage Examples

```javascript
// ✅ Correct: Use EntitySetName (plural) for API calls
fetch('/_api/cr129_risks?$top=10')
fetch('/_api/cr129_controls?$filter=statecode eq 0')
fetch('/_api/cr129_riskctrls?$expand=cr129_risk,cr129_control')

// ❌ Incorrect: Don't use logical table name for API calls
fetch('/_api/cr129_risk')  // May work but not recommended
```

### Site Settings Format

```yaml
# ✅ Correct: Use logical table name (singular) for site settings
- adx_name: Webapi/cr129_risk/enabled
  adx_value: true

# ✅ Correct: EntitySetName mapping (maps singular to plural)
- adx_name: Webapi/EntitySetName/cr129_risk
  adx_value: cr129_risks
```

## Page Location
- **URL**: \/alldatatables\
- **Navigation**: Accessible via \
View
All
Data\ link on the Dashboard
- **Visibility**: Hidden from site map but accessible to authenticated users

## Tables Displayed

The page displays **7 of the 9** Dataverse tables using Power Pages entity list components:

### 1. **Risks** (\
isks\)
- Displays all risk records with AI insights enabled
- Shows risk titles, categories, and inherent scores
- Includes natural language search capability

### 2. **Controls** (\Ctrl\)
- Lists all control records with AI insights
- Shows control titles, types, and effectiveness ratings
- Includes natural language search capability

### 3. **Active Assessments** (\Active Assesses\)
- Displays current assessment records
- Shows assessment names, dates, and status
- Includes natural language search capability

### 4. **Processes** (\Proc\)
- Lists all business process records
- Shows process names, IDs, and criticality levels
- Includes natural language search capability

### 5. **Risk-Control Mappings** (\Active RiskCtrls\)
- Displays the many-to-many relationships between risks and controls
- Uses modern entity list styling
- Includes natural language search capability

### 6. **Issues** (\Issue\)
- Lists all issue records
- Shows issue titles, owners, and status
- Includes natural language search capability

### 7. **Key Risk Indicators** (\KRI\)
- Displays all KRI records
- Shows metric names, current values, and thresholds
- Includes natural language search capability

### 8. **Rating Scale** (\Scale\)
- Lists the risk scoring scale definitions
- Shows score levels, descriptions, and colors
- Includes natural language search capability

## Tables NOT Displayed

### **Business Units** (\BU\)
- **Reason**: Not included in the current page layout
- **Access**: Can be viewed through other administrative interfaces
- **Note**: Consider adding if comprehensive data review is needed

---

**Last Updated**: January 2025  
**Page Version**: 1.0  
**Environment**: Development/Testing  
**Access Level**: Authenticated Users Only
