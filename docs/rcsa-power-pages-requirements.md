# RCSA Power Pages Application - Requirements Document

## 1. Executive Overview

### Business Context
**Client**: First Citizens Bank (US mid-tier bank)  
**Presenter**: CapTech Ventures  
**Platform**: Microsoft Power Pages (Desktop-only)  
**Timeline**: 1-week proof of concept  

### Problem Statement
Current risk assessment process takes 2+ hours using Excel spreadsheets with no standardization, poor visibility, and expensive GRC alternatives. Bank executives need a modern solution that demonstrates immediate ROI.

### Solution Vision
A modern web application that enables risk managers to complete assessments in under 10 minutes with AI assistance, real-time dashboards, and automatic issue escalation.

### Success Metrics
- Assessment completion: <10 minutes (vs 2+ hours current)
- User adoption: >80% voluntary usage
- Risk visibility: Real-time (vs quarterly)
- Cost: 90% less than GRC suites

---

## 2. User Personas & Journeys

### Primary Persona: Risk Manager (Sarah Chen)
**Role**: VP Operations, Retail Banking  
**Tech Comfort**: Medium - uses standard business applications  
**Pain Points**: 
- Monthly assessments take 2-3 hours
- Uncertain which risks to include
- No guidance on scoring
- Excel formatting issues

**User Journey**:
1. **Login** → Personalized dashboard shows 3 pending assessments
2. **Select Process** → Choose "Wire Transfers" from Retail Banking
3. **AI Assists** → System suggests 3 relevant risks in 2 seconds
4. **Human Judgment** → Accept 2 risks, modify 1, add custom risk
5. **Map Controls** → Link existing controls to each risk
6. **Score Residual** → Use visual heat map to set final scores
7. **Submit** → Complete in 8 minutes, celebrate time saved

### Secondary Persona: ERM Reviewer (Michael Thompson)
**Role**: SVP Enterprise Risk Management  
**Tech Comfort**: High - power user  
**Pain Points**:
- Manual aggregation across BUs
- Inconsistent assessment quality
- Email chains for clarifications
- Delayed executive reporting

**User Journey**:
1. **Notification** → Alert for high-risk assessment submitted
2. **Review Queue** → See new assessments sorted by risk level
3. **Quality Check** → Review Sarah's wire transfer assessment
4. **Challenge** → Question high residual score, add comment
5. **Feedback Loop** → Sarah receives notification to revise
6. **Approve** → Final approval after revision

### Executive Persona: Chief Risk Officer (Patricia Williams)
**Role**: CRO reporting to Board  
**Tech Comfort**: Low - needs simplicity  
**Pain Points**:
- Quarterly data is outdated
- Surprises in audit findings
- Manual report preparation
- No predictive insights

**User Journey**:
1. **Dashboard** → Real-time heat map by BU
2. **Drill Down** → Click high-risk area
3. **Insights** → See trends and predictions
4. **Export** → Generate board presentation

---

## 3. Functional Requirements

### 3.1 Dashboard Page
**Purpose**: Command center showing workload and performance

**Requirements**:
- Personalized greeting with user's first name and time-based message
- Large visual card showing pending assessment count
  - Color coding: Red (>5), Amber (3-5), Blue (0-2)
- Three metric cards:
  - Completed This Month (green accent)
  - In Progress (amber accent)  
  - Average Time "8 min" (blue accent)
- Scrollable list of pending assessments showing:
  - Process name (bold)
  - Business unit
  - Due date with smart formatting
  - Status badges (OVERDUE, DUE TODAY, X DAYS)
- Primary action button: "Start New Assessment"

### 3.2 Process Selection Page
**Purpose**: Guided selection of what to assess

**Requirements**:
- Visual progress indicator (Step 1 of 4)
- Two-step selection process:
  1. Business Unit dropdown (filtered by user permissions)
  2. Process card grid
- Process cards must show:
  - Process name (large text)
  - Criticality badge with color
  - Process ID
  - Visual selection state
- Sort by criticality: Critical → High → Medium → Low
- AI teaser: "✨ AI will suggest relevant risks"
- Continue button appears after selection

### 3.3 Risk Identification Page
**Purpose**: AI-assisted risk discovery

**Requirements**:
- Show selected process context bar
- AI suggestion section:
  - Loading animation (2-3 seconds)
  - Display 3 risk cards
  - Each shows: Title, Category, L/I scores, heat color
  - Three actions: Accept (green), Modify (amber), Reject (gray)
