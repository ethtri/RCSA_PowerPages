/**
 * RCSA Power Pages Testing Script
 * Comprehensive validation for Dashboard and Process Selection pages
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Test Results
let testResults = {
    dashboard: {
        passed: 0,
        failed: 0,
        tests: []
    },
    processSelection: {
        passed: 0,
        failed: 0,
        tests: []
    }
};

// Test utilities
function addTest(page, testName, passed, message) {
    testResults[page].tests.push({
        name: testName,
        passed,
        message
    });
    
    if (passed) {
        testResults[page].passed++;
        console.log(`✅ ${testName}: ${message}`);
    } else {
        testResults[page].failed++;
        console.log(`❌ ${testName}: ${message}`);
    }
}

function validateHTML(content, pageName) {
    console.log(`\n🔍 Testing ${pageName} Page HTML Structure...`);
    
    try {
        const dom = new JSDOM(content);
        const document = dom.window.document;
        
        // Test 1: Check for required CSS links
        const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
        const hasRCSAStyles = Array.from(cssLinks).some(link => 
            link.href.includes('rcsa-styles.css') || link.href.includes('~/rcsa-styles.css')
        );
        addTest(pageName, 'CSS Integration', hasRCSAStyles, 
            hasRCSAStyles ? 'RCSA styles properly linked' : 'Missing RCSA styles link');
        
        // Test 2: Check for Font Awesome
        const hasFontAwesome = Array.from(cssLinks).some(link => 
            link.href.includes('font-awesome') || link.href.includes('fontawesome')
        );
        addTest(pageName, 'Icon Library', hasFontAwesome, 
            hasFontAwesome ? 'Font Awesome properly loaded' : 'Missing Font Awesome');
        
        // Test 3: Check for semantic HTML structure
        const hasH1 = document.querySelector('h1') !== null;
        addTest(pageName, 'Semantic Structure', hasH1, 
            hasH1 ? 'Proper heading hierarchy' : 'Missing main heading');
        
        // Test 4: Check for accessibility attributes
        const hasAriaLabels = document.querySelectorAll('[aria-label], [aria-describedby], [role]').length > 0;
        addTest(pageName, 'Accessibility', hasAriaLabels, 
            hasAriaLabels ? 'ARIA attributes present' : 'Missing accessibility attributes');
        
        // Test 5: Check for responsive classes
        const hasResponsiveClasses = content.includes('fcb-col-') || content.includes('fcb-row');
        addTest(pageName, 'Responsive Design', hasResponsiveClasses, 
            hasResponsiveClasses ? 'Responsive grid classes found' : 'Missing responsive classes');
        
        return true;
    } catch (error) {
        addTest(pageName, 'HTML Validation', false, `HTML parsing error: ${error.message}`);
        return false;
    }
}

function validateDashboard(content) {
    console.log(`\n📊 Testing Dashboard Specific Features...`);
    
    try {
        const dom = new JSDOM(content);
        const document = dom.window.document;
        
        // Test 1: Dynamic greeting functionality
        const hasGreeting = content.includes('getTimeBasedGreeting') || content.includes('dynamic-greeting');
        addTest('dashboard', 'Dynamic Greeting', hasGreeting, 
            hasGreeting ? 'Time-based greeting implemented' : 'Missing dynamic greeting');
        
        // Test 2: Dataverse integration
        const hasDataverseQueries = content.includes('cr129_assess') || content.includes('entities[');
        addTest('dashboard', 'Dataverse Integration', hasDataverseQueries, 
            hasDataverseQueries ? 'Dataverse queries implemented' : 'Missing Dataverse integration');
        
        // Test 3: Metrics cards
        const hasMetricCards = content.includes('rcsa-metric-card') || content.includes('rcsa-metric-number');
        addTest('dashboard', 'Metrics Cards', hasMetricCards, 
            hasMetricCards ? 'Metrics cards implemented' : 'Missing metrics cards');
        
        // Test 4: Recent assessments list
        const hasAssessmentsList = content.includes('rcsa-assessment-item') || content.includes('Recent Assessments');
        addTest('dashboard', 'Assessments List', hasAssessmentsList, 
            hasAssessmentsList ? 'Assessments list implemented' : 'Missing assessments list');
        
        // Test 5: Quick actions
        const hasQuickActions = content.includes('Quick Actions') || content.includes('Start New Assessment');
        addTest('dashboard', 'Quick Actions', hasQuickActions, 
            hasQuickActions ? 'Quick actions implemented' : 'Missing quick actions');
        
        // Test 6: Business units overview
        const hasBusinessUnits = content.includes('Business Units Overview') || content.includes('cr129_bu');
        addTest('dashboard', 'Business Units', hasBusinessUnits, 
            hasBusinessUnits ? 'Business units overview implemented' : 'Missing business units section');
        
        // Test 7: Error handling
        const hasErrorHandling = content.includes('No assessments found') || content.includes('fcb-text-center');
        addTest('dashboard', 'Error Handling', hasErrorHandling, 
            hasErrorHandling ? 'Error states implemented' : 'Missing error handling');
        
    } catch (error) {
        addTest('dashboard', 'Dashboard Validation', false, `Dashboard validation error: ${error.message}`);
    }
}

function validateProcessSelection(content) {
    console.log(`\n⚙️ Testing Process Selection Specific Features...`);
    
    try {
        const dom = new JSDOM(content);
        const document = dom.window.document;
        
        // Test 1: Progress indicator
        const hasProgressIndicator = content.includes('fcb-progress') || content.includes('progress-step');
        addTest('processSelection', 'Progress Indicator', hasProgressIndicator, 
            hasProgressIndicator ? 'Progress indicator implemented' : 'Missing progress indicator');
        
        // Test 2: Business unit dropdown
        const hasBUDropdown = content.includes('business-unit-select') || content.includes('cr129_bu');
        addTest('processSelection', 'Business Unit Dropdown', hasBUDropdown, 
            hasBUDropdown ? 'Business unit dropdown implemented' : 'Missing business unit dropdown');
        
        // Test 3: Process cards
        const hasProcessCards = content.includes('rcsa-process-card') || content.includes('process-grid');
        addTest('processSelection', 'Process Cards', hasProcessCards, 
            hasProcessCards ? 'Process cards implemented' : 'Missing process cards');
        
        // Test 4: JavaScript functionality
        const hasJavaScript = content.includes('class ProcessSelection') || content.includes('addEventListener');
        addTest('processSelection', 'JavaScript Logic', hasJavaScript, 
            hasJavaScript ? 'JavaScript functionality implemented' : 'Missing JavaScript logic');
        
        // Test 5: Form validation
        const hasValidation = content.includes('required') || content.includes('showValidationError');
        addTest('processSelection', 'Form Validation', hasValidation, 
            hasValidation ? 'Form validation implemented' : 'Missing form validation');
        
        // Test 6: Accessibility features
        const hasAccessibility = content.includes('data-testid') || content.includes('aria-pressed');
        addTest('processSelection', 'Accessibility Features', hasAccessibility, 
            hasAccessibility ? 'Accessibility features implemented' : 'Missing accessibility features');
        
        // Test 7: Responsive design
        const hasResponsiveCSS = content.includes('@media') || content.includes('fcb-col-');
        addTest('processSelection', 'Responsive CSS', hasResponsiveCSS, 
            hasResponsiveCSS ? 'Responsive CSS implemented' : 'Missing responsive styles');
        
        // Test 8: Loading states
        const hasLoadingStates = content.includes('rcsa-loading') || content.includes('Loading processes');
        addTest('processSelection', 'Loading States', hasLoadingStates, 
            hasLoadingStates ? 'Loading states implemented' : 'Missing loading states');
        
    } catch (error) {
        addTest('processSelection', 'Process Selection Validation', false, `Process selection validation error: ${error.message}`);
    }
}

function validateCSS() {
    console.log(`\n🎨 Testing CSS Design System...`);
    
    const cssPath = path.join(__dirname, 'powerpages/rcsa-copilot---site-5joks/web-files/rcsa-styles.css');
    
    try {
        if (fs.existsSync(cssPath)) {
            const cssContent = fs.readFileSync(cssPath, 'utf8');
            
            // Test CSS variables
            const hasVariables = cssContent.includes('--fcb-primary') || cssContent.includes(':root');
            addTest('dashboard', 'CSS Variables', hasVariables, 
                hasVariables ? 'CSS variables defined' : 'Missing CSS variables');
            
            // Test responsive breakpoints
            const hasBreakpoints = cssContent.includes('@media') && cssContent.includes('max-width');
            addTest('dashboard', 'Responsive Breakpoints', hasBreakpoints, 
                hasBreakpoints ? 'Responsive breakpoints defined' : 'Missing responsive breakpoints');
            
            // Test component classes
            const hasComponents = cssContent.includes('.fcb-card') && cssContent.includes('.fcb-btn');
            addTest('dashboard', 'Component Classes', hasComponents, 
                hasComponents ? 'Component classes defined' : 'Missing component classes');
            
        } else {
            addTest('dashboard', 'CSS File', false, 'CSS file not found');
        }
    } catch (error) {
        addTest('dashboard', 'CSS Validation', false, `CSS validation error: ${error.message}`);
    }
}

function generateTestReport() {
    console.log(`\n📋 TEST REPORT`);
    console.log(`=============`);
    
    const totalTests = testResults.dashboard.tests.length + testResults.processSelection.tests.length;
    const totalPassed = testResults.dashboard.passed + testResults.processSelection.passed;
    const totalFailed = testResults.dashboard.failed + testResults.processSelection.failed;
    
    console.log(`\n📊 Dashboard Tests: ${testResults.dashboard.passed}/${testResults.dashboard.tests.length} passed`);
    console.log(`⚙️ Process Selection Tests: ${testResults.processSelection.passed}/${testResults.processSelection.tests.length} passed`);
    console.log(`\n🎯 Overall: ${totalPassed}/${totalTests} tests passed (${Math.round(totalPassed/totalTests*100)}%)`);
    
    if (totalFailed > 0) {
        console.log(`\n❌ Failed Tests:`);
        [...testResults.dashboard.tests, ...testResults.processSelection.tests]
            .filter(test => !test.passed)
            .forEach(test => console.log(`   - ${test.name}: ${test.message}`));
    }
    
    // Quality assessment
    const qualityScore = Math.round(totalPassed/totalTests*100);
    if (qualityScore >= 90) {
        console.log(`\n🎉 EXCELLENT QUALITY: Ready for production!`);
    } else if (qualityScore >= 80) {
        console.log(`\n✅ GOOD QUALITY: Minor improvements needed`);
    } else if (qualityScore >= 70) {
        console.log(`\n⚠️ ACCEPTABLE QUALITY: Several improvements needed`);
    } else {
        console.log(`\n❌ POOR QUALITY: Major improvements required`);
    }
    
    return qualityScore;
}

// Main testing function
function runTests() {
    console.log(`🧪 RCSA Power Pages Quality Assurance Testing`);
    console.log(`=============================================`);
    
    // Test Dashboard
    const dashboardPath = path.join(__dirname, 'powerpages/rcsa-copilot---site-5joks/web-pages/dashboard/Dashboard.webpage.copy.html');
    if (fs.existsSync(dashboardPath)) {
        const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');
        validateHTML(dashboardContent, 'dashboard');
        validateDashboard(dashboardContent);
    } else {
        addTest('dashboard', 'File Exists', false, 'Dashboard file not found');
    }
    
    // Test Process Selection
    const processSelectionPath = path.join(__dirname, 'powerpages/rcsa-copilot---site-5joks/web-pages/process-selection/Process-Selection.webpage.copy.html');
    if (fs.existsSync(processSelectionPath)) {
        const processSelectionContent = fs.readFileSync(processSelectionPath, 'utf8');
        validateHTML(processSelectionContent, 'processSelection');
        validateProcessSelection(processSelectionContent);
    } else {
        addTest('processSelection', 'File Exists', false, 'Process Selection file not found');
    }
    
    // Test CSS
    validateCSS();
    
    // Generate report
    const qualityScore = generateTestReport();
    
    // Exit with appropriate code
    process.exit(qualityScore >= 80 ? 0 : 1);
}

// Run tests if called directly
if (require.main === module) {
    runTests();
}

module.exports = { runTests, testResults }; 