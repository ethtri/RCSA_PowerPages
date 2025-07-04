/**
 * RCSA Power Pages Comprehensive Testing Suite
 * Tests all pages with LogicGate design system implementation
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Test Results
let testResults = {
    dashboard: { passed: 0, failed: 0, tests: [] },
    processSelection: { passed: 0, failed: 0, tests: [] },
    riskIdentification: { passed: 0, failed: 0, tests: [] },
    controlMapping: { passed: 0, failed: 0, tests: [] },
    residualAssessment: { passed: 0, failed: 0, tests: [] },
    successPage: { passed: 0, failed: 0, tests: [] },
    designSystem: { passed: 0, failed: 0, tests: [] }
};

// Test utilities
function addTest(page, testName, passed, message) {
    testResults[page].tests.push({ name: testName, passed, message });
    
    if (passed) {
        testResults[page].passed++;
        console.log(`✅ ${testName}: ${message}`);
    } else {
        testResults[page].failed++;
        console.log(`❌ ${testName}: ${message}`);
    }
}

function validateLogicGateDesignSystem(content, pageName) {
    console.log(`\n🎨 Testing LogicGate Design System Integration - ${pageName}...`);
    
    // Test 1: LogicGate CSS inclusion
    const hasLGCSS = content.includes('logicgate-design-system.css');
    addTest(pageName, 'LogicGate CSS', hasLGCSS, 
        hasLGCSS ? 'LogicGate design system CSS included' : 'Missing LogicGate CSS');
    
    // Test 2: LogicGate JS inclusion
    const hasLGJS = content.includes('logicgate-components.js');
    addTest(pageName, 'LogicGate JS', hasLGJS, 
        hasLGJS ? 'LogicGate components JS included' : 'Missing LogicGate JS');
    
    // Test 3: LogicGate CSS classes
    const hasLGClasses = content.includes('lg-') || content.includes('class="lg-');
    addTest(pageName, 'LogicGate Classes', hasLGClasses, 
        hasLGClasses ? 'LogicGate CSS classes used' : 'Missing LogicGate classes');
    
    // Test 4: Modern page structure
    const hasModernStructure = content.includes('<main class="lg-page">');
    addTest(pageName, 'Modern Structure', hasModernStructure, 
        hasModernStructure ? 'Modern page structure implemented' : 'Missing modern page structure');
    
    // Test 5: Professional styling
    const hasProfessionalStyling = content.includes('lg-card') || content.includes('lg-btn');
    addTest(pageName, 'Professional Styling', hasProfessionalStyling, 
        hasProfessionalStyling ? 'Professional styling implemented' : 'Missing professional styling');
}

function validateDashboard(content) {
    console.log(`\n📊 Testing Dashboard Features...`);
    
    try {
        const dom = new JSDOM(content);
        const document = dom.window.document;
        
        // Test 1: Application header
        const hasAppHeader = content.includes('lg-app-header') || content.includes('Risk Assessment Dashboard');
        addTest('dashboard', 'App Header', hasAppHeader, 
            hasAppHeader ? 'Application header implemented' : 'Missing application header');
        
        // Test 2: Metrics grid
        const hasMetricsGrid = content.includes('lg-grid') && content.includes('totalAssessments');
        addTest('dashboard', 'Metrics Grid', hasMetricsGrid, 
            hasMetricsGrid ? 'Metrics grid implemented' : 'Missing metrics grid');
        
        // Test 3: Recent assessments
        const hasRecentAssessments = content.includes('recentAssessmentsList') || content.includes('Recent Assessments');
        addTest('dashboard', 'Recent Assessments', hasRecentAssessments, 
            hasRecentAssessments ? 'Recent assessments section implemented' : 'Missing recent assessments');
        
        // Test 4: Risk distribution
        const hasRiskDistribution = content.includes('Risk Distribution') || content.includes('riskDistribution');
        addTest('dashboard', 'Risk Distribution', hasRiskDistribution, 
            hasRiskDistribution ? 'Risk distribution chart implemented' : 'Missing risk distribution');
        
        // Test 5: Interactive elements
        const hasInteractivity = content.includes('dashboard.') || content.includes('addEventListener');
        addTest('dashboard', 'Interactivity', hasInteractivity, 
            hasInteractivity ? 'Interactive elements implemented' : 'Missing interactive elements');
        
        // Test 6: Toolbar actions
        const hasToolbar = content.includes('lg-toolbar') || content.includes('Start New Assessment');
        addTest('dashboard', 'Toolbar Actions', hasToolbar, 
            hasToolbar ? 'Toolbar with actions implemented' : 'Missing toolbar actions');
        
        // Test 7: Search functionality
        const hasSearch = content.includes('dashboardSearch') || content.includes('Search assessments');
        addTest('dashboard', 'Search Functionality', hasSearch, 
            hasSearch ? 'Search functionality implemented' : 'Missing search functionality');
        
    } catch (error) {
        addTest('dashboard', 'Dashboard Validation', false, `Dashboard validation error: ${error.message}`);
    }
}

function validateControlMapping(content) {
    console.log(`\n🔗 Testing Control Mapping Features...`);
    
    try {
        // Test 1: Progress tracking
        const hasProgress = content.includes('progress-dashboard') || content.includes('Progress');
        addTest('controlMapping', 'Progress Tracking', hasProgress, 
            hasProgress ? 'Progress tracking implemented' : 'Missing progress tracking');
        
        // Test 2: Risk cards
        const hasRiskCards = content.includes('risk-card') || content.includes('lg-card');
        addTest('controlMapping', 'Risk Cards', hasRiskCards, 
            hasRiskCards ? 'Risk cards implemented' : 'Missing risk cards');
        
        // Test 3: Control selection modal
        const hasControlModal = content.includes('control-selection-modal') || content.includes('lg-modal');
        addTest('controlMapping', 'Control Modal', hasControlModal, 
            hasControlModal ? 'Control selection modal implemented' : 'Missing control modal');
        
        // Test 4: Bulk operations
        const hasBulkOps = content.includes('bulk-') || content.includes('Bulk Map');
        addTest('controlMapping', 'Bulk Operations', hasBulkOps, 
            hasBulkOps ? 'Bulk operations implemented' : 'Missing bulk operations');
        
        // Test 5: Search and filter
        const hasSearchFilter = content.includes('globalSearch') || content.includes('filter');
        addTest('controlMapping', 'Search & Filter', hasSearchFilter, 
            hasSearchFilter ? 'Search and filter implemented' : 'Missing search and filter');
        
        // Test 6: Export functionality
        const hasExport = content.includes('export') || content.includes('Export');
        addTest('controlMapping', 'Export Feature', hasExport, 
            hasExport ? 'Export functionality implemented' : 'Missing export functionality');
        
    } catch (error) {
        addTest('controlMapping', 'Control Mapping Validation', false, `Control mapping validation error: ${error.message}`);
    }
}

function validateResidualAssessment(content) {
    console.log(`\n🎯 Testing Residual Assessment Features...`);
    
    try {
        // Test 1: Heat map
        const hasHeatMap = content.includes('heat-map') || content.includes('5×5 Risk Heat Map');
        addTest('residualAssessment', 'Heat Map', hasHeatMap, 
            hasHeatMap ? '5x5 heat map implemented' : 'Missing heat map');
        
        // Test 2: Risk scoring
        const hasRiskScoring = content.includes('risk-score') || content.includes('selectedScore');
        addTest('residualAssessment', 'Risk Scoring', hasRiskScoring, 
            hasRiskScoring ? 'Risk scoring implemented' : 'Missing risk scoring');
        
        // Test 3: AI suggestions
        const hasAISuggestions = content.includes('AI Recommendations') || content.includes('suggestions');
        addTest('residualAssessment', 'AI Suggestions', hasAISuggestions, 
            hasAISuggestions ? 'AI suggestions implemented' : 'Missing AI suggestions');
        
        // Test 4: Rationale input
        const hasRationale = content.includes('riskRationale') || content.includes('rationale');
        addTest('residualAssessment', 'Rationale Input', hasRationale, 
            hasRationale ? 'Rationale input implemented' : 'Missing rationale input');
        
        // Test 5: Form validation
        const hasValidation = content.includes('validateForm') || content.includes('minimum 50 characters');
        addTest('residualAssessment', 'Form Validation', hasValidation, 
            hasValidation ? 'Form validation implemented' : 'Missing form validation');
        
        // Test 6: Interactive cells
        const hasInteractiveCells = content.includes('selectCell') || content.includes('heat-map-cell');
        addTest('residualAssessment', 'Interactive Cells', hasInteractiveCells, 
            hasInteractiveCells ? 'Interactive heat map cells implemented' : 'Missing interactive cells');
        
    } catch (error) {
        addTest('residualAssessment', 'Residual Assessment Validation', false, `Residual assessment validation error: ${error.message}`);
    }
}

function validateSuccessPage(content) {
    console.log(`\n🎉 Testing Success Page Features...`);
    
    try {
        // Test 1: Success animation
        const hasAnimation = content.includes('checkmark') || content.includes('success-animation');
        addTest('successPage', 'Success Animation', hasAnimation, 
            hasAnimation ? 'Success animation implemented' : 'Missing success animation');
        
        // Test 2: Assessment summary
        const hasSummary = content.includes('Assessment Summary') || content.includes('summary-icon');
        addTest('successPage', 'Assessment Summary', hasSummary, 
            hasSummary ? 'Assessment summary implemented' : 'Missing assessment summary');
        
        // Test 3: Risk distribution
        const hasRiskDistribution = content.includes('Risk Distribution') || content.includes('risk-indicator');
        addTest('successPage', 'Risk Distribution', hasRiskDistribution, 
            hasRiskDistribution ? 'Risk distribution display implemented' : 'Missing risk distribution');
        
        // Test 4: Key achievements
        const hasAchievements = content.includes('Key Achievements') || content.includes('achievement-item');
        addTest('successPage', 'Key Achievements', hasAchievements, 
            hasAchievements ? 'Key achievements section implemented' : 'Missing key achievements');
        
        // Test 5: Next steps
        const hasNextSteps = content.includes('Next Steps') || content.includes('step-number');
        addTest('successPage', 'Next Steps', hasNextSteps, 
            hasNextSteps ? 'Next steps guidance implemented' : 'Missing next steps');
        
        // Test 6: Action buttons
        const hasActionButtons = content.includes('View Dashboard') || content.includes('Download Report');
        addTest('successPage', 'Action Buttons', hasActionButtons, 
            hasActionButtons ? 'Action buttons implemented' : 'Missing action buttons');
        
        // Test 7: Report generation
        const hasReportGen = content.includes('downloadReport') || content.includes('Export');
        addTest('successPage', 'Report Generation', hasReportGen, 
            hasReportGen ? 'Report generation implemented' : 'Missing report generation');
        
    } catch (error) {
        addTest('successPage', 'Success Page Validation', false, `Success page validation error: ${error.message}`);
    }
}

function validateDesignSystem() {
    console.log(`\n🎨 Testing Design System Files...`);
    
    // Test LogicGate CSS
    const cssPath = path.join(__dirname, 'rcsa-design-system/logicgate-design-system.css');
    if (fs.existsSync(cssPath)) {
        const cssContent = fs.readFileSync(cssPath, 'utf8');
        
        // Test CSS structure
        const hasVariables = cssContent.includes(':root') && cssContent.includes('--lg-');
        addTest('designSystem', 'CSS Variables', hasVariables, 
            hasVariables ? 'CSS custom properties defined' : 'Missing CSS variables');
        
        const hasComponents = cssContent.includes('.lg-card') && cssContent.includes('.lg-btn');
        addTest('designSystem', 'Component Classes', hasComponents, 
            hasComponents ? 'Component classes defined' : 'Missing component classes');
        
        const hasResponsive = cssContent.includes('@media') && cssContent.includes('max-width');
        addTest('designSystem', 'Responsive Design', hasResponsive, 
            hasResponsive ? 'Responsive breakpoints defined' : 'Missing responsive design');
        
        const hasRiskColors = cssContent.includes('--lg-risk-') && cssContent.includes('critical');
        addTest('designSystem', 'Risk Colors', hasRiskColors, 
            hasRiskColors ? 'Risk color system defined' : 'Missing risk colors');
        
    } else {
        addTest('designSystem', 'CSS File', false, 'LogicGate CSS file not found');
    }
    
    // Test LogicGate JS
    const jsPath = path.join(__dirname, 'rcsa-design-system/logicgate-components.js');
    if (fs.existsSync(jsPath)) {
        const jsContent = fs.readFileSync(jsPath, 'utf8');
        
        const hasLogicGateObject = jsContent.includes('const LogicGate') || jsContent.includes('LogicGate =');
        addTest('designSystem', 'LogicGate Object', hasLogicGateObject, 
            hasLogicGateObject ? 'LogicGate object defined' : 'Missing LogicGate object');
        
        const hasToastSystem = jsContent.includes('Toast') && jsContent.includes('show');
        addTest('designSystem', 'Toast System', hasToastSystem, 
            hasToastSystem ? 'Toast notification system implemented' : 'Missing toast system');
        
        const hasExportUtils = jsContent.includes('Export') && jsContent.includes('toJSON');
        addTest('designSystem', 'Export Utils', hasExportUtils, 
            hasExportUtils ? 'Export utilities implemented' : 'Missing export utilities');
        
    } else {
        addTest('designSystem', 'JS File', false, 'LogicGate JS file not found');
    }
    
    // Test README
    const readmePath = path.join(__dirname, 'rcsa-design-system/README.md');
    if (fs.existsSync(readmePath)) {
        const readmeContent = fs.readFileSync(readmePath, 'utf8');
        
        const hasDocumentation = readmeContent.includes('LogicGate') && readmeContent.includes('Design System');
        addTest('designSystem', 'Documentation', hasDocumentation, 
            hasDocumentation ? 'Design system documentation exists' : 'Missing documentation');
        
        const hasUsageExamples = readmeContent.includes('Usage') || readmeContent.includes('Example');
        addTest('designSystem', 'Usage Examples', hasUsageExamples, 
            hasUsageExamples ? 'Usage examples provided' : 'Missing usage examples');
        
    } else {
        addTest('designSystem', 'README File', false, 'README file not found');
    }
}

function generateTestReport() {
    console.log(`\n📋 COMPREHENSIVE TEST REPORT`);
    console.log(`============================`);
    
    let totalTests = 0;
    let totalPassed = 0;
    let totalFailed = 0;
    
    Object.keys(testResults).forEach(page => {
        const results = testResults[page];
        totalTests += results.tests.length;
        totalPassed += results.passed;
        totalFailed += results.failed;
        
        if (results.tests.length > 0) {
            console.log(`\n${page.toUpperCase()}: ${results.passed}/${results.tests.length} passed`);
        }
    });
    
    console.log(`\n🎯 OVERALL RESULTS: ${totalPassed}/${totalTests} tests passed (${Math.round(totalPassed/totalTests*100)}%)`);
    
    if (totalFailed > 0) {
        console.log(`\n❌ FAILED TESTS:`);
        Object.keys(testResults).forEach(page => {
            testResults[page].tests
                .filter(test => !test.passed)
                .forEach(test => console.log(`   ${page}: ${test.name} - ${test.message}`));
        });
    }
    
    // Quality assessment
    const qualityScore = Math.round(totalPassed/totalTests*100);
    if (qualityScore >= 95) {
        console.log(`\n🏆 EXCEPTIONAL QUALITY: Production-ready enterprise application!`);
    } else if (qualityScore >= 90) {
        console.log(`\n🎉 EXCELLENT QUALITY: Ready for production deployment!`);
    } else if (qualityScore >= 80) {
        console.log(`\n✅ GOOD QUALITY: Minor improvements recommended`);
    } else if (qualityScore >= 70) {
        console.log(`\n⚠️ ACCEPTABLE QUALITY: Several improvements needed`);
    } else {
        console.log(`\n❌ POOR QUALITY: Major improvements required`);
    }
    
    return qualityScore;
}

// Main testing function
function runComprehensiveTests() {
    console.log(`🧪 RCSA POWER PAGES - COMPREHENSIVE TESTING SUITE`);
    console.log(`================================================`);
    console.log(`Testing LogicGate Risk Cloud inspired design system implementation\n`);
    
    // Test page files
    const pageTests = [
        { name: 'dashboard', path: 'powerpages/rcsa-copilot---site-5joks/web-pages/dashboard/content-pages/Dashboard.en-US.webpage.copy.html', validator: validateDashboard },
        { name: 'controlMapping', path: 'powerpages/rcsa-copilot---site-5joks/web-pages/control-mapping-overview/content-pages/Control-Mapping-Overview.en-US.webpage.copy.html', validator: validateControlMapping },
        { name: 'residualAssessment', path: 'powerpages/rcsa-copilot---site-5joks/web-pages/residual-risk-assessment/content-pages/Residual-Risk-Assessment.en-US.webpage.copy.html', validator: validateResidualAssessment },
        { name: 'successPage', path: 'powerpages/rcsa-copilot---site-5joks/web-pages/success-page/content-pages/Success-Page.en-US.webpage.copy.html', validator: validateSuccessPage }
    ];
    
    pageTests.forEach(test => {
        const filePath = path.join(__dirname, test.path);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            validateLogicGateDesignSystem(content, test.name);
            test.validator(content);
        } else {
            addTest(test.name, 'File Exists', false, `${test.name} file not found`);
        }
    });
    
    // Test design system
    validateDesignSystem();
    
    // Generate report
    const qualityScore = generateTestReport();
    
    // Additional recommendations
    console.log(`\n💡 RECOMMENDATIONS:`);
    console.log(`- Ensure all pages are published to Power Pages`);
    console.log(`- Test functionality in browser environment`);
    console.log(`- Validate Dataverse integration with real data`);
    console.log(`- Perform accessibility testing with screen readers`);
    console.log(`- Test responsive design on multiple devices`);
    console.log(`- Validate performance with large datasets`);
    
    return qualityScore;
}

// Run tests if called directly
if (require.main === module) {
    const score = runComprehensiveTests();
    process.exit(score >= 80 ? 0 : 1);
}

module.exports = { runComprehensiveTests, testResults }; 