# RCSA Application - UX/CX Design System

## Design Philosophy

### Core Principles
1. **Trust Through Clarity** - Banking requires absolute confidence. Every element should feel stable, professional, and transparent.
2. **Efficiency First** - Users are busy professionals. Minimize clicks, maximize clarity.
3. **Guided Intelligence** - AI assists but never overwhelms. Humans remain in control.
4. **Celebration of Progress** - Acknowledge time saved and goals achieved.

### Visual Personality
- **Professional** but not boring
- **Modern** but not trendy  
- **Clean** but not sterile
- **Friendly** but not casual

---

## Visual Design System

### Color Palette

```
Primary Colors:
- Primary Blue:    #0066CC  (CapTech brand, CTAs, links)
- Success Green:   #0D7F3F  (Completion, low risk, positive)
- Warning Amber:   #CC6600  (Medium risk, attention needed)
- Danger Red:      #CC0000  (High risk, errors, urgent)

Neutral Colors:
- Dark Gray:       #2B2B2B  (Primary text)
- Medium Gray:     #4A4A4A  (Body text)
- Light Gray:      #6B6B6B  (Captions, helpers)
- Border Gray:     #E5E5E5  (Borders, dividers)
- Background:      #F5F5F5  (Page background)
- Pure White:      #FFFFFF  (Cards, containers)

Accent Colors:
- Teal:           #008B8B  (Operational category)
- Purple:         #6600CC  (Market category)
- Orange:         #FF6600  (Credit category)
```

### Typography

```
Font Family: 
'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif

Type Scale:
- Display:  32px / 1.2 / 600  (Page titles)
- Heading1: 24px / 1.3 / 600  (Section headers)
- Heading2: 20px / 1.4 / 600  (Card titles)  
- Heading3: 18px / 1.4 / 500  (Subsections)
- Body:     14px / 1.6 / 400  (Default text)
- Small:    12px / 1.5 / 400  (Captions, labels)

Letter Spacing:
- Headers: -0.02em (Tighter)
- Body: Normal
- Buttons: 0.02em (Slightly wider)
```

### Spacing System

```
Base Unit: 8px

Scale:
- xs:  8px   (Tight spacing)
- sm:  16px  (Element spacing)
- md:  24px  (Section spacing)
- lg:  32px  (Major sections)
- xl:  48px  (Page sections)
- xxl: 64px  (Hero sections)

Container Padding: 24px
Page Margins: 40px
Max Content Width: 1200px
```

### Component Styling

#### Cards
```css
- Background: #FFFFFF
- Border: 1px solid #E5E5E5
- Border Radius: 8px
- Padding: 24px
- Shadow: 0 2px 4px rgba(0,0,0,0.08)
- Hover Shadow: 0 4px 8px rgba(0,0,0,0.12)
- Transition: all 200ms ease
```

#### Buttons
```css
Primary:
- Background: #0066CC
- Text: #FFFFFF
- Hover: 10% darker
- Active: 20% darker
- Height: 48px
- Padding: 0 24px
- Border Radius: 4px
- Font Weight: 600

Secondary:
- Background: #FFFFFF
- Text: #0066CC
- Border: 1px solid #0066CC
- Hover: #F0F7FF background

Disabled:
- Background: #E5E5E5
- Text: #999999
- Cursor: not-allowed
```

#### Form Elements
```css
- Height: 40px
- Border: 1px solid #E5E5E5
- Border Radius: 4px
- Padding: 0 12px
- Focus Border: 2px solid #0066CC
- Error Border: 2px solid #CC0000
- Background: #FFFFFF
```

---

## Interaction Patterns

### Loading States
- **Skeleton Screens**: Gray animated placeholders that match content shape
- **Spinner**: Only for actions <3 seconds
- **Progress Bar**: For multi-step operations
- **Loading Text**: "Analyzing your process..." (specific, not generic)

### Feedback Patterns
```
Success:
- Green checkmark icon
- "Success!" + specific message
- Auto-dismiss after 3 seconds

Error:
- Red X icon
- Problem + Solution format
- Persist until dismissed
- Never blame the user

Warning:
- Amber triangle icon  
- Contextual information
- Suggest action
```

### Hover Effects
- **Buttons**: Darken 10%
- **Cards**: Elevate shadow
- **Links**: Underline appears
- **Interactive Elements**: Cursor pointer
- **Transition**: 200ms ease

### Animation Principles
- **Purpose**: Only animate to provide feedback or guide attention
- **Duration**: 200-300ms for micro-interactions
- **Easing**: ease-in-out for natural feel
- **Performance**: Use CSS transforms, not position changes

