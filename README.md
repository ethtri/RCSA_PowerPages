# RCSA Power Pages V2 - AI-Powered Risk and Compliance Assessment

## Overview

RCSA Power Pages V2 is an enterprise-grade AI-powered Risk and Compliance Assessment platform built on Microsoft Power Pages. It features a comprehensive LogicGate-inspired design system and provides sophisticated risk assessment capabilities with interactive visualizations.

## Features

- **AI-Powered Risk Assessment**: Intelligent risk identification and scoring
- **Interactive Heat Maps**: 5x5 risk assessment matrices with visual indicators
- **LogicGate Design System**: Enterprise-grade UI components and styling
- **Comprehensive Workflow**: End-to-end risk assessment process
- **Real-time Validation**: Automated validation and error checking
- **Responsive Design**: Mobile-first approach with modern UX

## Quick Start

### Prerequisites

1. **Power Platform CLI**: Install the Microsoft Power Platform CLI
2. **VS Code**: For integrated development experience
3. **Power Pages Environment**: Access to Power Pages environment

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd RCSA_PowerPages_V2

# Install dependencies
npm install

# Authenticate with Power Platform (one-time setup)
pac auth create --url https://org601a79e1.crm.dynamics.com
```

### Development Workflow

1. **Make changes** to files in `powerpages/`
2. **Upload changes** using VS Code task: "Upload Power Pages to Dev"
3. **Verify success** by looking for "Completed site upload successfully"
4. **Test changes** in Power Pages environment
5. **Update deploy log** in `docs/deploy-log.md`

### VS Code Integration

Use the built-in task instead of typing commands:
- **Command Palette**: `Ctrl+Shift+P` → "Tasks: Run Task" → "Upload Power Pages to Dev"
- **Or use the terminal**: `npm run upload`

## Project Structure

```
RCSA_PowerPages_V2/
├── powerpages/
│   └── rcsa-copilot---site-5joks/    # Main Power Pages site
│       ├── web-files/                # CSS, JS, and assets
│       ├── web-pages/                # Page templates
│       └── web-templates/            # Site templates
├── docs/
│   ├── deploy-log.md                 # Deployment tracking
│   └── DEPLOYMENT_STRATEGY.md        # Deployment guide
├── scripts/
│   └── validate-structure.ps1        # Validation script
├── .vscode/
│   └── tasks.json                    # VS Code tasks
└── test-pages.js                     # Test suite
```

## Key Pages

1. **Dashboard**: Main landing page with navigation and overview
2. **Process Selection**: Choose assessment process and scope
3. **Risk Identification**: AI-powered risk identification interface
4. **Control Mapping**: Map controls to identified risks
5. **Residual Assessment**: Final risk scoring with heat map visualization
6. **Success Page**: Completion summary and next steps

## LogicGate Design System

The platform features a comprehensive LogicGate-inspired design system:

- **Global Styles**: Consistent typography, colors, and spacing
- **Component Library**: Reusable UI components
- **Interactive Elements**: Buttons, forms, and navigation
- **Data Visualization**: Charts, heat maps, and progress indicators
- **Responsive Framework**: Mobile-first design approach

## Development Commands

| Command | Purpose |
|---------|---------|
| `npm run upload` | Upload changes to Power Pages |
| `npm run validate` | Validate file structure |
| `npm test` | Run test suite |

## Version Control

### Commit Standards
- **Format**: `feat: description` | `fix: description` | `refactor: description`
- **One logical change per commit**
- **Create feature branches** for development
- **Open pull requests** for code review

### Branch Workflow
```bash
# Create feature branch
git checkout -b feature/new-risk-wizard

# Make changes and commit
git add .
git commit -m "feat: add new risk assessment wizard"

# Push and create PR
git push origin feature/new-risk-wizard
```

## Deployment Log

After each upload, update `docs/deploy-log.md`:

```markdown
### 2024-01-15 14:30:22
- **Changes**: Updated dashboard layout with new LogicGate cards
- **Status**: Upload successful
- **Notes**: Verified design system integration working correctly
```

## Testing

### Manual Testing
- **Primary method**: Test changes in Power Pages environment
- **Cross-browser**: Verify compatibility across browsers
- **Mobile**: Test responsive design on mobile devices

### Automated Testing
```bash
npm test  # Run structure and functionality tests
```

## Troubleshooting

### Common Issues

1. **Authentication expired**
   ```bash
   pac auth create --url https://org601a79e1.crm.dynamics.com
   ```

2. **Upload fails**
   - Check network connection
   - Verify file paths
   - Ensure no file locks

3. **VS Code task not found**
   - Reload VS Code window
   - Check `.vscode/tasks.json` exists

### Getting Help

1. Check deployment log for recent issues
2. Validate file structure: `npm run validate`
3. Review error messages in terminal
4. Contact development team

## Security

### Never Commit
- `.pac/` - PAC CLI cache
- `pac-auth.json` - Authentication files
- `.env` - Environment variables
- Any files containing secrets or tokens

### Protected by .gitignore
- Authentication cache
- Environment files
- Log files
- Temporary files

## Contributing

1. **Create feature branch** from main
2. **Make changes** in `powerpages/` directory
3. **Upload and test** using VS Code task
4. **Update deploy log** with changes
5. **Commit with proper message** format
6. **Push branch** and create pull request
7. **Merge after review**

## License

This project is licensed under the MIT License.

## Support

For technical support:
- Review `docs/DEPLOYMENT_STRATEGY.md`
- Check `docs/deploy-log.md` for recent deployments
- Validate setup: `npm run validate`
- Contact RCSA development team

---

*Built with ❤️ by the RCSA Team*
