/**
 * Debug Navigation Properties for cr129_riskctrls
 * 
 * This script helps identify the correct navigation property names
 * and field names for the cr129_riskctrl entity relationships.
 */

(function() {
    'use strict';
    
    console.log('🔍 Debugging Navigation Properties for cr129_riskctrls...\n');
    
    async function checkMetadata() {
        console.log('📋 Step 1: Checking Metadata for Navigation Properties...');
        
        try {
            const response = await fetch('/_api/$metadata');
            const metadataText = await response.text();
            
            // Look for cr129_riskctrl entity definition
            const entityPattern = /<EntityType\s+Name="cr129_riskctrl"[\s\S]*?<\/EntityType>/i;
            const entityMatch = metadataText.match(entityPattern);
            
            if (entityMatch) {
                console.log('✅ Found cr129_riskctrl entity in metadata');
                
                // Extract navigation properties
                const navPropPattern = /<NavigationProperty\s+Name="([^"]+)"[^>]*>/g;
                const navigationProperties = [];
                let match;
                
                while ((match = navPropPattern.exec(entityMatch[0])) !== null) {
                    navigationProperties.push(match[1]);
                }
                
                console.log('🔗 Navigation Properties found:', navigationProperties);
                
                // Look for risk and control related properties
                const riskProps = navigationProperties.filter(prop => 
                    prop.toLowerCase().includes('risk') || prop.toLowerCase().includes('title')
                );
                const controlProps = navigationProperties.filter(prop => 
                    prop.toLowerCase().includes('control') || prop.toLowerCase().includes('title')
                );
                
                console.log('🎯 Risk-related nav properties:', riskProps);
                console.log('🎯 Control-related nav properties:', controlProps);
                
                // Look for property definitions (fields)
                const propertyPattern = /<Property\s+Name="([^"]+)"[^>]*>/g;
                const properties = [];
                let propMatch;
                
                while ((propMatch = propertyPattern.exec(entityMatch[0])) !== null) {
                    properties.push(propMatch[1]);
                }
                
                const lookupFields = properties.filter(prop => 
                    prop.includes('_value') && (prop.includes('risk') || prop.includes('control'))
                );
                
                console.log('🔍 Lookup fields (_value):', lookupFields);
                
            } else {
                console.log('❌ cr129_riskctrl entity not found in metadata');
            }
            
        } catch (error) {
            console.error('❌ Failed to fetch metadata:', error);
        }
    }
    
    async function testBasicQuery() {
        console.log('\n📋 Step 2: Testing Basic cr129_riskctrls Query...');
        
        try {
            const response = await webapi.safeAjax({
                type: 'GET',
                url: '/_api/cr129_riskctrls?$top=1'
            });
            
            console.log('✅ Basic query successful');
            
            if (response.value && response.value.length > 0) {
                const record = response.value[0];
                console.log('📊 Sample record structure:');
                
                // Look for risk and control related fields
                const riskFields = Object.keys(record).filter(key => 
                    key.toLowerCase().includes('risk') || key.includes('_cr129_risk')
                );
                const controlFields = Object.keys(record).filter(key => 
                    key.toLowerCase().includes('control') || key.includes('_cr129_control')
                );
                
                console.log('🎯 Risk-related fields:', riskFields);
                console.log('🎯 Control-related fields:', controlFields);
                
                // Show the actual field names and values
                riskFields.forEach(field => {
                    console.log(`   ${field}: ${record[field]}`);
                });
                controlFields.forEach(field => {
                    console.log(`   ${field}: ${record[field]}`);
                });
                
            } else {
                console.log('⚠️ No records found in cr129_riskctrls');
            }
            
        } catch (error) {
            console.error('❌ Basic query failed:', error);
        }
    }
    
    async function testNavigationQueries() {
        console.log('\n📋 Step 3: Testing Different Navigation Property Names...');
        
        const testQueries = [
            // Test different navigation property names
            '/_api/cr129_riskctrls?$expand=cr129_risktitle&$top=1',
            '/_api/cr129_riskctrls?$expand=cr129_RiskTitle&$top=1', 
            '/_api/cr129_riskctrls?$expand=cr129_risktitle_value&$top=1',
            '/_api/cr129_riskctrls?$expand=cr129_controltitle&$top=1',
            '/_api/cr129_riskctrls?$expand=cr129_ControlTitle&$top=1',
            '/_api/cr129_riskctrls?$expand=cr129_controltitle_value&$top=1',
            
            // Test both together
            '/_api/cr129_riskctrls?$expand=cr129_RiskTitle,cr129_ControlTitle&$top=1'
        ];
        
        for (const query of testQueries) {
            console.log(`🧪 Testing: ${query}`);
            
            try {
                const response = await webapi.safeAjax({
                    type: 'GET',
                    url: query
                });
                
                console.log(`✅ SUCCESS: ${query}`);
                
                if (response.value && response.value.length > 0) {
                    const record = response.value[0];
                    // Look for expanded properties
                    const expandedProps = Object.keys(record).filter(key => 
                        !key.startsWith('_') && !key.startsWith('@') && 
                        (key.includes('risk') || key.includes('control') || key.includes('Risk') || key.includes('Control'))
                    );
                    
                    if (expandedProps.length > 0) {
                        console.log(`   📋 Expanded properties: ${expandedProps.join(', ')}`);
                    }
                }
                
            } catch (error) {
                console.log(`❌ FAILED: ${query} - Status: ${error.status}`);
            }
        }
    }
    
    async function generateCorrectQuery() {
        console.log('\n📋 Step 4: Generating Correct Query Pattern...');
        
        // Based on the successful pattern from logs: cr129_ControlTitle works
        const correctQuery = `/_api/cr129_riskctrls?$filter=_cr129_risktitle_value eq c74510ad-3460-f011-bec2-7c1e521687a7 and statecode eq 0&$expand=cr129_RiskTitle($select=cr129_riskid,cr129_risktitle),cr129_ControlTitle($select=cr129_controlid,cr129_controltitle)`;
        
        console.log('🎯 Recommended query pattern:');
        console.log(correctQuery);
        
        try {
            const response = await webapi.safeAjax({
                type: 'GET',
                url: correctQuery
            });
            
            console.log('✅ Recommended query works!');
            console.log(`📊 Results: ${response.value.length} records found`);
            
            if (response.value.length > 0) {
                console.log('📋 Sample expanded record:', response.value[0]);
            }
            
        } catch (error) {
            console.error('❌ Recommended query failed:', error);
        }
    }
    
    // Run all diagnostic steps
    async function runFullDiagnostic() {
        try {
            await checkMetadata();
            await testBasicQuery();
            await testNavigationQueries();
            await generateCorrectQuery();
            
            console.log('\n🎯 SUMMARY:');
            console.log('1. Check the console output above for correct navigation property names');
            console.log('2. Update the frontend code to use the working navigation properties'); 
            console.log('3. The pattern cr129_ControlTitle (capital C) appears to work');
            console.log('4. Test the recommended query pattern for your specific risk ID');
            
        } catch (error) {
            console.error('❌ Diagnostic failed:', error);
        }
    }
    
    // Expose for manual testing
    window.debugNavProps = {
        checkMetadata,
        testBasicQuery, 
        testNavigationQueries,
        generateCorrectQuery,
        runFullDiagnostic
    };
    
    // Auto-run the diagnostic
    runFullDiagnostic();
    
})();

console.log(`
🔧 NAVIGATION PROPERTIES DIAGNOSTIC:
1. This script will identify the correct navigation property names for cr129_riskctrls
2. Run this in your browser console on the Power Pages portal
3. Review the output to understand the correct field and navigation names
4. Use the findings to update the Control Mapping frontend code

💡 QUICK FIX HINT:
Based on your logs, try changing 'cr129_controltitle' to 'cr129_ControlTitle' (capital C)
`); 