---

## Layout Patterns

### Page Structure
```
┌─────────────────────────────────────┐
│ Header (60px) - Fixed              │
├─────────────────────────────────────┤
│ Page Title & Breadcrumb (80px)     │
├─────────────────────────────────────┤
│                                     │
│ Main Content                        │
│ (40px margins, 1200px max)         │
│                                     │
├─────────────────────────────────────┤
│ Footer (Optional)                   │
└─────────────────────────────────────┘
```

### Card Layouts
- **Grid**: 2-3 columns on desktop
- **Gap**: 24px between cards
- **Responsive**: Stack on smaller screens
- **Equal Heights**: Use flexbox

### Data Display
- **Tables**: Zebra striping, hover highlight
- **Lists**: Clear separation, adequate padding
- **Empty States**: Icon + message + action
- **Pagination**: Show 20 items default

---

## Accessibility Standards

### WCAG 2.1 AA Compliance
- **Color Contrast**: 4.5:1 for body text, 3:1 for large text
- **Focus Indicators**: 2px solid outline, never remove
- **Keyboard Navigation**: All interactive elements reachable
- **Screen Readers**: Semantic HTML, ARIA labels where needed

### Interactive Elements
- **Touch Targets**: Minimum 44x44px
- **Click Targets**: Extend beyond visual bounds
- **Error Messages**: Associated with fields
- **Required Fields**: Marked with * and aria-required

---

## Content Guidelines

### Voice & Tone
- **Professional**: Use banking terminology correctly
- **Conversational**: Write like a helpful colleague
- **Concise**: Get to the point quickly
- **Positive**: Focus on capabilities, not limitations

### Messaging Examples
```
Good:
✓ "Great! Your assessment is complete."
✓ "Select the risks that apply to Wire Transfers"
✓ "This will take about 2 seconds..."

Avoid:
✗ "Error: Invalid input"
✗ "You must select risks"
✗ "Please wait..."
```

### AI-Related Content
- Always mark AI content with ✨ sparkle emoji
- Use "suggested" not "recommended"
- Explain AI reasoning when possible
- Allow human override always

---

## Responsive Behavior

### Desktop-Only Optimization
Since this is desktop-only, optimize for:
- **1366x768** minimum (common enterprise laptop)
- **1920x1080** standard (most common)
- **2560x1440** maximum (high-res monitors)

### Layout Breakpoints
```css
/* Standard desktop */
@media (min-width: 1200px) {
  - 2-3 column layouts
  - Side-by-side comparisons
  - Expanded data tables
}

/* Large desktop */
@media (min-width: 1600px) {
  - Increase font sizes slightly
  - More generous spacing
  - Wider content areas
}
```

---

## Component Library

### Status Badges
```
Style: Rounded rectangle (20px radius)
Padding: 4px 12px
Font: 12px, 600 weight

Colors:
- Pending: Blue background, white text
- In Progress: Amber background, white text
- Complete: Green background, white text
- Overdue: Red background, white text
```

### Progress Indicators
```
Step Indicator:
- Circle: 32px diameter
- Active: Filled with primary color
- Complete: Checkmark icon
- Inactive: Gray outline
- Connected by 2px line
```

### Heat Map Cells
```
Size: 60x60px
Border: 1px white
Content: Score number centered
Hover: Brightness 110%
Selected: 3px blue border

Colors by score:
- 1-5: #0D7F3F (Green)
- 6-10: #FFC107 (Yellow)
- 11-15: #CC6600 (Amber)
- 16-25: #CC0000 (Red)
```

---

## Do's and Don'ts

### Do's ✓
- Use consistent spacing
- Provide clear feedback
- Show progress indicators
- Celebrate achievements
- Use professional language
- Test with real data

### Don'ts ✗
- Don't use more than 3 font sizes per page
- Don't animate without purpose
- Don't hide important actions
- Don't use jargon without explanation
- Don't rely on color alone
- Don't make users guess

---

## Quick Reference

### Every page should have:
1. Clear title and purpose
2. Breadcrumb navigation
3. Primary action prominent
4. Consistent header/footer
5. Loading states for async operations
6. Error handling with helpful messages

### Every interaction should:
1. Provide immediate feedback
2. Show clear next steps
3. Allow correction/undo
4. Explain wait times
5. Celebrate success

---

This design system ensures your RCSA app feels professional, modern, and trustworthy while maintaining the efficiency that impresses executives.