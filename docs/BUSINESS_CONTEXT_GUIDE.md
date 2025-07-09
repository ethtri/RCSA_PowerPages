# Business Context Guide for RCSA Application
## Banking Risk Assessment Domain Knowledge

### 🏦 Banking Risk Management Overview

**RCSA = Risk & Control Self-Assessment**  
A systematic process where business units evaluate their own operational risks and the controls that mitigate those risks. This is a regulatory requirement for banks and a critical component of enterprise risk management.

### 📊 Risk Assessment Fundamentals

#### Risk Components
1. **Inherent Risk**: The risk level before any controls are applied
2. **Residual Risk**: The risk level after controls are considered
3. **Likelihood**: Probability of the risk event occurring (1-5 scale)
4. **Impact**: Financial/operational consequence if it occurs (1-5 scale)
5. **Risk Score**: Likelihood × Impact (1-25 scale)

#### Risk Heat Map
```
Impact →  1    2    3    4    5
Likelihood ↓
    1     1    2    3    4    5    (Green - Low)
    2     2    4    6    8    10   (Green - Low)
    3     3    6    9    12   15   (Yellow/Amber - Medium)
    4     4    8    12   16   20   (Red - High)
    5     5    10   15   20   25   (Red - Critical)
```

**Color Coding**:
- **Green (1-5)**: Low risk, acceptable
- **Yellow (6-10)**: Medium-low risk, monitor
- **Amber (11-15)**: Medium-high risk, action needed
- **Red (16-25)**: High risk, immediate action required

### 🎯 Risk Categories (Banking Specific)

1. **Operational Risk**: Process failures, human error, system outages
   - Examples: Wire transfer errors, ATM cash shortages, manual processing mistakes
   
2. **Technology Risk**: IT system failures, cybersecurity threats, data breaches
   - Examples: Core banking system outage, ransomware attack, data corruption
   
3. **Fraud Risk**: Internal or external fraudulent activities
   - Examples: Check kiting, identity theft, employee embezzlement
   
4. **Compliance Risk**: Regulatory violations, policy breaches
   - Examples: BSA/AML violations, fair lending issues, privacy breaches
   
5. **Credit Risk**: Loan defaults, counterparty failures
   - Examples: Commercial loan defaults, credit card charge-offs

### 🛡️ Control Types & Effectiveness

#### Control Types
1. **Preventive Controls**: Stop risks before they occur
   - Examples: Dual authorization, system access controls, approval workflows
   
2. **Detective Controls**: Identify risks after they occur
   - Examples: Transaction monitoring, exception reports, audits

#### Control Effectiveness Scoring
- **Design Effectiveness (1-5)**: How well the control is designed to address the risk
- **Operating Effectiveness (1-5)**: How well the control is actually functioning
- **Overall Effectiveness**: Generally the lower of the two scores

#### Automated vs Manual Controls
- **Automated**: System-enforced controls (preferred for consistency)
- **Manual**: Human-dependent controls (higher risk of failure)

### 📈 Business Unit Structure (Banking)

**Typical Banking Business Units**:
1. **Retail Banking**: Consumer deposits, loans, mortgages, credit cards
2. **Commercial Banking**: Business loans, treasury services, trade finance
3. **Wealth Management**: Investment advisory, private banking, trust services
4. **Operations**: Back-office processing, settlements, reconciliations
5. **Technology**: IT infrastructure, application development, cybersecurity
6. **Risk Management**: Credit risk, operational risk, compliance

### 🔄 Assessment Workflow & Roles

#### Risk Manager Role
- **Primary Responsibility**: Complete risk assessments for their business unit
- **Frequency**: Typically quarterly or semi-annually
- **Goal**: Identify, assess, and document risks and controls
- **Pain Point**: Manual, time-consuming process (currently 2+ hours per assessment)

#### ERM (Enterprise Risk Management) Reviewer Role
- **Primary Responsibility**: Review and validate risk assessments
- **Authority**: Can challenge scores, request clarification, approve/reject
- **Goal**: Ensure consistency and quality across business units
- **Pain Point**: Manual aggregation and inconsistent assessment quality

