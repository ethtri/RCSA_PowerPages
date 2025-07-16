# Control Mapping Multi-Select Enhancement Requirements

## Overview
The current Control Mapping feature implements a 1:1 relationship using the `cr129_mappedcontrol` lookup field. For comprehensive RCSA (Risk and Compliance Self-Assessment) functionality, we need to enhance this to support N:N relationships where a single risk can be mapped to multiple controls.

## Current Implementation (1:1 Mapping)

### Technical Architecture
- **Field Used**: `cr129_mappedcontrol` (lookup field on cr129_risk table)
- **Relationship**: One risk → One control
- **API Pattern**: `PATCH /_api/cr129_risks(id)` with `"cr129_mappedcontrol@odata.bind": "/cr129_controls(controlId)"`
- **UI**: Radio button selection modal
- **Status**: ✅ **Working** - 403 error resolved

### Current Web API Integration
```javascript
// Current working save pattern
webapi.safeAjax({
    type: 'PATCH',
    url: `/_api/cr129_risks(${riskId})`,
    data: JSON.stringify({
        "cr129_mappedcontrol@odata.bind": `/cr129_controls(${controlId})`
    })
});
```

## Required Enhancement (N:N Mapping)

### Business Requirements
1. **Multiple Control Assignment**: Each risk should be mappable to multiple controls
2. **Comprehensive Coverage**: Support complex risk scenarios requiring multiple mitigation controls
3. **Industry Standard**: Align with standard RCSA practices in banking/financial services
4. **Audit Trail**: Maintain complete history of control assignments

### Technical Requirements

#### Option 1: Leverage Existing Junction Table (Recommended)
- **Table**: `cr129_riskctrl` (already exists)
- **Relationship**: `cr129_risk` ↔ `cr129_riskctrl` ↔ `cr129_control`
- **Advantage**: Leverages existing Dataverse schema design

#### Option 2: Create New Junction Table
- **New Table**: `cr129_risk_control_mapping`
- **Fields**: risk_id, control_id, created_date, created_by, status
- **Advantage**: Purpose-built for multi-select mapping

### UI/UX Requirements

#### Multi-Select Control Interface
```
┌─────────────────────────────────────────────────┐
│ Map Controls to Risk: "Credit Risk Assessment"  │
├─────────────────────────────────────────────────┤
│ Available Controls:                             │
│ ☐ Authentication Controls                       │
│ ☐ Data Encryption Standards                    │
│ ☑ Credit Limit Monitoring                      │
│ ☑ Risk Score Validation                        │
│ ☐ Audit Trail Requirements                     │
│                                                 │
│ Currently Mapped (2):                          │
│ • Credit Limit Monitoring                      │
│ • Risk Score Validation                        │
│                                                 │
│ [Save Mapping]  [Clear All]  [Cancel]          │
└─────────────────────────────────────────────────┘
```

#### Enhanced Features
1. **Search/Filter**: Find controls by name or category
2. **Bulk Operations**: Select/deselect multiple controls
3. **Visual Feedback**: Clear indication of mapped vs unmapped controls
4. **Validation**: Prevent duplicate mappings
5. **Progress Indication**: Show mapping save/load status

### Web API Implementation

#### Approach 1: Junction Table Operations
```javascript
// Add control mapping
webapi.safeAjax({
    type: 'POST',
    url: '/_api/cr129_riskctrls',
    data: JSON.stringify({
        "cr129_riskid@odata.bind": `/cr129_risks(${riskId})`,
        "cr129_controlid@odata.bind": `/cr129_controls(${controlId})`
    })
});

// Remove control mapping
webapi.safeAjax({
    type: 'DELETE',
    url: `/_api/cr129_riskctrls(${mappingId})`
});

// Load existing mappings
webapi.safeAjax({
    type: 'GET',
    url: `/_api/cr129_risks(${riskId})?$expand=cr129_risk_cr129_riskctrl_riskid($expand=cr129_controlid)`
});
```

#### Approach 2: Associate/Disassociate API
```javascript
// Add control mapping
webapi.safeAjax({
    type: 'POST',
    url: `/_api/cr129_risks(${riskId})/cr129_risk_cr129_control/\$ref`,
    data: JSON.stringify({
        "@odata.id": `/_api/cr129_controls(${controlId})`
    })
});

// Remove control mapping
webapi.safeAjax({
    type: 'DELETE',
    url: `/_api/cr129_risks(${riskId})/cr129_risk_cr129_control(${controlId})/\$ref`
});
```

### Required Web API Permissions
Building on our successful 403 error resolution:

#### Table Permissions Required
1. **cr129_riskctrl table** (if using Option 1):
   - `adx_enablewebapi: true`
   - All web roles: Anonymous, Admin, Authenticated Users
   - Read, Write, Create, Delete permissions

2. **Site Settings Updates**:
   - Add cr129_riskctrl fields to `Webapi/cr129_riskctrl/fields`
   - Update related table field restrictions

#### Child Table Permissions
```yaml
# Additional child table permission structure
adx_childTablePermissions:
- adx_entitylogicalname: cr129_riskctrl
  adx_entityname: Risk-Control-Junction-Access
  adx_parentrelationship: cr129_riskid
  adx_parententitypermission: [risk-permission-id]
  adx_read: true
  adx_write: true
  adx_create: true
  adx_delete: true
```

### Implementation Phases

#### Phase 1: Backend Preparation
1. ✅ Validate `cr129_riskctrl` table structure
2. ✅ Configure Web API permissions (apply 403 fix patterns)
3. ✅ Test junction table CRUD operations
4. ✅ Update site settings field restrictions

#### Phase 2: API Implementation  
1. Create multi-select control mapping service
2. Implement bulk add/remove operations
3. Add comprehensive error handling
4. Test all CRUD scenarios

#### Phase 3: UI Implementation
1. Convert radio buttons to checkboxes
2. Add search/filter functionality
3. Implement bulk selection features
4. Add visual mapping indicators

#### Phase 4: Integration & Testing
1. Replace current 1:1 implementation
2. Migration path for existing mappings
3. End-to-end testing
4. Performance optimization

### Data Migration Strategy

#### Preserve Existing Mappings
```javascript
// Migration script: Convert 1:1 to N:N
// For each risk with cr129_mappedcontrol:
// 1. Create cr129_riskctrl record
// 2. Clear cr129_mappedcontrol field
// 3. Validate data integrity
```

### Success Criteria
1. **Functionality**: Users can map multiple controls to single risks
2. **Performance**: UI remains responsive with 100+ controls
3. **Data Integrity**: No orphaned mappings or data loss
4. **User Experience**: Intuitive interface matching CapTech design standards
5. **Backwards Compatibility**: Existing 1:1 mappings preserved during transition

### Risk Assessment
- **Low Risk**: Web API patterns proven from 403 error resolution
- **Medium Risk**: UI complexity with multiple selection states
- **High Risk**: Data migration from 1:1 to N:N relationship model

### Dependencies
1. **Current Working Control Mapping**: Must maintain functionality during enhancement
2. **Web API Permissions**: Apply proven 403 resolution patterns
3. **Design System**: CapTech component library for UI consistency
4. **Testing Data**: Sample risks and controls for validation

### Timeline Estimate
- **Phase 1-2**: 2-3 days (backend + API)
- **Phase 3**: 2-3 days (UI implementation)  
- **Phase 4**: 1-2 days (integration + testing)
- **Total**: 5-8 days development time

---

**Next Action**: Prioritize after Residual Assessment screen completion per current roadmap. 