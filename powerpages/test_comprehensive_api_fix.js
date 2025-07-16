// Comprehensive API Test After Permission Fixes
// Tests all problematic endpoints with detailed diagnostics

const baseUrl = 'https://site-5joks.powerappsportals.com';

async function testComprehensiveAPIFix() {
    console.log('🔧 Comprehensive API Test After Permission Fixes...\n');
    
    const tests = [
        {
            name: 'Risk-Control Basic (Wildcard Error Check)',
            url: '/_api/cr129_riskctrls?$top=1',
            expectedStatus: 200,
            checkFor: 'wildcard error resolution',
            critical: true
        },
        {
            name: 'Risk-Control with Filter',
            url: '/_api/cr129_riskctrls?$filter=statecode eq 0&$top=1',
            expectedStatus: 200,
            checkFor: 'OData filtering capability',
            critical: true
        },
        {
            name: 'Risk-Control Navigation - ControlTitle (Capital C)',
            url: '/_api/cr129_riskctrls?$expand=cr129_ControlTitle($select=cr129_controlid,cr129_controltitle)&$top=1',
            expectedStatus: 200,
            checkFor: 'navigation property expansion',
            critical: true
        },
        {
            name: 'Risk-Control Navigation - controltitle (lowercase)',
            url: '/_api/cr129_riskctrls?$expand=cr129_controltitle($select=cr129_controlid,cr129_controltitle)&$top=1',
            expectedStatus: [200, 400], // 400 is acceptable if casing is wrong
            checkFor: 'navigation property casing test',
            critical: false
        },
        {
            name: 'Control Basic Query',
            url: '/_api/cr129_controls?$top=1',
            expectedStatus: 200,
            checkFor: 'control entity access',
            critical: true
        },
        {
            name: 'Control with Full Select',
            url: '/_api/cr129_controls?$select=cr129_controlid,cr129_controltitle,cr129_controltype,cr129_designefficiency&$filter=statecode eq 0&$top=1',
            expectedStatus: 200,
            checkFor: 'control field permissions',
            critical: true
        },
        {
            name: 'Risk-Control Specific Risk Filter',
            url: '/_api/cr129_riskctrls?$filter=_cr129_risk_value eq guid\'c74510ad-3460-f011-bec2-7c1e521687a7\' and statecode eq 0&$top=1',
            expectedStatus: 200,
            checkFor: 'specific risk filtering',
            critical: false
        }
    ];
    
    let passedTests = 0;
    let failedCritical = 0;
    let totalCritical = tests.filter(t => t.critical).length;
    
    console.log(`📊 Running ${tests.length} tests (${totalCritical} critical)...\n`);
    
    for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        const fullUrl = `${baseUrl}${test.url}`;
        const isCritical = test.critical ? '🔴 CRITICAL' : '🔵 Optional';
        
        console.log(`🧪 Test ${i + 1}: ${test.name} ${isCritical}`);
        console.log(`📋 Testing: ${test.checkFor}`);
        console.log(`🌐 URL: ${test.url}`);
        
        try {
            const response = await fetch(fullUrl);
            
            const expectedStatuses = Array.isArray(test.expectedStatus) ? test.expectedStatus : [test.expectedStatus];
            const statusMatches = expectedStatuses.includes(response.status);
            
            if (statusMatches) {
                console.log(`✅ PASS: Status ${response.status}`);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log(`📊 Records returned: ${data.value?.length || 0}`);
                    
                    if (data.value && data.value.length > 0) {
                        const record = data.value[0];
                        console.log(`📋 Sample record fields: ${Object.keys(record).slice(0, 5).join(', ')}${Object.keys(record).length > 5 ? '...' : ''}`);
                        
                        // Check for navigation properties
                        const navProps = Object.keys(record).filter(key => 
                            key.includes('cr129_') && !key.includes('@') && !key.includes('_value')
                        );
                        if (navProps.length > 0) {
                            console.log(`🔗 Navigation properties found: ${navProps.join(', ')}`);
                        }
                    }
                    
                    // Special check for wildcard error
                    if (test.checkFor === 'wildcard error resolution') {
                        console.log(`🎉 WILDCARD ERROR RESOLVED! No more "Attribute * not enabled" error`);
                    }
                }
                
                passedTests++;
            } else {
                console.log(`❌ FAIL: Status ${response.status} (expected ${expectedStatuses.join(' or ')})`);
                
                try {
                    const errorData = await response.text();
                    console.log(`📋 Error: ${errorData.substring(0, 300)}...`);
                    
                    // Check for specific error patterns
                    if (errorData.includes('Attribute * in table')) {
                        console.log(`🚨 WILDCARD ERROR STILL PRESENT!`);
                    }
                    if (errorData.includes('navigation property')) {
                        console.log(`🚨 Navigation property error detected`);
                    }
                } catch (e) {
                    console.log(`📋 Could not read error details`);
                }
                
                if (test.critical) {
                    failedCritical++;
                }
            }
            
        } catch (error) {
            console.log(`❌ NETWORK ERROR: ${error.message}`);
            if (test.critical) {
                failedCritical++;
            }
        }
        
        console.log(''); // Empty line for readability
    }
    
    // Summary
    console.log('='.repeat(70));
    console.log(`📊 COMPREHENSIVE TEST SUMMARY:`);
    console.log(`✅ Total Passed: ${passedTests}/${tests.length}`);
    console.log(`🔴 Critical Failed: ${failedCritical}/${totalCritical}`);
    console.log(`📈 Success Rate: ${Math.round((passedTests / tests.length) * 100)}%`);
    
    if (failedCritical === 0) {
        console.log(`\n🎉 ALL CRITICAL TESTS PASSED!`);
        console.log(`✅ Control Mapping should work end-to-end now`);
        console.log(`✅ Wildcard field errors should be resolved`);
        console.log(`✅ Navigation properties should expand correctly`);
        return { success: true, critical: 'passed' };
    } else if (failedCritical <= 1) {
        console.log(`\n⚠️ MOSTLY SUCCESSFUL (${failedCritical} critical failure)`);
        console.log(`🔄 Some functionality may work, check specific errors above`);
        return { success: false, critical: 'partial' };
    } else {
        console.log(`\n❌ MULTIPLE CRITICAL FAILURES (${failedCritical})`);
        console.log(`🔧 Additional troubleshooting required`);
        return { success: false, critical: 'failed' };
    }
}

// Run the comprehensive test
testComprehensiveAPIFix()
    .then(results => {
        console.log('\n🎯 Comprehensive API test completed!');
        console.log(`Result: ${results.critical} - ${results.success ? 'SUCCESS' : 'NEEDS WORK'}`);
    })
    .catch(error => {
        console.error('💥 Test script error:', error);
    }); 