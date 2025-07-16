// Test API Recovery After Field Permission Fixes
// Tests both control and risk-control endpoints

const baseUrl = 'https://site-5joks.powerappsportals.com';

async function testAPIRecovery() {
    console.log('🔧 Testing API Recovery After Field Permission Fixes...\n');
    
    const tests = [
        {
            name: 'Risk-Control Basic Query',
            url: '/_api/cr129_riskctrls?$top=1',
            expectedStatus: 200,
            description: 'Should not return wildcard field error'
        },
        {
            name: 'Risk-Control with Filter',
            url: '/_api/cr129_riskctrls?$filter=statecode eq 0&$top=1',
            expectedStatus: 200,
            description: 'Should work with OData filters'
        },
        {
            name: 'Control Basic Query',
            url: '/_api/cr129_controls?$top=1',
            expectedStatus: 200,
            description: 'Should find control entity with EntitySetName'
        },
        {
            name: 'Control with Select and Filter',
            url: '/_api/cr129_controls?$select=cr129_controlid,cr129_controltitle&$filter=statecode eq 0&$top=1',
            expectedStatus: 200,
            description: 'Should work with specific field selection'
        },
        {
            name: 'Risk-Control with Navigation Properties',
            url: '/_api/cr129_riskctrls?$expand=cr129_ControlTitle($select=cr129_controlid,cr129_controltitle)&$top=1',
            expectedStatus: 200,
            description: 'Should work with navigation property expansion'
        }
    ];
    
    let passedTests = 0;
    let failedTests = 0;
    
    for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        const fullUrl = `${baseUrl}${test.url}`;
        
        console.log(`🧪 Test ${i + 1}: ${test.name}`);
        console.log(`📋 URL: ${test.url}`);
        console.log(`📋 Description: ${test.description}`);
        
        try {
            const response = await fetch(fullUrl);
            
            if (response.status === test.expectedStatus) {
                console.log(`✅ PASS: Status ${response.status} (expected ${test.expectedStatus})`);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log(`📊 Records returned: ${data.value?.length || 0}`);
                    
                    if (data.value && data.value.length > 0) {
                        console.log(`📋 Sample record keys: ${Object.keys(data.value[0]).join(', ')}`);
                    }
                }
                
                passedTests++;
            } else {
                console.log(`❌ FAIL: Status ${response.status} (expected ${test.expectedStatus})`);
                
                try {
                    const errorData = await response.text();
                    console.log(`📋 Error: ${errorData.substring(0, 200)}...`);
                } catch (e) {
                    console.log(`📋 Could not read error details`);
                }
                
                failedTests++;
            }
            
        } catch (error) {
            console.log(`❌ ERROR: ${error.message}`);
            failedTests++;
        }
        
        console.log(''); // Empty line for readability
    }
    
    // Summary
    console.log('='.repeat(60));
    console.log(`📊 TEST SUMMARY:`);
    console.log(`✅ Passed: ${passedTests}/${tests.length}`);
    console.log(`❌ Failed: ${failedTests}/${tests.length}`);
    
    if (passedTests === tests.length) {
        console.log(`🎉 ALL TESTS PASSED! APIs are recovered.`);
        return { success: true, passedTests, failedTests };
    } else {
        console.log(`⚠️ Some tests failed. API recovery incomplete.`);
        return { success: false, passedTests, failedTests };
    }
}

// Run the test
testAPIRecovery()
    .then(results => {
        console.log('\n🎯 API Recovery test completed!');
        if (results.success) {
            console.log('✅ Control Mapping page should work now!');
        } else {
            console.log('❌ Additional troubleshooting needed');
        }
    })
    .catch(error => {
        console.error('💥 Test script error:', error);
    }); 