# RCSA Power Pages - Dummy Data Samples

## Purpose
This document provides realistic sample data for all 9 Dataverse tables in the RCSA Power Pages application. This data is designed for:
- **Demonstration purposes** - Show realistic banking scenarios
- **Testing and validation** - Populate the application with meaningful data
- **Development support** - Provide consistent test data across environments

## Data Overview
- **9 Dataverse Tables** with interconnected relationships
- **Banking-specific content** focusing on retail and commercial banking
- **Realistic scenarios** based on common banking risk assessments
- **Complete data flow** from business units through to issues and KRIs

---

## Table 1: BU (Business Units)

| BUName | ExecOwner | ParentBU |
|--------|-----------|----------|
| Retail Banking | sarah.chen@firstcitizens.com | Banking Operations |
| Commercial Banking | michael.rodriguez@firstcitizens.com | Banking Operations |
| Wealth Management | patricia.wong@firstcitizens.com | Banking Operations |
| Treasury & Markets | david.johnson@firstcitizens.com | Banking Operations |
| Operations | lisa.thompson@firstcitizens.com | NULL |
| Technology | james.wilson@firstcitizens.com | NULL |
| Banking Operations | robert.davis@firstcitizens.com | NULL |
| Compliance | jennifer.martinez@firstcitizens.com | NULL |

---

## Table 2: Proc (Processes)

| ProcessName | ProcessID | BUName | ProcessCriticality |
|-------------|-----------|--------|-------------------|
| Wire Transfers | P001 | Retail Banking | Critical |
| Account Opening | P002 | Retail Banking | High |
| Loan Origination | P003 | Commercial Banking | Critical |
| Credit Card Processing | P004 | Retail Banking | High |
| ATM Reconciliation | P005 | Operations | Standard |
| ACH Processing | P006 | Operations | High |
| Investment Advisory | P007 | Wealth Management | High |
| Cash Management | P008 | Treasury & Markets | Critical |
| Mortgage Processing | P009 | Retail Banking | High |
| Trade Finance | P010 | Commercial Banking | High |
| Payment Processing | P011 | Operations | Critical |
| Customer Onboarding | P012 | Retail Banking | High |

---

## Table 3: Risk (Risks)

| RiskTitle | ProcessName | RiskCategory | InherentL | InherentI |
|-----------|-------------|--------------|-----------|-----------|
| Unauthorized Wire Transfer | Wire Transfers | Fraud | 4 | 5 |
| Identity Theft in Account Opening | Account Opening | Fraud | 3 | 4 |
| Credit Risk Mispricing | Loan Origination | Credit | 4 | 4 |
| Card Fraud Losses | Credit Card Processing | Fraud | 5 | 3 |
| ATM Cash Discrepancies | ATM Reconciliation | Operational | 2 | 2 |
| ACH Return Processing Errors | ACH Processing | Operational | 3 | 3 |
| Unsuitable Investment Advice | Investment Advisory | Compliance | 2 | 4 |
| Liquidity Risk Management | Cash Management | Operational | 3 | 5 |
| Mortgage Compliance Violations | Mortgage Processing | Compliance | 3 | 4 |
| Trade Finance Documentation | Trade Finance | Operational | 4 | 3 |
| Payment System Downtime | Payment Processing | Technology | 2 | 5 |
| Customer Data Breach | Customer Onboarding | Technology | 3 | 5 |
| Money Laundering via Wires | Wire Transfers | Compliance | 4 | 5 |
| Loan Application Fraud | Loan Origination | Fraud | 3 | 4 |
| Investment Suitability Breach | Investment Advisory | Compliance | 2 | 4 |

---

## Table 4: Ctrl (Controls)

| ControlTitle | ControlType | AutomatedFlag | DesignEff | OperEff | ControlOwner |
|--------------|-------------|---------------|-----------|---------|--------------|
| Dual Authorization Wire Review | Preventive | No | 4 | 3 | operations@firstcitizens.com |
| Customer ID Verification System | Preventive | Yes | 5 | 4 | compliance@firstcitizens.com |
| Credit Scoring Model | Preventive | Yes | 4 | 4 | credit@firstcitizens.com |
| Real-time Fraud Monitoring | Detective | Yes | 5 | 5 | fraud@firstcitizens.com |
| Daily Cash Reconciliation | Detective | No | 3 | 3 | operations@firstcitizens.com |
| ACH Exception Processing | Detective | Yes | 4 | 4 | operations@firstcitizens.com |
| Investment Suitability Assessment | Preventive | No | 4 | 3 | wealth@firstcitizens.com |
| Liquidity Stress Testing | Preventive | Yes | 5 | 4 | treasury@firstcitizens.com |
| Mortgage Compliance Checklist | Preventive | No | 3 | 3 | mortgage@firstcitizens.com |
| Trade Documentation Review | Preventive | No | 4 | 3 | tradefinance@firstcitizens.com |
| Payment System Monitoring | Detective | Yes | 5 | 5 | technology@firstcitizens.com |
| Data Encryption Controls | Preventive | Yes | 5 | 5 | security@firstcitizens.com |
| AML Transaction Monitoring | Detective | Yes | 4 | 4 | compliance@firstcitizens.com |
| Loan Application Verification | Preventive | Yes | 4 | 4 | underwriting@firstcitizens.com |
| Client Risk Profiling | Preventive | No | 3 | 3 | wealth@firstcitizens.com |

