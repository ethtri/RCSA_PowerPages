# RCSA Power Pages V3 - Repository Cleanup Plan

## Overview
This document outlines the comprehensive cleanup plan for the RCSA Power Pages V3 repository following the successful resolution of the Control Mapping 403 error and achievement of working Dataverse integration.

## Current Repository Analysis

### 🎯 Core Working Files (KEEP)
**Main Application Code:**
- `powerpages/rcsa-copilot---site-5joks/` - **ACTIVE WORKING DIRECTORY**
- `rcsa-design-system/` - Design system components
- `scripts/` - Deployment and validation scripts
- `solution-src/` - Dataverse solution source
- `.github/workflows/` - CI/CD pipeline
- `.vscode/` - VS Code configuration

**Essential Documentation:**
- `docs/AI_DELEGATION_GUIDE.md` - For future AI assistants
- `docs/BUSINESS_CONTEXT_GUIDE.md` - Banking domain knowledge
- `docs/DATAVERSE_INTEGRATION_GUIDE.md` - Proven integration patterns
- `docs/POWER_PAGES_WEB_API_403_TROUBLESHOOTING.md` - **NEW** - Complete 403 error resolution
- `docs/CONTROL_MAPPING_TECHNICAL_REFERENCE.md` - Technical implementation details
- `docs/PROJECT_STATUS.md` - Current project status
- `docs/POWER_PLATFORM_CLI_REFERENCE.md` - CLI commands reference
- `docs/REPOSITORY_STRUCTURE.md` - Navigation guide
- `docs/rcsa-power-pages-requirements.md` - Functional requirements
- `docs/rcsa_data_dictionary.md` - Data model reference
- `docs/rcsa-ux-design-system.md` - Design standards

### 🗄️ Archive Candidates (MOVE TO archive/)
**Duplicate/Previous Versions:**
- `powerpages-current/` - Previous version backup
- `powerpages-final/` - Previous version backup
- `powerpages-test/` - Previous version backup
- `powerpages-updated/` - Previous version backup
- `original-dashboard-backup/` - Already in archive structure

**Outdated Documentation:**
- `docs/DEPLOYMENT_STRATEGY.md` - Superseded by LOCAL_DEPLOYMENT_GUIDE.md
- `docs/DEPLOYMENT_CHECKLIST.md` - Outdated approach
- `docs/CI_SETUP.md` - Legacy CI setup
- `docs/POWER_PAGES_BEST_PRACTICES.md` - Generic best practices
- `docs/PRODUCT_ROADMAP.md` - Original roadmap (outdated)
- `docs/ALLDATATABLES_DOCUMENTATION.md` - Basic table documentation
- `docs/deploy-log.md` - Legacy deployment log
- `docs/PowerPages-Web-API-Troubleshoot.md` - Superseded by new 403 guide
- `docs/Dataverse-NtoNRelationships.md` - Empty file

### ❌ Delete Candidates (REMOVE)
**Redundant Documentation:**
- `docs/WEB_API_BEST_PRACTICES.md` - Consolidated into 403 troubleshooting guide
- `docs/WEB_API_SUCCESS_SUMMARY.md` - Consolidated into 403 troubleshooting guide
- `docs/QUICK_REFERENCE_WEB_API.md` - Consolidated into 403 troubleshooting guide

**Root Level Files:**
- `CONTROL_MAPPING_SIMPLIFIED_REQUIREMENTS.md` - Move to docs or delete

## Cleanup Actions

### Phase 1: Move to Archive
```bash
# Create archive subdirectories
mkdir -p archive/powerpages-versions
mkdir -p archive/legacy-docs

# Move previous powerpages versions
mv powerpages-current/ archive/powerpages-versions/
mv powerpages-final/ archive/powerpages-versions/
mv powerpages-test/ archive/powerpages-versions/
mv powerpages-updated/ archive/powerpages-versions/

# Move outdated documentation
mv docs/DEPLOYMENT_STRATEGY.md archive/legacy-docs/
mv docs/DEPLOYMENT_CHECKLIST.md archive/legacy-docs/
mv docs/CI_SETUP.md archive/legacy-docs/
mv docs/POWER_PAGES_BEST_PRACTICES.md archive/legacy-docs/
mv docs/PRODUCT_ROADMAP.md archive/legacy-docs/
mv docs/ALLDATATABLES_DOCUMENTATION.md archive/legacy-docs/
mv docs/deploy-log.md archive/legacy-docs/
mv docs/PowerPages-Web-API-Troubleshoot.md archive/legacy-docs/
```

