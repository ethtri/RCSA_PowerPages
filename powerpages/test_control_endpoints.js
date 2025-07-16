// Test Control API Endpoints After Permission Fixes
// This script tests the control entity endpoints that were returning 404/400 errors

const baseUrl = 'https://site-5joks.powerappsportals.com';

async function testControlEndpoints() {
    console.log('🧪 Testing Control Entity API Endpoints...\n');
    
    const patterns = [
        'cr129_controls',  // Plural (expected to work with EntitySetName mapping)
        'cr129_control',   // Singular (base entity name)
        'cr129_Control',   // Capitalized variant
        'cr129_Controls'   // Capitalized plural
    ];
    
    const testQuery = '?$select=cr129_controlid,cr129_controltitle,cr129_controltype,cr129_designefficiency,cr129_operationalefficiency,cr129_isautomated,cr129_controlowner&$orderby=cr129_controltitle&$filter=statecode%20eq%200&$top=1';
    
    let successCount = 0;
    let workingPatterns = [];
    
    for (let i = 0; i < patterns.length; i++) {
        const pattern = patterns[i];
        const fullUrl = `${baseUrl}/_api/${pattern}${testQuery}`;
        
        console.log(`🔍 Testing pattern ${i + 1}: ${pattern}`);
        console.log(`📋 URL: ${fullUrl}`);
        
        try {
            const response = await fetch(fullUrl);
            
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ SUCCESS: ${pattern} - Status: ${response.status}`);
                console.log(`📊 Records returned: ${data.value?.length || 0}`);
                
                if (data.value && data.value.length > 0) {
                    console.log(`📋 Sample record:`, data.value[0]);
                }
                
                successCount++;
                workingPatterns.push(pattern);
            } else {
                console.log(`❌ FAILED: ${pattern} - Status: ${response.status} ${response.statusText}`);
                
                // Try to get error details
                try {
                    const errorData = await response.text();
                    console.log(`📋 Error details: ${errorData.substring(0, 200)}...`);
                } catch (e) {
                    console.log(`📋 Could not read error details`);
                }
            }
            
        } catch (error) {
            console.log(`❌ ERROR: ${pattern} - ${error.message}`);
        }
        
        console.log(''); // Empty line for readability
    }
    
    // Summary
    console.log('='.repeat(50));
    console.log(`📊 SUMMARY:`);
    console.log(`✅ Successful patterns: ${successCount}/${patterns.length}`);
    
    if (workingPatterns.length > 0) {
        console.log(`🎯 Working patterns: ${workingPatterns.join(', ')}`);
        console.log(`💡 Recommended pattern: ${workingPatterns[0]}`);
    } else {
        console.log(`❌ No patterns worked - permission or site setting issues remain`);
    }
    
    return {
        successCount,
        workingPatterns,
        totalTested: patterns.length
    };
}

// Run the test
testControlEndpoints()
    .then(results => {
        console.log('\n🎯 Test completed!');
        if (results.workingPatterns.length > 0) {
            console.log('✅ Control API endpoints are now working!');
        } else {
            console.log('❌ Control API endpoints still need troubleshooting');
        }
    })
    .catch(error => {
        console.error('💥 Test script error:', error);
    }); 