#### Chief Risk Officer Role
- **Primary Responsibility**: Enterprise-wide risk oversight and board reporting
- **Focus**: Trends, concentrations, emerging risks, regulatory compliance
- **Goal**: Real-time risk visibility and predictive insights
- **Pain Point**: Delayed, outdated information for decision-making

### 📋 Assessment Process Flow

1. **Process Selection**: Choose which business process to assess
2. **Risk Identification**: Identify relevant risks (AI-assisted)
3. **Control Mapping**: Link existing controls to each risk
4. **Residual Scoring**: Score likelihood and impact after controls
5. **Issue Creation**: Auto-create issues for high residual risks (>15)
6. **Review & Approval**: ERM review and final approval

### 🚨 Issue Management

**When Issues Are Created**:
- Residual risk score >15 (amber/red zone)
- No controls mapped to a risk
- Control effectiveness scores <3

**Issue Severity Mapping**:
- **High**: Residual score 20-25
- **Medium**: Residual score 16-19  
- **Low**: Residual score 11-15

**Root Cause Categories**:
- **People**: Training, competency, staffing issues
- **Process**: Workflow, procedure, policy gaps
- **Technology**: System limitations, automation needs
- **External**: Vendor, regulatory, market factors

### 💡 AI Integration Context

#### Risk Suggestion Logic
The AI should suggest risks based on:
1. **Process Criticality**: Higher criticality → suggest higher inherent risks
2. **Historical Data**: Common risks for similar processes
3. **Industry Standards**: Typical banking operational risks
4. **Regulatory Focus**: Current regulatory emphasis areas

#### Intelligent Defaults
- **Critical Processes**: Default to L:4-5, I:4-5 suggestions
- **High Processes**: Default to L:3-4, I:3-4 suggestions
- **Standard Processes**: Default to L:2-3, I:2-3 suggestions

#### Control Effectiveness Guidance
- **Automated + Preventive**: Highest effectiveness (4-5)
- **Manual + Preventive**: Medium-high effectiveness (3-4)
- **Automated + Detective**: Medium effectiveness (3-4)
- **Manual + Detective**: Lower effectiveness (2-3)

### 📊 Key Performance Indicators

**Assessment Efficiency**:
- Time to complete assessment (<10 minutes target)
- Number of assessments completed per month
- User adoption rate (>80% target)

**Risk Quality**:
- Percentage of assessments requiring ERM challenge
- Number of issues identified and resolved
- Accuracy of risk scoring vs actual events

**Business Value**:
- Cost savings vs traditional GRC tools (90% target)
- Time savings for risk managers (>75% reduction)
- Improved risk visibility (quarterly → real-time)

### 🎯 Success Criteria for Each Page

#### Risk Identification Success
- AI suggests relevant, realistic risks
- Users accept >70% of AI suggestions
- Custom risk addition is intuitive
- Process completes in <2 minutes

#### Control Mapping Success  
- Users can easily find and select controls
- Visual indicators clearly show completion status
- Process is optional but encouraged
- Completes in <3 minutes

#### Residual Assessment Success
- Heat map is intuitive and responsive
- AI suggestions are helpful and accurate
- Rationale capture is simple but thorough
- Users complete scoring in <3 minutes

### 🔍 Validation & Testing Context

**Realistic Test Scenarios**:
1. **Wire Transfer Process** (Critical)
   - Expected risks: Unauthorized transfers, system failures, fraud
   - Expected controls: Dual authorization, monitoring, limits
   
2. **ATM Reconciliation** (High)
   - Expected risks: Cash shortages, transaction errors, theft
   - Expected controls: Daily reconciliation, exception reporting
   
3. **Loan Origination** (Critical)
   - Expected risks: Credit decisions, documentation, compliance
   - Expected controls: Underwriting standards, document review, audits

**User Behavior Patterns**:
- Risk managers prefer speed over comprehensiveness
- ERM reviewers focus on consistency and quality
- Executives need high-level trends and insights
- All users prefer visual over textual information

---

*This business context ensures AI assistants understand the banking domain and can build contextually appropriate solutions.* 