/**
 * Control Mapping Navigation Properties Fix Test
 * 
 * This script tests the corrected navigation property patterns
 * to ensure the 400 Bad Request errors are resolved.
 */

(function() {
    'use strict';
    
    console.log('🔧 Testing Control Mapping Navigation Properties Fix...\n');
    
    // Test data from your logs
    const testRiskId = 'c74510ad-3460-f011-bec2-7c1e521687a7';
    
    const queryTests = [
        {
            name: '✅ FIXED: Working ControlTitle pattern (should work)',
            url: `/_api/cr129_riskctrls?$filter=_cr129_risktitle_value eq ${testRiskId} and statecode eq 0&$expand=cr129_ControlTitle($select=cr129_controlid,cr129_controltitle)`,
            expected: 'SUCCESS'
        },
        {
            name: '❌ OLD: Failing controltitle pattern (should fail with 400)',
            url: `/_api/cr129_riskctrls?$filter=_cr129_risktitle_value eq ${testRiskId} and statecode eq 0&$expand=cr129_controltitle($select=cr129_controlid,cr129_controltitle)`,
            expected: 'FAIL'
        },
        {
            name: '🧪 TEST: Risk navigation property (check if similar issue)',
            url: `/_api/cr129_riskctrls?$filter=_cr129_risktitle_value eq ${testRiskId} and statecode eq 0&$expand=cr129_RiskTitle($select=cr129_riskid,cr129_risktitle)`,
            expected: 'UNKNOWN'
        },
        {
            name: '🧪 TEST: Both navigation properties together',
            url: `/_api/cr129_riskctrls?$filter=_cr129_risktitle_value eq ${testRiskId} and statecode eq 0&$expand=cr129_RiskTitle($select=cr129_riskid,cr129_risktitle),cr129_ControlTitle($select=cr129_controlid,cr129_controltitle)`,
            expected: 'UNKNOWN'
        }
    ];
    
    async function runNavigationTest(test) {
        console.log(`🔍 ${test.name}`);
        console.log(`   URL: ${test.url}`);
        
        try {
            const response = await webapi.safeAjax({
                type: 'GET',
                url: test.url
            });
            
            const status = response.status || 200;
            const recordCount = response.value ? response.value.length : 0;
            
            console.log(`✅ SUCCESS (${status}): ${recordCount} records returned`);
            
            if (recordCount > 0) {
                const record = response.value[0];
                const expandedProps = Object.keys(record).filter(key => 
                    !key.startsWith('_') && !key.startsWith('@') && 
                    (key.includes('Risk') || key.includes('Control') || key.includes('risk') || key.includes('control'))
                );
                
                if (expandedProps.length > 0) {
                    console.log(`   📋 Expanded properties: ${expandedProps.join(', ')}`);
                } else {
                    console.log(`   ⚠️ No expanded properties found (may indicate navigation issue)`);
                }
            }
            
            return { success: true, status, recordCount, data: response.value };
            
        } catch (error) {
            const status = error.status || 'Unknown';
            console.log(`❌ FAILED (${status}): ${error.message}`);
            
            if (error.responseText) {
                try {
                    const errorData = JSON.parse(error.responseText);
                    const errorMsg = errorData.error?.message || 'Unknown error';
                    console.log(`   💡 Error details: ${errorMsg}`);
                } catch (e) {
                    console.log(`   💡 Raw error: ${error.responseText.substring(0, 100)}...`);
                }
            }
            
            return { success: false, status, error: error.message };
        }
    }
    
    async function runAllTests() {
        console.log('🚀 Running Navigation Properties Fix Tests...\n');
        
        const results = [];
        
        for (const test of queryTests) {
            const result = await runNavigationTest(test);
            results.push({ test: test.name, ...result });
            console.log(''); // Add spacing between tests
        }
        
        // Summary
        console.log('📊 TEST RESULTS SUMMARY:');
        const passed = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;
        
        console.log(`✅ Passed: ${passed}/${queryTests.length}`);
        console.log(`❌ Failed: ${failed}/${queryTests.length}`);
        
        // Analysis
        console.log('\n🔍 ANALYSIS:');
        
        const workingPattern = results.find(r => r.test.includes('Working ControlTitle'));
        const failingPattern = results.find(r => r.test.includes('Failing controltitle'));
        
        if (workingPattern?.success && failingPattern?.success === false) {
            console.log('✅ FIX CONFIRMED: Navigation property casing issue resolved');
            console.log('   - cr129_ControlTitle (capital C) works');
            console.log('   - cr129_controltitle (lowercase c) fails');
        } else if (workingPattern?.success && failingPattern?.success) {
            console.log('⚠️ UNEXPECTED: Both patterns work (may have been fixed in metadata)');
        } else if (!workingPattern?.success) {
            console.log('❌ ISSUE PERSISTS: Working pattern still failing');
        }
        
        const bothPropsResult = results.find(r => r.test.includes('Both navigation properties'));
        if (bothPropsResult?.success) {
            console.log('✅ BONUS: Both risk and control navigation properties work together');
        }
        
        // Save results for further analysis
        window.navigationFixResults = {
            results,
            passed,
            failed,
            timestamp: new Date().toISOString(),
            testRiskId
        };
        
        console.log('\n💾 Results saved to: window.navigationFixResults');
        
        return results;
    }
    
    // Expose for manual testing
    window.testNavigationFix = {
        runAllTests,
        runNavigationTest,
        queryTests
    };
    
    // Auto-run the tests
    runAllTests();
    
})();

console.log(`
🎯 NAVIGATION PROPERTIES FIX TEST:
1. This script tests the corrected navigation property names
2. The fix changes the query pattern order to use cr129_ControlTitle first
3. Run this after publishing the fix to verify it works
4. Check the console output to confirm the 400 errors are resolved

📋 EXPECTED RESULTS:
✅ cr129_ControlTitle pattern should work (200 OK)
❌ cr129_controltitle pattern should fail (400 Bad Request) 
🎯 The frontend code now tries the working pattern first
`); 