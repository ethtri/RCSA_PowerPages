/**
 * Step 3: Test API Access After Permission Fixes
 * 
 * Run this in browser console on your Power Pages portal to test
 * if removing conflicting permissions and using wildcard fields fixed the issue.
 */

(function() {
    'use strict';
    
    console.log('🧪 Step 3: Testing cr129_riskctrls API Access After Fixes...\n');
    
    const tests = [
        {
            name: 'Basic Access Test',
            url: '/_api/cr129_riskctrls?$top=1',
            description: 'Test if basic API access works now'
        },
        {
            name: 'Filter Test', 
            url: '/_api/cr129_riskctrls?$filter=statecode eq 0&$top=1',
            description: 'Test filtering capability'
        },
        {
            name: 'Select Fields Test',
            url: '/_api/cr129_riskctrls?$select=cr129_riskctrlid&$top=1',
            description: 'Test field selection'
        },
        {
            name: 'Count Test',
            url: '/_api/cr129_riskctrls?$count=true&$top=1',
            description: 'Test count functionality'
        }
    ];
    
    async function runTest(test) {
        console.log(`🔍 ${test.name}: ${test.description}`);
        
        try {
            const response = await makeApiCall('GET', test.url);
            console.log(`✅ ${test.name}: SUCCESS (Status: ${response.status})`);
            
            if (response.data && response.data.value) {
                console.log(`   📊 Records returned: ${response.data.value.length}`);
                if (response.data['@odata.count'] !== undefined) {
                    console.log(`   📈 Total count: ${response.data['@odata.count']}`);
                }
            }
            
            return { success: true, status: response.status, data: response.data };
            
        } catch (error) {
            console.log(`❌ ${test.name}: FAILED (Status: ${error.status})`);
            console.log(`   Error: ${error.message}`);
            
            if (error.responseText) {
                try {
                    const errorData = JSON.parse(error.responseText);
                    console.log(`   Details: ${errorData.error?.message || 'Unknown error'}`);
                } catch (e) {
                    console.log(`   Raw Error: ${error.responseText.substring(0, 200)}...`);
                }
            }
            
            return { success: false, status: error.status, error: error.message };
        }
    }
    
    function makeApiCall(method, url) {
        return new Promise((resolve, reject) => {
            if (typeof webapi !== 'undefined' && webapi.safeAjax) {
                webapi.safeAjax({
                    type: method,
                    url: url,
                    success: function(data, textStatus, xhr) {
                        resolve({
                            status: xhr.status,
                            data: data,
                            textStatus: textStatus
                        });
                    },
                    error: function(xhr, textStatus, errorThrown) {
                        reject({
                            status: xhr.status,
                            message: errorThrown || textStatus,
                            responseText: xhr.responseText
                        });
                    }
                });
            } else {
                // Fallback to jQuery
                $.ajax({
                    type: method,
                    url: url,
                    contentType: "application/json",
                    success: function(data, textStatus, xhr) {
                        resolve({
                            status: xhr.status,
                            data: data,
                            textStatus: textStatus
                        });
                    },
                    error: function(xhr, textStatus, errorThrown) {
                        reject({
                            status: xhr.status,
                            message: errorThrown || textStatus,
                            responseText: xhr.responseText
                        });
                    }
                });
            }
        });
    }
    
    async function runAllTests() {
        const results = [];
        
        for (const test of tests) {
            const result = await runTest(test);
            results.push({ test: test.name, ...result });
            console.log(''); // Add spacing
        }
        
        // Summary
        const passed = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;
        
        console.log('📊 STEP 3 RESULTS SUMMARY:');
        console.log(`✅ Passed: ${passed}/${tests.length}`);
        console.log(`❌ Failed: ${failed}/${tests.length}`);
        
        if (passed > 0) {
            console.log('\n🎉 PROGRESS! Some tests are now passing!');
            if (passed === tests.length) {
                console.log('🏆 All tests passed! The permission conflicts have been resolved!');
                console.log('📝 Next: Proceed to Step 4 to verify metadata and optimize configuration.');
            } else {
                console.log('📝 Next: Investigate remaining failures and continue troubleshooting.');
            }
        } else {
            console.log('\n⚠️ No tests passed yet. Let\'s continue with the troubleshooting plan.');
            console.log('📝 Next: Check metadata and investigate other potential issues.');
        }
        
        // Save results for analysis
        window.step3Results = {
            results,
            passed,
            failed,
            timestamp: new Date().toISOString()
        };
        
        console.log('\n💾 Results saved to: window.step3Results');
        
        return results;
    }
    
    // Run the tests
    runAllTests();
    
})();

console.log(`
🔧 STEP 3 INSTRUCTIONS:
1. Copy and paste this script into your browser console while on the Power Pages portal
2. The script will test if our permission fixes resolved the cr129_riskctrls API issue
3. Review the results to see which tests pass/fail
4. Based on results, we'll continue to Step 4 (metadata verification) or investigate further

📋 Changes Made in Steps 1-2:
✅ Removed conflicting Web-API-RiskCtrl-Simple.tablepermission.yml
✅ Optimized main cr129_riskctrl.tablepermission.yml (read-only permissions)
✅ Changed Webapi/cr129_riskctrl/fields to "*" (allow all fields)
✅ Published changes to portal successfully
`); 