---

## Table 5: RiskCtrl (Risk-Control Mappings)

| RiskTitle | ControlTitle |
|-----------|--------------|
| Unauthorized Wire Transfer | Dual Authorization Wire Review |
| Unauthorized Wire Transfer | Real-time Fraud Monitoring |
| Identity Theft in Account Opening | Customer ID Verification System |
| Identity Theft in Account Opening | Data Encryption Controls |
| Credit Risk Mispricing | Credit Scoring Model |
| Credit Risk Mispricing | Loan Application Verification |
| Card Fraud Losses | Real-time Fraud Monitoring |
| ATM Cash Discrepancies | Daily Cash Reconciliation |
| ACH Return Processing Errors | ACH Exception Processing |
| Unsuitable Investment Advice | Investment Suitability Assessment |
| Unsuitable Investment Advice | Client Risk Profiling |
| Liquidity Risk Management | Liquidity Stress Testing |
| Mortgage Compliance Violations | Mortgage Compliance Checklist |
| Trade Finance Documentation | Trade Documentation Review |
| Payment System Downtime | Payment System Monitoring |
| Customer Data Breach | Data Encryption Controls |
| Money Laundering via Wires | AML Transaction Monitoring |
| Money Laundering via Wires | Dual Authorization Wire Review |
| Loan Application Fraud | Loan Application Verification |
| Investment Suitability Breach | Investment Suitability Assessment |

---

## Table 6: Assess (Assessments)

| AssessmentName | RiskTitle | Assessor | AssmntDate | ResidualL | ResidualI | Rationale | AssessmentStatus |
|----------------|-----------|----------|------------|-----------|-----------|-----------|------------------|
| Wire Transfers Q1 2025 | Unauthorized Wire Transfer | sarah.chen@firstcitizens.com | 2025-01-15 | 2 | 4 | Dual auth reduces likelihood but impact remains high | Submitted |
| Account Opening Q1 2025 | Identity Theft in Account Opening | sarah.chen@firstcitizens.com | 2025-01-20 | 2 | 3 | ID verification system effective, encrypted data storage | Submitted |
| Loan Origination Q1 2025 | Credit Risk Mispricing | michael.rodriguez@firstcitizens.com | 2025-01-25 | 3 | 3 | Credit model good but manual overrides create risk | Submitted |
| Card Processing Q1 2025 | Card Fraud Losses | sarah.chen@firstcitizens.com | 2025-02-01 | 3 | 2 | Real-time monitoring very effective | Submitted |
| ATM Ops Q1 2025 | ATM Cash Discrepancies | lisa.thompson@firstcitizens.com | 2025-02-05 | 2 | 2 | Daily reconciliation process working well | Submitted |
| ACH Processing Q1 2025 | ACH Return Processing Errors | lisa.thompson@firstcitizens.com | 2025-02-10 | 2 | 3 | Automated exception handling reduces errors | Submitted |
| Investment Advisory Q1 2025 | Unsuitable Investment Advice | patricia.wong@firstcitizens.com | 2025-02-15 | 2 | 3 | Suitability assessment and profiling controls effective | Submitted |
| Cash Management Q1 2025 | Liquidity Risk Management | david.johnson@firstcitizens.com | 2025-02-20 | 2 | 4 | Stress testing robust but impact remains significant | Submitted |

---

## Table 7: Issue (Issues)

