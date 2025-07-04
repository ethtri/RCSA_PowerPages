# RCSA Power Pages - LogicGate Risk Cloud Design System

## 🎯 Overview

This design system is inspired by **LogicGate Risk Cloud's** sophisticated enterprise GRC platform interface patterns. It provides a comprehensive set of design tokens, components, and standards for building a best-in-class RCSA workflow tool.

## 🎨 Design Philosophy

### LogicGate Risk Cloud Design Principles

1. **Enterprise-Grade Sophistication**
   - Clean, professional interface with subtle shadows and modern typography
   - Sophisticated data visualization with clear information hierarchy
   - Advanced filtering and search capabilities throughout

2. **Application-Centric Architecture**
   - Purpose-built applications for specific GRC functions
   - Modular design with interconnected workflows
   - Consistent navigation patterns across all modules

3. **Visual Process Workflows**
   - Graph-based relationships showing interconnected risk data
   - Drag-and-drop workflows with visual process builders
   - Clear status indicators and progress tracking

4. **Data-Dense Information Design**
   - Efficient use of screen real estate
   - Hierarchical data organization with clear groupings
   - Bulk operations for enterprise efficiency

## 🛠 Implementation Strategy

### Phase 1: Core Design System
- [x] CSS Design Tokens (colors, typography, spacing)
- [x] Base components (buttons, cards, forms)
- [x] Layout system (grid, flexbox utilities)
- [x] Navigation components

### Phase 2: Application-Specific Components
- [ ] Risk assessment cards with visual indicators
- [ ] Control mapping interfaces
- [ ] Progress tracking components
- [ ] Data visualization elements

### Phase 3: Advanced Interactions
- [ ] Drag-and-drop functionality
- [ ] Advanced filtering systems
- [ ] Bulk operation interfaces
- [ ] Real-time updates and notifications

## 🎨 Color System

### Primary Colors
- **Primary Blue**: #3b82f6 (LogicGate-inspired professional blue)
- **Primary Dark**: #1d4ed8
- **Primary Light**: #dbeafe

### Risk Level Colors
- **Low Risk**: #22c55e (Green)
- **Medium Risk**: #f59e0b (Amber)
- **High Risk**: #ef4444 (Red)
- **Critical Risk**: #7c2d12 (Dark Red)

### Neutral Grays
- **Gray 50**: #f9fafb (Background)
- **Gray 100**: #f3f4f6 (Light backgrounds)
- **Gray 200**: #e5e7eb (Borders)
- **Gray 600**: #4b5563 (Text)
- **Gray 900**: #111827 (Headings)

## 📝 Typography

### Font Family
- **Primary**: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- **Monospace**: 'JetBrains Mono', 'Fira Code', monospace

### Type Scale
- **Display**: 2.25rem (36px) - Page titles
- **Heading 1**: 1.875rem (30px) - Section headers
- **Heading 2**: 1.5rem (24px) - Subsection headers
- **Body Large**: 1.125rem (18px) - Important body text
- **Body**: 1rem (16px) - Default body text
- **Small**: 0.875rem (14px) - Supporting text
- **Caption**: 0.75rem (12px) - Labels and captions

## 🧩 Component Library

### Cards
```css
.lg-card              /* Base card component */
.lg-card-elevated     /* Card with prominent shadow */
.lg-card-interactive  /* Hover effects for clickable cards */
.lg-risk-card         /* Risk assessment specific cards */
```

### Buttons
```css
.lg-btn              /* Base button */
.lg-btn-primary      /* Primary action button */
.lg-btn-secondary    /* Secondary action button */
.lg-btn-outline      /* Outline button */
.lg-btn-ghost        /* Ghost button */
.lg-btn-sm           /* Small button */
.lg-btn-lg           /* Large button */
```

### Badges & Pills
```css
.lg-badge            /* Base badge */
.lg-badge-primary    /* Primary badge */
.lg-badge-success    /* Success badge */
.lg-badge-warning    /* Warning badge */
.lg-badge-danger     /* Danger badge */
.lg-risk-badge       /* Risk level specific badges */
.lg-risk-low         /* Low risk styling */
.lg-risk-medium      /* Medium risk styling */
.lg-risk-high        /* High risk styling */
.lg-risk-critical    /* Critical risk styling */
```

### Forms
```css
.lg-form-group       /* Form field grouping */
.lg-label            /* Form labels */
.lg-input            /* Text inputs */
.lg-input-sm         /* Small input */
.lg-input-lg         /* Large input */
```

### Navigation
```css
.lg-navbar           /* Navigation bar */
.lg-navbar-brand     /* Brand/logo area */
.lg-navbar-nav       /* Navigation links */
.lg-navbar-link      /* Individual nav links */
```

