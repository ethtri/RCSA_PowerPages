# RCSA Power Pages V2 - Streamlined Deployment Strategy

## Overview

This document outlines the streamlined, practical deployment approach for RCSA Power Pages V2, focusing on efficiency and simplicity while maintaining proper version control hygiene.

## Core Deployment Flow

### 1. Simple Upload Command
```bash
pac pages upload --path powerpages --environment https://org601a79e1.crm.dynamics.com
```

### 2. VS Code Integration
Use the **"Upload Power Pages to Dev"** task instead of typing commands:
- **Shortcut**: `Ctrl+Shift+P` → "Tasks: Run Task" → "Upload Power Pages to Dev"
- **Or**: Use Command Palette → "Upload Power Pages to Dev"

### 3. Success Confirmation
Look for: `"Completed site upload successfully"`

## Development Workflow

### Daily Development Cycle
1. **Make changes** to files in `powerpages/`
2. **Run VS Code task**: "Upload Power Pages to Dev"
3. **Verify success** in terminal output
4. **Test changes** in Power Pages environment
5. **Update deploy log** with timestamp

### Batch Changes Workflow
1. **Make multiple related changes** (do not upload yet)
2. **When complete**, run the Upload task once
3. **Test all changes** together
4. **Update deploy log** with summary

## Version Control Hygiene

### Commit Standards
- **One logical change per commit**
- **Commit message format**: 
  - `feat: add new risk assessment wizard`
  - `fix: resolve dashboard layout issue`
  - `refactor: improve control mapping UI`

### Branch Management
- **Create feature branches** for each logical change
- **Open pull requests** (can be draft) even if CI is disabled
- **Merge when reviewed**
- **Delete merged branches**

### Never Commit
- Files containing secrets or tokens
- `.pac` cache files
- Authentication files
- Temporary or backup files

## File Management

### Key Directories
- **Main site**: `powerpages/rcsa-copilot---site-5joks/`
- **Design system**: `powerpages/rcsa-copilot---site-5joks/web-files/`
- **Documentation**: `docs/`
- **Scripts**: `scripts/` (for validation only)

### Protected Files
- `.pac/` - PAC CLI cache
- `pac-auth.json` - Authentication cache
- `.env` - Environment variables
- `*.log` - Log files

## Deployment Log Maintenance

### After Each Upload
1. **Open** `docs/deploy-log.md`
2. **Add entry** with format:
   ```markdown
   ### 2024-01-15 14:30:22
   - **Changes**: Updated dashboard layout with new LogicGate cards
   - **Status**: Upload successful
   - **Notes**: Verified design system integration working correctly
   ```

### Log Entry Guidelines
- **Timestamp**: Use current date/time
- **Changes**: Brief description of what was modified
- **Status**: Upload successful/failed
- **Notes**: Any relevant observations or issues

## VS Code Configuration

### Required Extensions
- **Run On Save** (optional): Auto-upload on file save
- **GitLens**: Enhanced Git integration
- **PowerShell**: For validation scripts

### Tasks Available
- **Upload Power Pages to Dev**: Main deployment task
- **Validate Power Pages Structure**: File structure validation
- **Run Power Pages Tests**: Execute test suite

### Optional: Auto-Upload on Save
Configure Run On Save extension to automatically upload when files in `powerpages/` are saved.

## Authentication Management

### Service Principal Profile
- **Use cached profile** - no need to re-authenticate frequently
- **Never print or store secrets** in logs or commits
- **Profile managed by PAC CLI** automatically

### Authentication Issues
If authentication fails:
1. **Check current auth**: `pac auth list`
2. **Re-authenticate if needed**: `pac auth create --url https://org601a79e1.crm.dynamics.com`
3. **Use service principal** for automated processes

## Prompt Patterns for AI Assistance

### Good Patterns
- "Refactor `/risk-register` into Bootstrap-5 cards, then run the Upload task"
- "Batch all wizard-page fixes, *do not upload yet*; when complete, run the Upload task once"
- "Commit as `feat: card grid`, push branch `card-grid-ui`, open draft PR"

### Development Instructions
- "Update the dashboard layout with new LogicGate components"
- "Fix the control mapping validation, then upload changes"
- "Refactor risk assessment wizard into modular components"

## Quality Assurance

### Pre-Upload Validation
- **Visual inspection**: Check changes in VS Code
- **Run validation**: Use "Validate Power Pages Structure" task
- **Test locally**: If possible, test logic before upload

### Post-Upload Verification
- **Check terminal output**: Confirm "Completed site upload successfully"
- **Test in Power Pages**: Verify functionality works
- **Update deploy log**: Document the deployment

### Testing Strategy
- **Manual testing**: Primary method for UI changes
- **Automated tests**: Use `npm test` for structure validation
- **Cross-browser testing**: Verify compatibility

## Troubleshooting

### Common Issues
1. **Authentication expired**: Re-run `pac auth create`
2. **File path issues**: Ensure working directory is project root
3. **Network issues**: Check connection to Power Platform
4. **File locks**: Close files in other applications

### Recovery Procedures
1. **Check PAC CLI status**: `pac --version`
2. **Verify authentication**: `pac auth list`
3. **Test connection**: `pac org list`
4. **Re-upload if needed**: Run Upload task again

## Best Practices Summary

### ✅ DO
- Use VS Code task for uploads
- Maintain deploy log after each upload
- Follow commit message conventions
- Test changes after upload
- Use feature branches for development

### ❌ DON'T
- Commit secrets or auth tokens
- Upload incomplete changes
- Skip deploy log updates
- Work directly on main branch
- Ignore upload error messages

## Migration from Complex Scripts

### What Changed
- **Simplified**: Single upload command instead of complex scripts
- **Integrated**: VS Code tasks instead of terminal commands
- **Streamlined**: Focus on essential workflow only
- **Practical**: Based on real-world usage patterns

### Legacy Script Usage
- **Keep validation scripts** for occasional use
- **Remove complex deployment scripts** - not needed
- **Focus on VS Code integration** for daily work
- **Maintain backup procedures** for emergency use only

---

*This strategy prioritizes simplicity, efficiency, and practical daily usage over complex automation.* 