### Phase 2: Delete Redundant Files
```bash
# Delete redundant Web API documentation
rm docs/WEB_API_BEST_PRACTICES.md
rm docs/WEB_API_SUCCESS_SUMMARY.md
rm docs/QUICK_REFERENCE_WEB_API.md
rm docs/Dataverse-NtoNRelationships.md

# Move root level file to docs
mv CONTROL_MAPPING_SIMPLIFIED_REQUIREMENTS.md docs/
```

### Phase 3: Update Documentation References
- Update `README.md` to remove references to archived files
- Update `REPOSITORY_STRUCTURE.md` to reflect new organization
- Update any documentation that references moved files

## Post-Cleanup Repository Structure

```
RCSA_PowerPages_V3/
├── powerpages/
│   └── rcsa-copilot---site-5joks/    ← ACTIVE: Current working site
├── docs/                             ← Essential documentation only
│   ├── AI_DELEGATION_GUIDE.md        ← For AI assistants
│   ├── BUSINESS_CONTEXT_GUIDE.md     ← Banking knowledge
│   ├── DATAVERSE_INTEGRATION_GUIDE.md ← Integration patterns
│   ├── POWER_PAGES_WEB_API_403_TROUBLESHOOTING.md ← Complete solution
│   ├── CONTROL_MAPPING_TECHNICAL_REFERENCE.md ← Technical details
│   ├── PROJECT_STATUS.md             ← Current status
│   ├── POWER_PLATFORM_CLI_REFERENCE.md ← CLI reference
│   ├── REPOSITORY_STRUCTURE.md       ← Navigation
│   ├── rcsa-power-pages-requirements.md ← Requirements
│   ├── rcsa_data_dictionary.md       ← Data model
│   ├── rcsa-ux-design-system.md      ← Design system
│   ├── LOCAL_DEPLOYMENT_GUIDE.md     ← Deployment guide
│   └── CONTROL_MAPPING_SIMPLIFIED_REQUIREMENTS.md ← (moved from root)
├── archive/                          ← Archived for reference
│   ├── powerpages-versions/          ← Previous versions
│   │   ├── powerpages-current/
│   │   ├── powerpages-final/
│   │   ├── powerpages-test/
│   │   └── powerpages-updated/
│   ├── legacy-docs/                  ← Outdated documentation
│   │   ├── DEPLOYMENT_STRATEGY.md
│   │   ├── DEPLOYMENT_CHECKLIST.md
│   │   ├── CI_SETUP.md
│   │   ├── POWER_PAGES_BEST_PRACTICES.md
│   │   ├── PRODUCT_ROADMAP.md
│   │   ├── ALLDATATABLES_DOCUMENTATION.md
│   │   ├── deploy-log.md
│   │   └── PowerPages-Web-API-Troubleshoot.md
│   └── process-selection-backup/     ← Existing archived content
├── rcsa-design-system/               ← Design system components
├── scripts/                          ← Deployment scripts
├── solution-src/                     ← Dataverse solution
├── solution-export/                  ← Solution exports
├── .github/workflows/                ← CI/CD pipeline
├── .vscode/                          ← VS Code config
└── README.md                         ← Updated main documentation
```

## Benefits of Cleanup

### Improved Navigation
- Clear distinction between active files and archived content
- Easier onboarding for new team members or AI assistants
- Reduced confusion about which files to use

### Better Documentation
- Single source of truth for Web API troubleshooting
- Consolidated technical references
- Clear documentation hierarchy

### Reduced Repository Size
- Remove duplicate powerpages directories
- Clean up redundant documentation
- Maintain only essential files

### Enhanced Maintainability
- Clear working directory structure
- Proper archival of legacy content
- Future-ready organization

## Validation Checklist

After cleanup, verify:
- [ ] `powerpages/rcsa-copilot---site-5joks/` contains all working files
- [ ] Essential documentation remains accessible
- [ ] Archive directories properly organized
- [ ] No broken references in remaining documentation
- [ ] CLI commands still work with updated structure
- [ ] Git history preserved for moved files

---

**Cleanup Rationale**: Following successful Control Mapping 403 error resolution and achievement of working Dataverse integration, repository cleanup ensures focus on essential, working components while preserving historical reference materials. 