### Layout
```css
.lg-container        /* Page container */
.lg-grid             /* Grid layout */
.lg-grid-cols-1      /* 1 column grid */
.lg-grid-cols-2      /* 2 column grid */
.lg-grid-cols-3      /* 3 column grid */
.lg-grid-cols-4      /* 4 column grid */
.lg-flex             /* Flexbox container */
.lg-flex-col         /* Flex column */
.lg-items-center     /* Center align items */
.lg-justify-between  /* Space between items */
```

## 🎯 Page Templates

### Application Header
```html
<div class="lg-app-header">
  <div class="lg-container">
    <h1 class="lg-app-title">Risk Control Self Assessment</h1>
    <p class="lg-app-subtitle">Enterprise risk management workflow</p>
  </div>
</div>
```

### Enterprise Toolbar
```html
<div class="lg-toolbar">
  <div class="lg-container">
    <div class="lg-toolbar-content">
      <div class="lg-toolbar-actions">
        <button class="lg-btn lg-btn-sm lg-btn-outline">Bulk Actions</button>
        <button class="lg-btn lg-btn-sm lg-btn-ghost">Export</button>
      </div>
      <div class="lg-toolbar-search">
        <input type="text" class="lg-input" placeholder="Search...">
      </div>
    </div>
  </div>
</div>
```

### Risk Assessment Card
```html
<div class="lg-card lg-risk-card risk-medium">
  <div class="lg-control-indicator mapped"></div>
  <div class="lg-card-body">
    <h3 class="lg-heading-4">Credit Risk Assessment</h3>
    <p class="lg-body-sm lg-text-gray-600">Commercial lending processes</p>
    <div class="lg-flex lg-items-center lg-gap-2 lg-mt-4">
      <span class="lg-risk-badge lg-risk-medium">Medium</span>
      <span class="lg-badge lg-badge-success">3 Controls</span>
    </div>
  </div>
</div>
```

## 📱 Responsive Design

### Breakpoints
- **sm**: 640px (Small tablets)
- **md**: 768px (Tablets)
- **lg**: 1024px (Small laptops)
- **xl**: 1280px (Laptops)
- **2xl**: 1536px (Large screens)

### Grid Behavior
- **Mobile**: 1 column layout
- **Tablet**: 2 column layout
- **Desktop**: 3-4 column layout

## 🚀 Usage Guidelines

### 1. Include the Design System
```html
<link rel="stylesheet" href="/rcsa-design-system/logicgate-design-system.css">
```

### 2. Use Semantic HTML
```html
<main class="lg-page">
  <header class="lg-page-header">
    <div class="lg-container">
      <h1 class="lg-page-title">Control Mapping</h1>
      <p class="lg-page-subtitle">Link mitigating controls to identified risks</p>
    </div>
  </header>
  
  <div class="lg-page-content">
    <div class="lg-container">
      <!-- Page content -->
    </div>
  </div>
</main>
```

### 3. Follow Component Patterns
- Always use design system classes
- Maintain consistent spacing with design tokens
- Use semantic color classes for risk levels
- Implement proper focus states for accessibility

## 🎨 Customization

### CSS Custom Properties
The design system uses CSS custom properties (variables) for easy customization:

```css
:root {
  --lg-primary-500: #3b82f6;    /* Change primary color */
  --lg-font-sans: 'Inter', ...;  /* Change font family */
  --lg-space-4: 1rem;           /* Adjust spacing scale */
}
```

### Brand Adaptation
To adapt for different brands:
1. Update color tokens in `:root`
2. Replace logo/brand elements
3. Adjust typography scale if needed
4. Customize component variants

## 🔧 Development Workflow

### 1. Component Development
- Create new components using existing design tokens
- Follow BEM-like naming convention with `lg-` prefix
- Test responsiveness across all breakpoints
- Ensure accessibility compliance

### 2. Page Implementation
- Start with semantic HTML structure
- Apply design system classes
- Add custom styles only when necessary
- Test with real data and edge cases

### 3. Quality Assurance
- Validate HTML semantics
- Check color contrast ratios
- Test keyboard navigation
- Verify responsive behavior

## 📚 Resources

### Design References
- [LogicGate Risk Cloud Platform](https://www.logicgate.com/risk-cloud/)
- [Monday.com Design System](https://developer.monday.com/apps/docs/welcome-apps)
- [Enterprise GRC Best Practices](https://www.logicgate.com/blog/common-rcsa-challenges-and-the-proactive-mindset-and-platform-to-fix-it/)

### Technical Documentation
- [Power Pages Bootstrap 5 Migration](https://learn.microsoft.com/en-us/power-pages/configure/bootstrap-version-5)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

---

**Next Steps:**
1. Apply this design system to Control Mapping page
2. Update all existing pages with new standards
3. Build remaining pages (Residual Assessment, Success Page)
4. Implement advanced interactions and workflows 