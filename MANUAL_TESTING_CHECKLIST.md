# 🧪 Manual Testing Checklist - RCSA Power Pages

## 📋 **Pre-Testing Setup**
- [ ] Power Pages site uploaded successfully
- [ ] GitHub CI/CD pipeline triggered
- [ ] Browser developer tools open
- [ ] Test different screen sizes

## 🏠 **Dashboard Page Testing**

### **Visual & Layout**
- [ ] Page loads within 2 seconds
- [ ] Dynamic greeting shows correct time-based message
- [ ] User name displays correctly (or fallback)
- [ ] Current date shows properly formatted
- [ ] FCB branding and colors applied correctly
- [ ] All Font Awesome icons load properly

### **Data Integration**
- [ ] Metrics cards show real numbers from Dataverse
- [ ] Recent assessments list populates (or shows empty state)
- [ ] Business units overview displays correctly
- [ ] System status indicators show "Online/Ready"
- [ ] Fallback content shows when no data available

### **Interactive Elements**
- [ ] "Start New Assessment" button navigates to Process Selection
- [ ] Quick action buttons work correctly
- [ ] "View All Data" links function properly
- [ ] All navigation links work as expected

### **Responsive Design**
- [ ] Mobile view (320px): Layout stacks properly
- [ ] Tablet view (768px): Cards arrange correctly
- [ ] Desktop view (1024px+): Full layout displays
- [ ] No horizontal scrolling on any screen size

### **Accessibility**
- [ ] Tab navigation works through all elements
- [ ] Screen reader announces content properly
- [ ] Color contrast meets WCAG standards
- [ ] All interactive elements have focus indicators

## ⚙️ **Process Selection Page Testing**

### **Visual & Layout**
- [ ] Progress indicator shows Step 1 as active
- [ ] Page header displays correctly
- [ ] Two-step layout (BU selection → Process selection)
- [ ] Process section initially disabled/grayed out
- [ ] Continue button initially disabled

### **Business Unit Selection**
- [ ] Dropdown populates with business units from Dataverse
- [ ] Fallback options show when no data available
- [ ] Business unit description appears on selection
- [ ] Process section becomes enabled after BU selection
- [ ] Loading animation shows during process fetch

### **Process Selection**
- [ ] Process cards load based on business unit
- [ ] Cards show: name, description, criticality, time, risk count
- [ ] Criticality badges have correct colors (High=red, Medium=amber, Low=green)
- [ ] Cards have hover effects and visual feedback
- [ ] Selection state shows checkmark and border highlight
- [ ] Only one process can be selected at a time

### **Form Validation**
- [ ] Continue button only enables with both selections
- [ ] Error message shows if trying to continue without selections
- [ ] Form validation prevents empty submissions
- [ ] Required field indicators display correctly

### **JavaScript Functionality**
- [ ] Business unit change triggers process loading
- [ ] Process selection updates continue button state
- [ ] Keyboard navigation works (Enter/Space to select)
- [ ] Screen reader announces selections
- [ ] Console shows no JavaScript errors

### **Responsive Design**
- [ ] Mobile: Process cards stack to single column
- [ ] Tablet: Process cards show 2 columns
- [ ] Desktop: Process cards show 2 columns with proper spacing
- [ ] Buttons remain accessible on all screen sizes

### **Performance**
- [ ] Initial page load < 2 seconds
- [ ] Process loading animation < 1 second
- [ ] Smooth animations at 60fps
- [ ] No layout shifts during loading

## 🔗 **Integration Testing**

### **Navigation Flow**
- [ ] Dashboard → Process Selection works
- [ ] Process Selection → Dashboard (back button) works
- [ ] Process Selection → Risk Identification (continue) works
- [ ] All internal links function correctly

### **Data Persistence**
- [ ] Selected business unit stored in sessionStorage
- [ ] Selected process stored in sessionStorage
- [ ] Selections persist across page refreshes
- [ ] Data available for next step

### **Error Handling**
- [ ] Graceful handling of missing data
- [ ] Appropriate error messages for users
- [ ] Fallback content when Dataverse unavailable
- [ ] No console errors or warnings

## 🌐 **Cross-Browser Testing**

### **Chrome (Latest)**
- [ ] All features work correctly
- [ ] Styling renders properly
- [ ] JavaScript executes without errors
- [ ] Performance meets targets

### **Firefox (Latest)**
- [ ] All features work correctly
- [ ] Styling renders properly
- [ ] JavaScript executes without errors
- [ ] Performance meets targets

### **Safari (Latest)**
- [ ] All features work correctly
- [ ] Styling renders properly
- [ ] JavaScript executes without errors
- [ ] Performance meets targets

### **Edge (Latest)**
- [ ] All features work correctly
- [ ] Styling renders properly
- [ ] JavaScript executes without errors
- [ ] Performance meets targets

## 📱 **Mobile Testing**

### **iOS Safari**
- [ ] Touch interactions work correctly
- [ ] Viewport scales properly
- [ ] No horizontal scrolling
- [ ] Performance acceptable

### **Android Chrome**
- [ ] Touch interactions work correctly
- [ ] Viewport scales properly
- [ ] No horizontal scrolling
- [ ] Performance acceptable

## 🎯 **Quality Gates**

### **Must Pass (Blocking)**
- [ ] No JavaScript console errors
- [ ] All navigation links work
- [ ] Data integration functional
- [ ] Responsive design works
- [ ] Accessibility basics met

### **Should Pass (Important)**
- [ ] Performance under 2 seconds
- [ ] Professional visual design
- [ ] Smooth animations
- [ ] Comprehensive error handling
- [ ] Cross-browser compatibility

### **Nice to Have (Enhancement)**
- [ ] Advanced accessibility features
- [ ] Optimal performance < 1 second
- [ ] Advanced responsive features
- [ ] Enhanced user feedback

## 📊 **Test Results**

**Dashboard Page Score: ___/25**
**Process Selection Page Score: ___/30**
**Overall Quality Score: ___/55**

### **Quality Assessment**
- **90-100%**: 🎉 Excellent - Ready for production
- **80-89%**: ✅ Good - Minor improvements needed
- **70-79%**: ⚠️ Acceptable - Several improvements needed
- **<70%**: ❌ Poor - Major improvements required

## 🚀 **Next Steps**

### **If Tests Pass (>80%)**
1. ✅ Mark current page as complete
2. 🎯 Move to next page development
3. 📋 Update todo list
4. 🔄 Repeat testing cycle

### **If Tests Fail (<80%)**
1. 📝 Document specific failures
2. 🔧 Fix identified issues
3. 🧪 Re-run tests
4. 🔄 Iterate until passing

---

**Testing Date**: ___________  
**Tester**: ___________  
**Browser/Device**: ___________  
**Notes**: ___________ 