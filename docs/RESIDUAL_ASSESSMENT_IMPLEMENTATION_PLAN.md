# Residual Assessment Implementation Plan

## 🎯 Overview
The Residual Assessment page is the final step in the RCSA workflow where users provide final risk scoring after controls are considered. This is where risks get their "residual" scores that drive issue creation and management actions.

## 📋 Business Requirements

### Core Functionality
1. **5×5 Heat Map Grid**: Interactive risk scoring (Likelihood × Impact = Risk Score 1-25)
2. **Color-Coded Risk Levels**: 
   - Green (1-5): Low risk, acceptable
   - Yellow (6-10): Medium-low risk, monitor  
   - Amber (11-15): Medium-high risk, action needed
   - Red (16-25): High risk, immediate action required
3. **AI Suggestions**: Based on control effectiveness and inherent risk
4. **Required Rationale**: Minimum 50 characters justification
5. **Issue Auto-Creation**: For residual scores >15 (amber/red zone)

### User Experience Requirements
- **Risk Context**: Show inherent vs residual risk positioning
- **Control Summary**: Display mapped controls and their effectiveness
- **Real-Time Feedback**: Immediate AI recommendations when score is selected
- **Progress Indicators**: Step 4 of 5 completion status
- **Validation**: Prevent submission without complete scoring

## 🔍 Current Implementation Status

### ✅ What's Already Implemented
Based on existing code in `powerpages/rcsa-copilot---site-5joks/web-pages/residual-risk-assessment/`:

1. **UI Framework**: Complete Bootstrap 5 layout with heat map grid
2. **Interactive Heat Map**: 5×5 grid with click handlers and visual feedback
3. **Risk Matrix Logic**: Proper likelihood × impact calculations
4. **Color Coding**: CSS classes for risk-1 through risk-5 levels
5. **Form Validation**: Character counting and completion checking
6. **Navigation**: Back/Continue button structure
7. **AI Recommendation Framework**: Placeholder for dynamic suggestions

### 🔄 What Needs Enhancement

#### 1. Dataverse Integration (Critical)
Current implementation is static/demo - needs real data integration:

**Required Data Sources:**
```javascript
// Need to load from session storage or Web API:
const assessmentData = {
    businessUnit: "Retrieved from session",
    process: "Retrieved from session", 
    risks: [
        {
            id: "risk-guid",
            title: "Risk name",
            inherentL: 4,
            inherentI: 3,
            mappedControls: [
                {
                    title: "Control name",
                    effectiveness: 3.5
                }
            ]
        }
    ]
};
```

#### 2. Web API Data Persistence
**Save Pattern** (leveraging our proven 403 fix):
```javascript
// Create assessment record using Web API
webapi.safeAjax({
    type: 'POST',
    url: '/_api/cr129_assesses',
    data: JSON.stringify({
        "cr129_assessmentname": `${processName} Assessment ${new Date().toISOString()}`,
        "cr129_risktitle@odata.bind": `/cr129_risks(${riskId})`,
        "cr129_assessor": userEmail,
        "cr129_assmntdate": new Date().toISOString(),
        "cr129_residuall": selectedLikelihood,
        "cr129_residuali": selectedImpact,
        "cr129_rationale": rationaleText,
        "cr129_assessmentstatus": 100000000 // Draft status
    })
});
```

#### 3. Enhanced AI Suggestions
**Smart Recommendations Based On:**
- **Control Effectiveness**: Average effectiveness of mapped controls
- **Risk Reduction Logic**: `residual = inherent - (effectiveness_factor * control_impact)`
- **Industry Standards**: Banking-specific risk tolerance levels
- **Regulatory Guidance**: Compliance-driven risk thresholds

#### 4. Issue Auto-Creation
**Automatic Issue Generation** for high residual risk (>15):
```javascript
// Auto-create issue for high residual risk
if (riskScore > 15) {
    webapi.safeAjax({
        type: 'POST',
        url: '/_api/cr129_issues',
        data: JSON.stringify({
            "cr129_issuetitle": `High Residual Risk: ${riskTitle}`,
            "cr129_risktitle@odata.bind": `/cr129_risks(${riskId})`,
            "cr129_owner": userEmail,
            "cr129_targetdate": getTargetDate(30), // 30 days from now
            "cr129_status": 100000000, // Open
            "cr129_severity": getSeverity(riskScore) // High/Medium based on score
        })
    });
}
```

## 🛠️ Implementation Phases

### Phase 1: Data Integration (Priority 1)
**Goal**: Replace static demo data with real Dataverse integration

**Tasks**:
1. ✅ Load assessment context from session storage (business unit, process, risks)
2. ✅ Retrieve mapped controls for each risk via Web API
3. ✅ Calculate control effectiveness averages
4. ✅ Display real risk and control data in UI

**Web API Requirements** (building on 403 fix):
- **cr129_assess table**: Already configured with Web API permissions
- **Field Access**: Ensure `cr129_residuall`, `cr129_residuali`, `cr129_rationale` in site settings
- **Relationship Access**: Risk lookup field permissions

### Phase 2: AI-Enhanced Scoring (Priority 2)  
**Goal**: Implement intelligent residual risk suggestions