- Accepted risks section:
  - Running list with count
  - Remove option
- Add custom risk capability
- Continue when ≥1 risk accepted

**AI Behavior**:
- Critical processes → High risks (L:4-5, I:4-5)
- High processes → Medium-high risks (L:3-4, I:3-4)
- Medium/Low → Medium risks (L:2-3, I:2-3)

### 3.4 Control Mapping Page
**Purpose**: Link mitigating controls to risks

**Requirements**:
- List all accepted risks
- Expandable sections per risk
- Visual indicators:
  - ✓ Green check = has controls
  - ⚠️ Yellow warning = no controls
- Control selection dropdown
- Display for each control:
  - Title and type (Preventive/Detective)
  - Effectiveness scores
  - Automated flag
  - Unlink option
- Progress summary: "X of Y risks have controls"
- Continue always enabled

### 3.5 Residual Assessment Page
**Purpose**: Final risk scoring after controls

**Requirements**:
- One section per risk (expandable)
- 5×5 interactive heat map grid:
  - Colors: Green (1-5), Yellow (6-10), Amber (11-15), Red (16-25)
  - Click cell to select score
  - Show inherent position
  - Highlight selected cell
- AI suggestion box:
  - "Based on controls, suggested residual: L2 × I3"
  - Calculate from control effectiveness
- Rationale text (required, min 50 chars)
- Warning if score >15: "This will create an issue"
- Submit when all complete

### 3.6 Success Page
**Purpose**: Celebrate completion and next steps

**Requirements**:
- No back navigation (intentional)
- Large success animation (checkmark)
- Summary card showing:
  - Process assessed
  - Risk count
  - High residual count
  - Time taken (highlighted)
  - Issues auto-created
- Celebration if <10 minutes
- Three action buttons:
  - View Dashboard (primary)
  - Start Another Assessment
  - View My Assessments
- Footer: "Sent for ERM review"

---

## 4. Data Model

### Business Units (BUs)
- BUName (Text, Primary Key)
- ExecOwner (Email)
- ParentBU (Self-lookup for hierarchy)

### Processes (Procs)
- ProcessName (Text, Primary Key)
- ProcessID (Text, Unique)
- BUName (Lookup to BUs)
- ProcessCriticality (Choice: Critical/High/Medium/Low)

### Risks
- RiskTitle (Text, Primary Key)
- ProcessName (Lookup to Procs)
- RiskCategory (Choice: Operational/Credit/Market/Compliance/Reputational/Strategic)
- InherentL (Number 1-5)
- InherentI (Number 1-5)

### Controls (Ctrls)
- ControlTitle (Text, Primary Key)
- ControlType (Choice: Preventive/Detective)
- AutomatedFlag (Yes/No)
- DesignEff (Number 1-5)
- OperEff (Number 1-5)

### Risk-Control Mapping (RiskCtrl)
- RiskTitle (Lookup to Risks)
- ControlTitle (Lookup to Ctrls)

### Assessments (Assesses)
- AssessmentName (Text, Primary Key)
- RiskTitle (Lookup to Risks)
- Assessor (Email)
- AssmntDate (Date)
- ResidualL (Number 1-5)
- ResidualI (Number 1-5)
- Rationale (Multiline Text)
- AssessmentStatus (Choice: Pending/In Progress/Submitted/Reviewed)

### Issues
- IssueTitle (Text, Primary Key)
- RiskTitle (Lookup to Risks)
- Owner (Email)
- TargetDate (Date)
- Status (Choice: Open/In Progress/Closed)
- Severity (Choice: High/Medium/Low)

---

## 5. User Experience Standards

### Visual Design Principles
1. **Clean & Modern**
   - Abundant white space
   - Card-based layouts
   - Subtle shadows for depth
   - 8px border radius on containers

