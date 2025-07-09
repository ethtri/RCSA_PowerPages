# AI Delegation Guide for RCSA Power Pages V3
## Essential Information for AI Assistants

### 🎯 Project Overview

**Client**: First Citizens Bank (US mid-tier bank)  
**Presenter**: CapTech Ventures  
**Platform**: Microsoft Power Pages (Desktop-only)  
**Timeline**: MVP proof of concept  
**Current Status**: Dashboard and Process Selection pages complete with full Dataverse integration

### 🏆 Success Metrics & Business Goals

**Primary Objective**: Reduce risk assessment time from 2+ hours to <10 minutes  
**User Adoption Target**: >80% voluntary usage  
**Cost Reduction**: 90% less than traditional GRC suites  
**Visibility**: Real-time risk dashboards vs quarterly reporting  

### 👥 Key User Personas

1. **Risk Manager (Primary User)**
   - VP Operations level, medium tech comfort
   - Completes 3-5 assessments monthly
   - Needs guidance and speed
   - Success = <10 minute assessments

2. **ERM Reviewer (Secondary User)**  
   - SVP Enterprise Risk Management
   - High tech comfort, power user
   - Reviews and challenges assessments
   - Success = consistent quality control

3. **Chief Risk Officer (Executive User)**
   - Board-level reporting responsibility
   - Low tech comfort, needs simplicity
   - Success = real-time insights and predictive analytics

### 🎨 Design & UX Standards

**CRITICAL**: Follow CapTech design system documented in `rcsa-ux-design-system.md`

**Key Design Principles**:
- **Primary Color**: #0066CC (CapTech blue) - use for CTAs, links, primary actions
- **Typography**: Segoe UI font family, specific size scale documented
- **Spacing**: 8px base unit system (8px, 16px, 24px, 32px, 48px, 64px)
- **Cards**: White background, 1px #E5E5E5 border, 8px border-radius, 24px padding
- **Professional but not boring** - banking requires trust and clarity