**Algorithm**:
```javascript
function calculateAISuggestion(inherentL, inherentI, controls) {
    const avgEffectiveness = controls.reduce((sum, c) => sum + c.effectiveness, 0) / controls.length;
    const reductionFactor = Math.min(0.8, avgEffectiveness / 5); // Max 80% reduction
    
    const suggestedL = Math.max(1, Math.round(inherentL * (1 - reductionFactor)));
    const suggestedI = Math.max(1, Math.round(inherentI * (1 - reductionFactor)));
    
    return { likelihood: suggestedL, impact: suggestedI };
}
```

### Phase 3: Data Persistence (Priority 3)
**Goal**: Save assessments to Dataverse with proper workflow status

**Save Operations**:
1. **Assessment Record**: Create cr129_assess record with scores and rationale
2. **Status Update**: Set assessment status to "Submitted" 
3. **Issue Creation**: Auto-create issues for high residual risks
4. **Audit Trail**: Capture assessor, date, and assessment context

### Phase 4: Enhanced UX (Priority 4)
**Goal**: Polish user experience with advanced features

**Enhancements**:
1. **Risk Comparison**: Show inherent vs residual risk side-by-side
2. **Control Impact**: Visual indicators of how each control affects scoring
3. **Progress Tracking**: Per-risk completion status
4. **Batch Operations**: Score all similar risks at once
5. **Draft Saving**: Allow saving in-progress assessments

## 🔧 Technical Implementation

### Required Web API Permissions
Building on our successful 403 error resolution patterns:

**cr129_assess Table Permissions** (likely already configured):
```yaml
adx_enablewebapi: true
adx_entitypermission_webrole:
  - 27b95ddd-4d8e-409b-acb1-5b679dd2282c  # Anonymous Users
  - a3f35e16-a398-428c-b9db-986df58ce13e  # Administrators  
  - b912c42b-d467-42b7-88c9-2427536440e4  # Authenticated Users
```

**Site Settings Field Access**:
```
Webapi/cr129_assess/fields: cr129_assessmentname,cr129_risktitle,_cr129_risktitle_value,cr129_assessor,cr129_assmntdate,cr129_residuall,cr129_residuali,cr129_rationale,cr129_assessmentstatus,statecode,statuscode,createdon,modifiedon
```

### JavaScript Architecture

**Main Class Structure**:
```javascript
class ResidualAssessmentManager {
    constructor() {
        this.assessmentData = null;
        this.currentRiskIndex = 0;
        this.completedAssessments = {};
    }
    
    async loadAssessmentData() {
        // Load from session storage and Web API
    }
    
    calculateAISuggestion(risk) {
        // Implement smart suggestions
    }
    
    async saveAssessment(riskId, scores, rationale) {
        // Save to Dataverse
    }
    
    async createIssueIfNeeded(riskId, riskScore) {
        // Auto-create issues for high risk
    }
}
```

## 📊 Success Criteria

### Functional Requirements
1. ✅ **Data Loading**: Real assessment context loaded from previous steps
2. ✅ **Risk Display**: All identified risks shown with context
3. ✅ **Interactive Scoring**: 5×5 heat map with proper calculations
4. ✅ **AI Suggestions**: Intelligent recommendations based on controls
5. ✅ **Data Persistence**: Assessments saved to Dataverse
6. ✅ **Issue Creation**: Automatic issue generation for high risks
7. ✅ **Validation**: Complete form validation and error handling

### Performance Requirements
- **Page Load**: <3 seconds to display all risks
- **AI Suggestions**: <1 second to calculate recommendations
- **Save Operation**: <2 seconds to persist assessment data
- **Navigation**: Smooth transitions between risks

### User Experience Requirements
- **Visual Clarity**: Clear risk level indicators and color coding
- **Intuitive Interaction**: Click-to-select heat map cells
- **Progress Feedback**: Clear completion status
- **Error Prevention**: Validation before save operations

## 🚨 Risk Assessment

### Technical Risks
- **Low Risk**: Web API patterns proven from Control Mapping 403 fix
- **Low Risk**: UI framework already implemented and functional
- **Medium Risk**: AI algorithm accuracy and user acceptance
- **Medium Risk**: Complex multi-risk workflow state management

### Business Risks  
- **Low Risk**: Requirements well-defined and documented
- **Medium Risk**: User adoption of AI suggestions vs manual scoring
- **High Risk**: Regulatory compliance of auto-generated issues

## ⏱️ Implementation Timeline

### Sprint 1 (2-3 days): Core Data Integration
- Load real assessment data from session/Web API
- Replace demo data with dynamic content
- Basic save functionality

### Sprint 2 (2-3 days): AI and Persistence
- Implement AI suggestion algorithm
- Complete Dataverse save operations  
- Issue auto-creation workflow

### Sprint 3 (1-2 days): UX Polish & Testing
- Enhanced user experience features
- Cross-browser testing
- End-to-end workflow validation

**Total Estimated Time: 5-8 days**

---

## 🎯 Next Actions

1. **Validate Current Web API Permissions**: Confirm cr129_assess table has proper 403 fix applied
2. **Test Data Flow**: Verify session storage data from previous steps
3. **Begin Phase 1**: Start with data integration replacing static demo content
4. **Apply Proven Patterns**: Use exact same Web API approaches from Control Mapping success

**Priority**: Immediate - This is the highest priority item on our roadmap after Control Mapping multi-select enhancement. 