2. **Color Psychology**
   - Blue (#0066CC): Primary actions, trust
   - Green (#0D7F3F): Success, low risk
   - Amber (#CC6600): Warning, medium risk
   - Red (#CC0000): Danger, high risk
   - Gray (#4A4A4A): Secondary information

3. **Typography Hierarchy**
   - Headers: 24px, Semibold
   - Subheaders: 18px, Medium
   - Body: 14px, Regular
   - Captions: 12px, Regular
   - Font: Segoe UI or system fonts

4. **Interactive Elements**
   - Hover states: 10% darker
   - Active states: 20% darker
   - Transitions: 200ms ease
   - Focus indicators: 2px blue outline

### Layout Standards
1. **Consistent Spacing**
   - Page margins: 40px
   - Section spacing: 32px
   - Card padding: 24px
   - Element gaps: 16px

2. **Responsive Grid**
   - Max content width: 1200px
   - Centered layout
   - 12-column grid system
   - Minimum 768px width (desktop only)

3. **Visual Hierarchy**
   - Clear page titles
   - Logical content flow
   - Progressive disclosure
   - Important actions prominent

### Interaction Patterns
1. **Feedback**
   - Loading states for all async operations
   - Success messages for completed actions
   - Error messages with solutions
   - Progress indicators for multi-step processes

2. **Navigation**
   - Breadcrumb trail
   - Clear back/forward
   - Disabled states explained
   - Exit points obvious

3. **Data Entry**
   - Inline validation
   - Clear field labels
   - Helper text where needed
   - Smart defaults

---

## 6. Technical Requirements

### Performance
- Page load: <2 seconds
- AI response: <3 seconds
- Auto-save: Every 30 seconds
- Zero data loss tolerance

### Browser Support
- Chrome (latest)
- Edge (latest)
- Firefox (latest)
- Safari (latest)

### Integrations
- Microsoft Dataverse (data storage)
- OpenAI API (risk suggestions)
- Power BI (embedded dashboards)
- Email notifications

### Security
- Azure AD authentication
- Role-based access control
- Row-level security
- Audit trail for all changes

---

## 7. AI Integration Specifications

### Risk Suggestion Logic
**Input Context**:
- Process name
- Process criticality
- Business unit
- Industry: Banking

**Expected Output**:
```
3 risks with:
- Title (specific to banking)
- Category (from defined list)
- Likelihood score (1-5)
- Impact score (1-5)
- Brief rationale
```

### Residual Score Suggestion
**Input Context**:
- Inherent risk scores
- Mapped controls
- Control effectiveness

**Logic**:
- Average control effectiveness
- Reduce inherent by effectiveness factor
- Never exceed inherent scores
- Round to nearest integer

---

## 8. Demo Script Key Moments

### Opening (30 seconds)
"Sarah, a risk manager at First Citizens Bank, currently spends over 2 hours on each monthly assessment using Excel..."

### Problem Demonstration (1 minute)
Show current Excel process with multiple tabs, manual lookups, formatting issues

### Solution Walkthrough (7 minutes)
1. Dashboard - "3 assessments pending"
2. Process Selection - "Let's assess Wire Transfers"
3. AI Magic - "Watch AI suggest relevant risks"
4. Human Control - "Sarah accepts 2, modifies 1"
5. Control Mapping - "Link existing controls"
6. Smart Scoring - "AI suggests residual scores"
7. Time Celebration - "Completed in 8 minutes!"

### Executive View (2 minutes)
Switch to CRO dashboard showing real-time heat map

### ROI Summary (30 seconds)
"Built in 1 week, 90% time savings, fraction of GRC cost"

---

## 9. Success Criteria

### Quantitative
- Assessment time: <10 minutes ✓
- AI accuracy: >80% acceptance rate ✓
- Zero critical bugs during demo ✓
- All features functional ✓

### Qualitative
- "This is exactly what we need!"
- "When can we implement this?"
- "So much better than our current process"
- "The AI actually understands our business"

---

## 10. Future Enhancements (Post-Demo)

1. Mobile responsive design
2. Bulk assessment capabilities
3. Advanced analytics dashboard
4. Integration with GRC tools
5. Automated control testing
6. Predictive risk scoring
7. Peer bank benchmarking
8. Regulatory mapping

---

## Appendix: Sample Data

### Sample Business Units
- Retail Banking
- Commercial Banking
- Wealth Management
- Capital Markets

### Sample Processes
- Wire Transfers (Critical)
- Account Opening (High)
- Loan Origination (Critical)
- Portfolio Management (High)

### Sample Risks
- Unauthorized wire transfer (Operational)
- Wire fraud - external threat (Operational)
- KYC documentation incomplete (Compliance)
- Credit limit exceeded (Credit)

### Sample Controls
- Dual authorization for wires >$10k (Preventive)
- Daily wire reconciliation (Detective)
- Automated fraud detection (Preventive)
- Quarterly control testing (Detective)