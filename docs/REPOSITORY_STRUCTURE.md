# Repository Structure Guide
## RCSA Power Pages V3 - File Organization

### 🎯 Current Working Files (Use These)

#### **Main Application Code**
```
powerpages/
└── rcsa-copilot---site-5joks/    ← ACTIVE: Current working site
    ├── web-pages/
    │   ├── dashboard/
    │   │   └── content-pages/
    │   │       └── Dashboard.en-US.webpage.copy.html  ← ACTIVE: Current Dashboard
    │   ├── process-selection/
    │   │   └── content-pages/
    │   │       └── Process-Selection.en-US.webpage.copy.html  ← ACTIVE: Current Process Selection
    │   ├── risk-identification/
    │   │   └── content-pages/
    │   │       └── Risk-Identification.en-US.webpage.copy.html  ← TODO: Next to implement
    │   ├── control-mapping/
    │   │   └── content-pages/
    │   │       └── Control-Mapping.en-US.webpage.copy.html  ← TODO: After risk identification
    │   └── residual-assessment/
    │       └── content-pages/
    │           └── Residual-Assessment.en-US.webpage.copy.html  ← TODO: Final page
    ├── web-files/              ← CSS, JavaScript, and assets
    ├── web-templates/          ← Page templates
    └── sitesetting.yml         ← Site configuration
```

#### **Documentation (Current)**
```
docs/
├── AI_DELEGATION_GUIDE.md      ← ESSENTIAL: Guide for AI assistants
├── BUSINESS_CONTEXT_GUIDE.md   ← ESSENTIAL: Banking domain knowledge
├── DATAVERSE_INTEGRATION_GUIDE.md  ← ESSENTIAL: Integration patterns
├── PROJECT_STATUS.md           ← CURRENT: Project progress
├── POWER_PLATFORM_CLI_REFERENCE.md  ← ESSENTIAL: CLI commands
├── LOCAL_DEPLOYMENT_GUIDE.md   ← ESSENTIAL: Deployment procedures
├── rcsa-ux-design-system.md    ← ESSENTIAL: Design standards
├── rcsa-power-pages-requirements.md  ← ENTIAL: Functional requirements
├── rcsa_data_dictionary.md     ← ESSENTIAL: Data model
└── REPOSITORY_STRUCTURE.md     ← THIS FILE: Navigation guide
```

### 🗄️ Archive/Backup Files (Reference Only)

#### **Archived Code**
```
archive/
└── process-selection-backup/   ← OLD: Original process selection before rebuild

original-dashboard-backup/
└── rcsa-copilot---site-5joks/  ← OLD: Original dashboard before integration
```

#### **Legacy Documentation**
```
docs/
├── REPOSITORY_CLEANUP_SUMMARY.md  ← OLD: Cleanup summary from previous work
├── DEPLOYMENT_STRATEGY.md         ← OLD: Outdated deployment strategy
├── DEPLOYMENT_CHECKLIST.md        ← OLD: Outdated checklist
├── CI_SETUP.md                    ← OLD: Legacy CI setup
├── POWER_PAGES_BEST_PRACTICES.md  ← OLD: Generic best practices
├── PRODUCT_ROADMAP.md             ← OLD: Original roadmap
├── ALLIFEDATATABLES_DOCUMENTATION.md ← OLD: Basic table documentation
└── deploy-log.md                  ← OLD: Legacy deploy log
```

### 🎯 Quick Navigation Guide

#### **For Development Work:**
1. **Code Changes**: Work in `powerpages/rcsa-copilot---site-5joks/`
2. **Integration Patterns**: Read `docs/DATAVERSE_INTEGRATION_GUIDE.md`
3. **Design Standards**: Follow `docs/rcsa-ux-design-system.md`
4. **CLI Commands**: Reference `docs/POWER_PLATFORM_CLI_REFERENCE.md`

#### **For New AI Assistants:**
1. **Start Here**: `docs/AI_DELEGATION_GUIDE.md`
2. **Business Context**: `docs/BUSINESS_CONTEXT_GUIDE.md`
3. **Working Examples**: `powerpages/rcsa-copilot---site-5joks/web-pages/dashboard/` and `process-selection/`

#### **For Project Management:**
1. **Current Status**: `docs/PROJECT_STATUS.md`
2. **Requirements**: `docs/rcsa-power-pages-requirements.md`
3. **Data Model**: `docs/rcsa_data_dictionary.md`

### 🚀 Development Workflow

1. **Make Changes**: Edit files in `powerpages/rcsa-copilot---site-5joks/`
2. **Upload**: `pac paportal upload --path "powerpages/rcsa-copilot---site-5joks" --modelVersion 2`
3. **Test**: Verify in Power Pages environment
4. **Document**: Update relevant documentation

### 🔍 How to Find What You Need

| What I Need | Where to Look |
|-------------|---------------|
| **Current Dashboard Code** | `powerpages/rcsa-copilot---site-5joks/web-pages/dashboard/content-pages/Dashboard.en-US.webpage.copy.html` |
| **Current Process Selection Code** | `powerpages/rcsa-copilot---site-5joks/web-pages/process-selection/content-pages/Process-Selection.en-US.webpage.copy.html` |
| **How to Integrate with Dataverse** | `docs/DATAVERSE_INTEGRATION_GUIDE.md` |
| **Design Standards** | `docs/rcsa-ux-design-system.md` |
| **CLI Commands** | `docs/POWER_PLATFORM_CLI_REFERENCE.md` |
| **Business Requirements** | `docs/rcsa-power-pages-requirements.md` |
| **Data Model** | `docs/rcsa_data_dictionary.md` |
| **Project Status** | `docs/PROJECT_STATUS.md` |

### ⚠️ Important Notes

1. **DO NOT USE** files in `archive/` or `original-dashboard-backup/` - these are for reference only
2. **ALWAYS WORK IN** `powerpages/rcsa-copilot---site-5joks/` directory
3. **FOLLOW PATTERNS** from existing Dashboard and Process Selection pages
4. **READ ESSENTIAL DOCS** before making changes

### 🧹 Cleanup Recommendations

#### Files to Archive (Move to `archive/`):
- `docs/REPOSITORY_CLEANUP_SUMMARY.md`
- `docs/DEPLOYMENT_STRATEGY.md`
- `docs/DEPLOYMENT_CHECKLIST.md`
- `docs/CI_SETUP.md`
- `docs/POWER_PAGES_BEST_PRACTICES.md`
- `docs/PRODUCT_ROADMAP.md`
- `docs/ALLDATATABLES_DOCUMENTATION.md`
- `docs/deploy-log.md`

#### Files to Keep (Essential):
- `docs/AI_DELEGATION_GUIDE.md`
- `docs/BUSINESS_CONTEXT_GUIDE.md`
- `docs/DATAVERSE_INTEGRATION_GUIDE.md`
- `docs/PROJECT_STATUS.md`
- `docs/POWER_PLATFORM_CLI_REFERENCE.md`
- `docs/LOCAL_DEPLOYMENT_GUIDE.md`
- `docs/rcsa-ux-design-system.md`
- `docs/rcsa-power-pages-requirements.md`
- `docs/rcsa_data_dictionary.md`

---

*This guide ensures clear navigation and prevents confusion between active and archived files.* 