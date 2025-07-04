# RCSA Power Pages V2 - Agent Guidelines

## Project Overview
RCSA Power Pages V2 is an AI-powered Risk and Compliance Assessment platform built on Microsoft Power Pages with a LogicGate-inspired design system.

## Deployment Rules
- After editing site files, run the VS Code task "Upload Power Pages to Dev"
- Confirm success by matching "Completed site upload successfully"
- Do not echo secrets or auth tokens in logs or commits
- Update `docs/deploy-log.md` with timestamp after each upload

## Development Workflow
- One logical change per branch/commit
- Commit message style: `feat: ...` | `fix: ...` | `refactor: ...`
- Open pull request (can be draft) even if CI is disabled
- Merge when reviewed
- Never commit files containing secrets, tokens, or `.pac` cache

## File Structure
- Main site files: `powerpages/rcsa-copilot---site-5joks/`
- Design system: `powerpages/rcsa-copilot---site-5joks/web-files/`
- LogicGate CSS: `logicgate-design-system.css`
- LogicGate JS: `logicgate-components.js`

## Key Pages
1. Dashboard - Main landing page
2. Process Selection - Assessment scope selection
3. Risk Identification - AI-powered risk detection
4. Control Mapping - Risk-control mapping interface
5. Residual Assessment - Final scoring with heat maps
6. Success Page - Completion summary

## Prompt Patterns
- "Refactor `/risk-register` into Bootstrap-5 cards, then run the Upload task"
- "Batch all wizard-page fixes, *do not upload yet*; when complete, run the Upload task once"
- "Commit as `feat: card grid`, push branch `card-grid-ui`, open draft PR"

## Testing
- Run `npm test` to validate page structure and functionality
- Use VS Code task "Validate Power Pages Structure" for file validation
- Manual testing in Power Pages environment after upload

## Design System Standards
- Follow LogicGate design patterns
- Use enterprise-grade color scheme and typography
- Maintain responsive design principles
- Consistent component styling across all pages 