| IssueTitle | RiskTitle | Owner | TargetDate | Status | Severity | IssueRootCause |
|------------|-----------|-------|------------|--------|----------|----------------|
| Manual dual auth prone to error | Unauthorized Wire Transfer | operations@firstcitizens.com | 2025-09-30 | Open | High | Process |
| ID verification system outdated | Identity Theft in Account Opening | compliance@firstcitizens.com | 2025-06-30 | In Progress | Medium | Technology |
| Credit model needs recalibration | Credit Risk Mispricing | credit@firstcitizens.com | 2025-08-31 | Open | High | Process |
| ATM reconciliation manual process | ATM Cash Discrepancies | operations@firstcitizens.com | 2025-07-31 | Open | Low | Process |
| Investment suitability documentation gaps | Unsuitable Investment Advice | wealth@firstcitizens.com | 2025-05-31 | In Progress | Medium | Process |
| Liquidity reporting frequency inadequate | Liquidity Risk Management | treasury@firstcitizens.com | 2025-04-30 | Open | High | Process |
| Mortgage compliance checklist outdated | Mortgage Compliance Violations | mortgage@firstcitizens.com | 2025-06-30 | Open | Medium | Process |
| Trade finance documentation incomplete | Trade Finance Documentation | tradefinance@firstcitizens.com | 2025-08-31 | Open | Medium | Process |

---

## Table 8: KRI (Key Risk Indicators)

| MetricName | RiskTitle | CurrentVal | AmberThres | RedThres | LastUpdated |
|------------|-----------|------------|------------|----------|-------------|
| Wire Exception Rate | Unauthorized Wire Transfer | 0.15 | 0.10 | 0.20 | 2025-01-26 |
| Account Opening Fraud Rate | Identity Theft in Account Opening | 0.05 | 0.03 | 0.08 | 2025-01-26 |
| Loan Default Rate | Credit Risk Mispricing | 2.1 | 1.5 | 3.0 | 2025-01-26 |
| Card Fraud Loss Rate | Card Fraud Losses | 0.08 | 0.10 | 0.15 | 2025-01-26 |
| ATM Variance Rate | ATM Cash Discrepancies | 0.02 | 0.05 | 0.10 | 2025-01-26 |
| ACH Return Rate | ACH Return Processing Errors | 1.2 | 1.0 | 2.0 | 2025-01-26 |
| Investment Complaint Rate | Unsuitable Investment Advice | 0.01 | 0.02 | 0.05 | 2025-01-26 |
| Liquidity Coverage Ratio | Liquidity Risk Management | 125 | 110 | 100 | 2025-01-26 |
| Mortgage Compliance Score | Mortgage Compliance Violations | 92 | 90 | 85 | 2025-01-26 |
| Trade Finance Error Rate | Trade Finance Documentation | 0.03 | 0.05 | 0.08 | 2025-01-26 |
| Payment System Uptime | Payment System Downtime | 99.8 | 99.5 | 99.0 | 2025-01-26 |
| Data Breach Incidents | Customer Data Breach | 0 | 0 | 1 | 2025-01-26 |

---

## Table 9: Scale (Rating Scale)

| Score | Description | LikelihoodDesc | ImpactDesc | Color |
|-------|-------------|----------------|------------|-------|
| 1 | Very Low | Rare (>5 years) | Minimal (<$10K) | Green |
| 2 | Low | Unlikely (2-5 years) | Minor ($10K-$100K) | Green |
| 3 | Medium | Possible (1-2 years) | Moderate ($100K-$1M) | Amber |
| 4 | High | Likely (6-12 months) | Major ($1M-$10M) | Red |
| 5 | Very High | Almost Certain (<6 months) | Severe (>$10M) | Red |

---

## Data Relationships Summary

### Primary Relationships:
- **BU → Proc**: Business Units own Processes
- **Proc → Risk**: Processes have associated Risks
- **Risk → Ctrl**: Risks are mitigated by Controls (many-to-many via RiskCtrl)
- **Risk → Assess**: Risks are evaluated in Assessments
- **Risk → Issue**: Risks generate Issues when residual scores are high
- **Risk → KRI**: Risks are monitored by Key Risk Indicators

### Data Flow:
1. **Business Units** define organizational structure
2. **Processes** are owned by Business Units
3. **Risks** are identified for each Process
4. **Controls** are mapped to mitigate Risks
5. **Assessments** evaluate residual risk after controls
6. **Issues** are created for high residual risks
7. **KRIs** monitor ongoing risk levels
8. **Scale** provides consistent risk scoring

---

## Usage Notes

### For Demonstration:
- Use this data to show complete end-to-end risk assessment workflows
- Highlight relationships between tables during presentations
- Show realistic banking scenarios that resonate with bank executives

### For Testing:
- Import this data into Dataverse tables for comprehensive testing
- Use for validating data integration across all pages
- Test filtering, sorting, and relationship functionality

### For Development:
- Reference this data structure when building new features
- Use as baseline for additional test scenarios
- Ensure consistency with banking terminology and practices

---

**Last Updated**: January 2025  
**Data Version**: 1.0  
**Environment**: Development/Testing  
**Total Records**: 100+ across 9 tables 