**Status Color System**:
- Green (#0D7F3F): Success, low risk, completion
- Amber (#CC6600): Medium risk, warnings, attention needed  
- Red (#CC0000): High risk, errors, urgent action
- Blue (#0066CC): Primary actions, information

### 🔧 Technical Architecture

**Environment**: https://org601a79e1.crm.dynamics.com/  
**Website ID**: aa7d49af-363f-41d3-b99d-bdd5ad5694d8 (RCSA Copilot - site-5joks)  
**CLI Requirements**: `pac paportal upload --path "powerpages/rcsa-copilot---site-5joks" --modelVersion 2`

**CRITICAL Authentication Pattern**:
- Use `user.contactid` (NOT `user.systemuserid`)
- Contact table enhanced with: `cr129_userrole`, `cr129_businessunitname`, `cr129_accesslevel`
- Role values: Analyst=100000000, Manager=100000001, Executive=100000002

### 📊 Data Integration Patterns

**MUST READ**: Complete patterns documented in `DATAVERSE_INTEGRATION_GUIDE.md`

**Key Patterns**:
1. **Choice Fields**: Use `.value` for comparison, `.label` for display
2. **Role-Based Filtering**: Analysts see own records, Managers see business unit records
3. **FetchXML Structure**: Always include primary key + display fields + lookup fields + audit fields
4. **DateTime Formatting**: Use `| date: "M/d/yyyy"` format
5. **Debug Panels**: Always include comprehensive debugging during development

**Critical Tables**:
- `cr129_assess`: Assessment records with Contact-based filtering
- `cr129_proc`: Process records with ownership and business unit display  
- `cr129_risk`: Risk records for AI suggestions and user selection
- `cr129_control`: Control records for mapping to risks
- `cr129_riskctrl`: Junction table linking risks to controls

### 🤖 AI Integration Requirements

**OpenAI Connector**: Integration for risk suggestions (currently needs fixing)  
**AI Behavior Patterns**:
- Critical processes → Suggest high risks (L:4-5, I:4-5)
- High processes → Suggest medium-high risks (L:3-4, I:3-4)  
- Medium/Low processes → Suggest medium risks (L:2-3, I:2-3)
- Always suggest 3 risks initially
- Allow users to Accept, Modify, or Reject suggestions

### 🔄 Workflow & Page Flow

**Completed Pages**:
1. ✅ Dashboard - Real-time metrics and assessment list
2. ✅ Process Selection - Business unit and process selection

**Remaining Pages** (In Priority Order):
3. **Risk Identification** - AI-powered risk suggestions with user control
4. **Control Mapping** - Link existing controls to identified risks  
5. **Residual Risk Assessment** - Final scoring with 5x5 heat map
6. **Success Page** - Celebration and next actions

**Page Navigation**:
- Linear workflow (no back navigation after submission)
- Session storage for selected data between pages
- Progress indicators showing current step

### 📋 Functional Requirements Summary

**Risk Identification Page Requirements**:
- Show selected process context
- AI loading animation (2-3 seconds)
- Display 3 AI-suggested risk cards with Accept/Modify/Reject actions
- Running list of accepted risks with remove capability
- Add custom risk functionality
- Continue when ≥1 risk accepted

**Control Mapping Page Requirements**:
- List all accepted risks in expandable sections
- Visual indicators: ✓ Green (has controls), ⚠️ Yellow (no controls)
- Control selection dropdown with type and effectiveness display
- Progress summary showing completion status
- Always allow continuation (controls optional)

**Residual Assessment Page Requirements**:
- Interactive 5×5 heat map grid (1-25 scoring)
- Color coding: Green (1-5), Yellow (6-10), Amber (11-15), Red (16-25)
- AI suggestions based on control effectiveness
- Required rationale text (min 50 characters)
- Warning for high scores (>15) that create issues
- Submit only when all risks scored

### 🚨 Critical Success Factors

1. **Follow Established Patterns**: Use the exact same authentication, data access, and UI patterns from Dashboard/Process Selection
2. **Maintain Design Consistency**: Strict adherence to CapTech design system
3. **Include Debug Information**: Comprehensive debugging panels for troubleshooting
4. **Role-Based Security**: Proper filtering based on user role and business unit
5. **Performance**: Page loads <3 seconds, AI suggestions <5 seconds
6. **Error Handling**: Graceful degradation when AI/data unavailable

### 🔍 Testing & Validation

**Test User Context**:
- Contact ID: e53b0961-2f5c-f011-bec1-7c1e521687a7
- Role: Manager (100000001)  
- Business Unit: Retail Banking
- Has 3 processes assigned for testing

**Validation Checklist**:
- [ ] Page loads without Liquid errors
- [ ] Data displays correctly for test user
- [ ] Role-based filtering works properly
- [ ] Navigation between pages functions
- [ ] Session storage persists selections
- [ ] Debug panel shows accurate information
- [ ] Design matches CapTech standards
- [ ] Mobile responsiveness (basic)

### 📚 Required Reading

**MUST READ BEFORE STARTING**:
1. `DATAVERSE_INTEGRATION_GUIDE.md` - Technical integration patterns
2. `rcsa-ux-design-system.md` - Complete design system
3. `rcsa-power-pages-requirements.md` - Detailed functional requirements
4. `rcsa_data_dictionary.md` - Complete data model
5. `POWER_PLATFORM_CLI_REFERENCE.md` - CLI commands and troubleshooting

### 🎯 Definition of Done

**For Each Page**:
1. ✅ Follows established Dataverse integration patterns
2. ✅ Implements complete functional requirements
3. ✅ Matches CapTech design system exactly  
4. ✅ Includes comprehensive debug information
5. ✅ Works with role-based security
6. ✅ Handles errors gracefully
7. ✅ Passes validation checklist
8. ✅ Successfully uploaded via CLI
9. ✅ Tested with actual user data
10. ✅ Navigation to next page works

### 🚀 Deployment Process

1. **Development**: Make changes to local files
2. **Testing**: Validate with debug information
3. **Upload**: `pac paportal upload --path "powerpages/rcsa-copilot---site-5joks" --modelVersion 2`
4. **Verification**: Test in live environment
5. **Documentation**: Update progress and any issues found

### 💡 Pro Tips for Success

1. **Start with Working Examples**: Copy patterns from Dashboard/Process Selection pages
2. **Debug First**: Always implement debug panels before removing them
3. **Test Early**: Upload and test frequently rather than building everything locally
4. **Follow the Guide**: The `DATAVERSE_INTEGRATION_GUIDE.md` has proven patterns - use them
5. **Ask Questions**: If requirements are unclear, ask for clarification rather than guessing
6. **Document Issues**: Track any problems found for future AIs

### 🔗 Key File Locations

- **Main Pages**: `powerpages/rcsa-copilot---site-5joks/web-pages/[page-name]/content-pages/`
- **Working Examples**: Dashboard and Process Selection pages
- **Documentation**: `docs/` directory
- **CLI Reference**: `docs/POWER_PLATFORM_CLI_REFERENCE.md`

---

*This guide ensures consistent, high-quality development across multiple AI assistants working on the RCSA Power Pages V3 project.* 