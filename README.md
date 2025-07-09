# RCSA Power Pages V2 - AI-Powered Risk and Compliance Assessment

## 🚀 Project Status: Phase 1 Complete - Authentication Implemented

**Current Phase:** Phase 2 - Testing & Integration  
**Environment:** Risk and Compliance Assessment (https://org601a79e1.crm.dynamics.com/)  
**Last Updated:** December 2024

> **✅ Phase 1 Achievement:** Microsoft Entra ID authentication successfully implemented with automatic role assignment and business unit self-selection capabilities.

## Overview

RCSA Power Pages V2 is an enterprise-grade AI-powered Risk and Compliance Assessment platform built on Microsoft Power Pages. It features seamless Microsoft Entra ID integration, comprehensive LogicGate-inspired design system, and sophisticated risk assessment capabilities with interactive visualizations.

## 🎯 Current Status

### ✅ Completed Features
- **Microsoft Entra ID Integration**: Seamless SSO for internal users
- **Automatic Role Assignment**: Users automatically assigned to "Authenticated Users" web role
- **Business Unit Self-Selection**: MVP approach with dropdown selection from cr129_bu table
- **Custom Authentication Pages**: Modern sign-in and account management pages
- **Claims Mapping**: Automatic contact creation with email, name, and profile data
- **Security Configuration**: Local login disabled, external authentication enabled

### 🔄 In Progress
- **Authentication Flow Testing**: End-to-end testing of Microsoft Entra ID integration
- **Page Content Implementation**: Adding HTML content to custom pages in Power Pages Studio
- **Role-Based Process Filtering**: Connecting authentication with existing process access control

## 📋 Quick Start

### Prerequisites

1. **Power Platform CLI**: Install the Microsoft Power Platform CLI
2. **VS Code**: For integrated development experience
3. **Power Pages Environment**: Access to Power Pages environment
4. **Microsoft Entra ID**: Corporate authentication configured

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

## 📁 Project Structure

```
RCSA_PowerPages_V2/
├── powerpages/
│   └── rcsa-copilot---site-5joks/    # Main Power Pages site
│       ├── web-files/                # CSS, JS, and assets
│       ├── web-pages/                # Page templates
│       ├── web-templates/            # Site templates
│       └── sitesetting.yml           # Authentication configuration
├── docs/                             # 📚 Organized documentation
│   ├── PROJECT_STATUS.md             # Current project status
│   ├── DEPLOYMENT_STRATEGY.md        # Deployment procedures
│   ├── POWER_PAGES_BEST_PRACTICES.md # Development guidelines
│   ├── deploy-log.md                 # Deployment history
│   └── [additional docs...]
├── data-import/                      # Sample data for testing
├── rcsa-design-system/               # LogicGate design components
├── .vscode/
│   └── tasks.json                    # VS Code tasks
└── package.json                      # Project dependencies
```

## 🔐 Authentication Architecture

### Microsoft Entra ID Integration
- **Primary Identity Provider**: Microsoft Entra ID (https://login.microsoftonline.com/)
- **Local Authentication**: Disabled for security
- **Claims Mapping**: Automatic contact creation with email, name, and profile data
- **Role Assignment**: Automatic assignment to "Authenticated Users" web role

### Business Unit Strategy (MVP)
- **Self-Selection**: Users choose business unit on first login
- **Data Source**: cr129_bu table with existing business units
- **Access Levels**: Analyst (own process), Manager (BU processes), Executive (all processes)
- **Integration**: Leverages cr129_proc_businessunitname_cr129_bu lookup relationship

### Dataverse Schema [[memory:2487076]]
- **Tables**: cr129_[displayname] format (cr129_proc, cr129_bu, cr129_risk)
- **Fields**: cr129_[fieldname] format (cr129_processname, cr129_risktitle)
- **Exception**: BUName field uses cr129_businessunitname not cr129_buname
- **User Roles**: Executive (100000000), Manager (100000001), Analyst (100000002)

## 🎨 Key Pages

### Authentication Pages
1. **Sign-In Page** (`/Sign-In`): Modern split-screen design with Microsoft Entra ID integration
2. **My Account Page** (`/My-Account`): User profile with business unit self-selection

### Application Pages
1. **Dashboard**: Main landing page with navigation and overview
2. **Process Selection**: Choose assessment process and scope
3. **Risk Identification**: AI-powered risk identification interface
4. **Control Mapping**: Map controls to identified risks
5. **Residual Assessment**: Final risk scoring with heat map visualization

## 🎨 LogicGate Design System

The platform features a comprehensive LogicGate-inspired design system:

- **Global Styles**: Consistent typography, colors, and spacing
- **Component Library**: Reusable UI components
- **Interactive Elements**: Buttons, forms, and navigation
- **Data Visualization**: Charts, heat maps, and progress indicators
- **Responsive Framework**: Mobile-first design approach

## 🛠️ Development Commands

| Command | Purpose |
|---------|---------|
| `npm run upload` | Upload changes to Power Pages |
| `npm run validate` | Validate file structure |
| `npm test` | Run test suite |

## 📚 Documentation

### Core Documentation
- **[Project Status](docs/PROJECT_STATUS.md)**: Current progress and next steps
- **[Deployment Strategy](docs/DEPLOYMENT_STRATEGY.md)**: Deployment procedures and best practices
- **[Power Pages Best Practices](docs/POWER_PAGES_BEST_PRACTICES.md)**: Development guidelines
- **[UX Design System](docs/rcsa-ux-design-system.md)**: Design standards and components

### Technical Reference
- **[Data Dictionary](docs/rcsa_data_dictionary.md)**: Dataverse schema reference
- **[Requirements](docs/rcsa-power-pages-requirements.md)**: Original project requirements
- **[Data Tables Documentation](docs/ALLDATATABLES_DOCUMENTATION.md)**: Table structure details

### Deployment & Operations
- **[Local Deployment Guide](docs/LOCAL_DEPLOYMENT_GUIDE.md)**: Local development setup
- **[Deployment Checklist](docs/DEPLOYMENT_CHECKLIST.md)**: Pre-deployment validation
- **[Deploy Log](docs/deploy-log.md)**: Deployment history and tracking

## 🚀 Next Steps (Phase 2)

### Immediate Actions Required
1. **Complete Authentication Testing**
   - Verify local login is disabled in live environment
   - Test Microsoft Entra ID sign-in flow end-to-end
   - Validate automatic contact creation and role assignment

2. **Implement Page Content**
   - Add provided HTML content to Sign-In page in Power Pages Studio
   - Add provided HTML content to My Account page in Power Pages Studio
   - Test responsive design across devices

3. **Role-Based Process Filtering**
   - Connect authentication system with existing process filtering
   - Implement business unit access control
   - Test hierarchical access permissions

### Development Tasks Pipeline
| Task | Priority | Estimated Effort |
|------|----------|------------------|
| Authentication Flow Testing | High | 2-3 days |
| Role-Based Process Filtering | High | 3-5 days |
| Business Unit Access Control | Medium | 2-3 days |
| Security Validation | High | 1-2 days |

## 🔧 Troubleshooting

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

1. Check **[Project Status](docs/PROJECT_STATUS.md)** for current state
2. Review **[Deploy Log](docs/deploy-log.md)** for recent deployments
3. Validate file structure: `npm run validate`
4. Review error messages in terminal

## 🔒 Security

### Authentication Security
- **Microsoft Entra ID**: Enterprise-grade identity provider
- **Local Authentication**: Disabled for security compliance
- **Claims Validation**: Automatic contact creation with verified claims
- **Role-Based Access**: Hierarchical permissions based on business unit and role

### Never Commit
- `.pac/` - PAC CLI cache
- `pac-auth.json` - Authentication files
- `.env` - Environment variables
- Any files containing secrets or tokens

## 🤝 Contributing

1. **Review current status** in `docs/PROJECT_STATUS.md`
2. **Create feature branch** from main
3. **Make changes** in `powerpages/` directory
4. **Upload and test** using VS Code task
5. **Update deploy log** with changes
6. **Commit with proper message** format
7. **Push branch** and create pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For technical support:
- Review **[Project Status](docs/PROJECT_STATUS.md)** for current state
- Check **[Deployment Strategy](docs/DEPLOYMENT_STRATEGY.md)** for procedures
- Validate setup: `npm run validate`
- Contact development team for escalation

---

**🎯 Current Focus:** Phase 2 testing and integration of Microsoft Entra ID authentication with role-based process filtering.
