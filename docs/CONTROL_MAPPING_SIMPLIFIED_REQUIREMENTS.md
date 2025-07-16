# Control Mapping - Simplified Implementation Requirements

## **Context & Background**

### **Original Requirements vs. Current Reality**
- **Original Goal**: N:N relationship mapping (many risks to many controls) using Dataverse cr129_risk_ctrl intersection table
- **Technical Challenge**: After extensive troubleshooting (Web API 403/400 errors, metadata endpoint failures, plugin interference), the N:N relationship approach is not functioning within our timeline
- **Simplified Approach**: Implement 1:1 relationship (one risk maps to one control) using a lookup field in the Risk table

### **Business Impact**
- **Immediate**: Delivers a working control mapping feature for Thursday deadline
- **Future**: Can be enhanced back to N:N when technical issues are resolved
- **User Experience**: Slightly simplified but still provides core functionality

---

## **Technical Implementation Approach**

### **Data Model Changes Required**
```
Risk Table (cr129_risk):
- Add/Use existing lookup field: cr129_mappedcontrol (lookup to cr129_control)
- This replaces the complex N:N cr129_risk_ctrl intersection table approach
```

### **Current Working Elements**
✅ **Risks are loading correctly** from Dataverse
✅ **Controls are loading correctly** from Dataverse  
✅ **UI/UX design is complete and approved**
❌ **Save functionality needs to be implemented** (write back to Dataverse)

---

## **User Experience Flow**

### **Step-by-Step Process**
1. **User arrives at Control Mapping screen**
   - Sees list of risks (already working)
   - Each risk shows current mapped control (if any)
   
2. **User clicks "+ Map Controls" button on a risk**
   - Modal/dropdown opens showing list of available controls
   - Controls are loaded from Dataverse cr129_controls table (already working)
   
3. **User selects one control**
   - Updates the risk's cr129_mappedcontrol lookup field
   - Saves change to Dataverse via Web API
   - UI updates to show the mapped control on the risk card
   
4. **User clicks "Continue to Residual Assessment" button**
   - Proceeds to next screen in the workflow

---

## **Implementation Tasks**

### **Priority 1: Core Functionality**
1. **Add cr129_mappedcontrol lookup field** to Risk table (if not exists)
2. **Implement save functionality** to write lookup value back to Dataverse
3. **Update risk display** to show currently mapped control
4. **Test end-to-end flow** with real data

### **Priority 2: UX Polish**
1. **Add loading states** during save operations
2. **Add success/error feedback** for mapping actions
3. **Implement remove mapping** functionality
4. **Add validation** (optional controls, duplicate checking, etc.)

---

## **Code Location & Files**

### **Primary File**
```
powerpages/rcsa-copilot---site-5joks/web-pages/control-mapping-overview/content-pages/Control-Mapping-Overview.en-US.webpage.copy.html
```

### **Key Functions to Modify**
- `openControlMapping()` - Handle control selection
- `assignControlToRisk()` - NEW: Implement save to Dataverse
- `loadExistingMappings()` - Modify to load 1:1 relationships
- Control selection modal/dropdown functionality

---

## **Dataverse Configuration**

### **Required Web API Settings** (Already Configured)
```yaml
Webapi/cr129_risks/enabled: true
Webapi/cr129_risks/fields: cr129_riskid,cr129_risktitle,cr129_mappedcontrol,_cr129_mappedcontrol_value,...
Webapi/cr129_controls/enabled: true  
Webapi/cr129_controls/fields: cr129_controlid,cr129_controltitle,...
```

### **Required Table Permissions** (Already Configured)
- Read access to cr129_risk and cr129_control tables
- Write access to cr129_risk table for updating the lookup field

---

## **API Endpoints to Use**

### **Read Operations** (Already Working)
```javascript
// Get risks
GET /_api/cr129_risks?$select=cr129_riskid,cr129_risktitle,_cr129_mappedcontrol_value&$expand=cr129_mappedcontrol($select=cr129_controlid,cr129_controltitle)

// Get controls for selection
GET /_api/cr129_controls?$select=cr129_controlid,cr129_controltitle
```

### **Write Operations** (Need Implementation)
```javascript
// Update risk with mapped control
PATCH /_api/cr129_risks(riskId)
{
  "cr129_mappedcontrol@odata.bind": "/cr129_controls(controlId)"
}

// Remove mapping
PATCH /_api/cr129_risks(riskId)  
{
  "cr129_mappedcontrol@odata.bind": null
}
```

---

## **Sample Implementation Code**

### **Save Control Mapping Function**
```javascript
async function saveControlMapping(riskId, controlId) {
  try {
    const response = await fetch(`/_api/cr129_risks(${riskId})`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'OData-MaxVersion': '4.0',
        'OData-Version': '4.0'
      },
      body: JSON.stringify({
        "cr129_mappedcontrol@odata.bind": `/cr129_controls(${controlId})`
      })
    });
    
    if (response.ok) {
      console.log('Control mapping saved successfully');
      updateRiskDisplayWithControl(riskId, controlId);
    } else {
      console.error('Failed to save mapping:', response.statusText);
    }
  } catch (error) {
    console.error('Error saving mapping:', error);
  }
}
```

---

## **Future Enhancement Path**

### **When N:N Can Be Implemented**
1. **Keep the 1:1 lookup field** as a "primary control" 
2. **Add back N:N relationship** for additional controls
3. **Update UI** to show primary + additional controls
4. **Maintain backward compatibility** with existing 1:1 mappings

### **Database Migration Strategy**
```sql
-- Future: Migrate 1:1 to N:N
-- For each risk with cr129_mappedcontrol:
-- 1. Create cr129_risk_ctrl record 
-- 2. Mark as "primary" control
-- 3. Keep lookup field for backward compatibility
```

---

## **Testing Checklist**

### **Functional Testing**
- [ ] Risks load correctly with existing mappings
- [ ] Control selection modal opens and populates
- [ ] Control assignment saves to Dataverse
- [ ] UI updates immediately after save
- [ ] Remove mapping functionality works
- [ ] Error handling for failed saves

### **Integration Testing**  
- [ ] Works with existing risk loading
- [ ] Doesn't break existing navigation
- [ ] "Continue to Residual Assessment" button functions
- [ ] Data persists across page refreshes

---

## **Key Success Metrics**

1. **User can map a control to a risk** and see it persist
2. **User can change/remove mappings** 
3. **User can proceed to next screen** without errors
4. **All changes save to Dataverse** correctly
5. **Performance is acceptable** (< 2 second save time)

---

## **Notes for Implementation**

- **Leverage existing working code** for risk/control loading
- **Minimal UI changes** - keep existing design, just change save behavior  
- **Error handling is critical** - users need clear feedback
- **Test with real data** throughout development
- **Document any field name changes** for future N:N migration

**Estimated Implementation Time**: 4-6 hours for core functionality + 2-4 hours for testing/polish 