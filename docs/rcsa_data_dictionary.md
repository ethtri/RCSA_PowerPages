# RCSA Data Dictionary

## Table: Assess

| Field | Data Type | Description | Example | Lookup/Choice |
|-------|-----------|-------------|---------|----------------|
| AssessmentName | Text | Assessment label (primary) | Wire Transfers 2025 |  |
| RiskTitle | Lookup | Risk under review | Unauthorized wire | Lookup→Risk |
| Assessor | Email | User performing assessment | etrifari@captechventures.com |  |
| AssmntDate | Date | Assessment date | 2025‑06‑27 |  |
| ResidualL | Whole | Residual likelihood 1‑5 | 4 |  |
| ResidualI | Whole | Residual impact 1‑5 | 4 |  |
| Rationale | Multiline | Justification text | Pending automation of dual auth |  |
| AssessmentStatus | Choice | Workflow status | Submitted | Draft|Submitted|Challenged|Agreed |

## Table: BU

| Field | Data Type | Description | Example | Lookup/Choice |
|-------|-----------|-------------|---------|----------------|
| BUName | Text | Business Unit name (primary) | Retail Banking |  |
| ExecOwner | Email | Executive BU owner | etrifari@captechventures.com |  |
| ParentBU | Lookup | Parent Business Unit (self) | Retail & Commercial |  |

## Table: Ctrl

| Field | Data Type | Description | Example | Lookup/Choice |
|-------|-----------|-------------|---------|----------------|
| ControlTitle | Text | Control title (primary) | Dual authorization wire review |  |
| ControlType | Choice | Preventive vs Detective | Preventive | Preventive|Detective |
| AutomatedFlag | Yes/No | Is the control automated? | Yes |  |
| DesignEff | Whole | Design effectiveness 1‑5 | 5 |  |
| OperEff | Whole | Operating effectiveness 1‑5 | 3 |  |
| ControlOwner | email | Person responsible | etrifari@captechventures.com |  |

## Table: Issue

| Field | Data Type | Description | Example | Lookup/Choice |
|-------|-----------|-------------|---------|----------------|
| IssueTitle | Text | Issue headline (primary) | Manual dual auth prone to error |  |
| RiskTitle | Lookup | Related risk | Unauthorized wire | Lookup→Risk |
| Owner | Email | Issue owner | etrifari@captechventures.com |  |
| TargetDate | Date | Planned remediation date | 2025‑09‑30 |  |
| Status | Choice | Issue status | Open | Open|In Progress|Closed |
| Severity | Choice | Issue severity | High | High|Medium|Low |
| IssueRootCause | Choice | Root cause category | People | People|Process|Technology|External |

## Table: KRI

| Field | Data Type | Description | Example | Lookup/Choice |
|-------|-----------|-------------|---------|----------------|
| MetricName | Text | KRI metric title (primary) | Wire exception rate |  |
| RiskTitle | Lookup | Linked risk | Unauthorized wire | Lookup→Risk |
| CurrentVal | Decimal | Current metric value | 0.15 |  |
| AmberThres | Decimal | Amber threshold | 0.10 |  |
| RedThres | Decimal | Red threshold | 0.20 |  |
| LastUpdated | Date | Last update | 2025‑06‑26 |  |

## Table: Proc

| Field | Data Type | Description | Example | Lookup/Choice |
|-------|-----------|-------------|---------|----------------|
| ProcessName | Text | Process name (primary) | ATM Reconciliation |  |
| ProcessID | Text | Internal identifier | P001 |  |
| BUName | Lookup | Owning BU | Retail Banking | Lookup→BU |
| ProcessCriticality | Choice | Operational criticality | Critical | Critical|High|Standard |

## Table: Risk

| Field | Data Type | Description | Example | Lookup/Choice |
|-------|-----------|-------------|---------|----------------|
| RiskTitle | Text | Risk short title (primary) | Unauthorized wire |  |
| ProcessName | Lookup | Associated process | Wire Transfers | Lookup→Proc |
| RiskCategory | Choice | Taxonomy category | Fraud | Operational|Technology|Fraud|Compliance|Credit |
| InherentL | Whole | Inherent likelihood 1‑5 | 5 |  |
| InherentI | Whole | Inherent impact 1‑5 | 5 |  |

## Table: RiskCtrl

| Field | Data Type | Description | Example | Lookup/Choice |
|-------|-----------|-------------|---------|----------------|
| RiskTitle | Lookup | Related risk | Unauthorized wire | Lookup→Risk |
| ControlTitle | Lookup | Related control | Dual authorization wire review | Lookup→Ctrl |

## Table: Scale

| Field | Data Type | Description | Example | Lookup/Choice |
|-------|-----------|-------------|---------|----------------|
| Score | Whole | Rating score 1‑5 (primary) | 4 |  |
| Description | Text | Score description | High |  |
| LikelihoodDesc | Text | Likelihood narrative | Quarterly |  |
| ImpactDesc | Text | Impact narrative | $1M‑$10M |  |
| Color | Choice | Heat-map color | Red | Green|Amber|Red |

