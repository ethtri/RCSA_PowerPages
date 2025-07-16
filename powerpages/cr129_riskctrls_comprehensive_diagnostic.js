/**
 * cr129_riskctrls Web API Comprehensive Diagnostic Script
 * 
 * Run this in the browser console on your Power Pages portal
 * to systematically diagnose the cr129_riskctrls Web API issues.
 * 
 * This script follows the troubleshooting plan in docs/CR129_RISKCTRLS_TROUBLESHOOTING_PLAN.md
 */

(function() {
    'use strict';
    
    const diagnostics = {
        results: [],
        log: function(category, test, status, message, data) {
            const result = {
                category,
                test,
                status,
                message,
                data,
                timestamp: new Date().toISOString()
            };
            this.results.push(result);
            
            const statusIcon = status === 'SUCCESS' ? '✅' : status === 'FAILED' ? '❌' : '⚠️';
            console.log(`${statusIcon} [${category}] ${test}: ${message}`, data || '');
        },
        
        summary: function() {
            const passed = this.results.filter(r => r.status === 'SUCCESS').length;
            const failed = this.results.filter(r => r.status === 'FAILED').length;
            const warnings = this.results.filter(r => r.status === 'WARNING').length;
            
            console.log('\n📊 DIAGNOSTIC SUMMARY');
            console.log(`✅ Passed: ${passed}`);
            console.log(`❌ Failed: ${failed}`);
            console.log(`⚠️ Warnings: ${warnings}`);
            console.log(`📝 Total Tests: ${this.results.length}`);
            
            return {
                passed,
                failed,
                warnings,
                total: this.results.length,
                results: this.results
            };
        }
    };

    // Phase 1: Permission Verification Tests
    async function testPermissions() {
        console.log('\n🔐 PHASE 1: Permission Verification');
        
        // Test 1.1: Basic API Access Comparison
        try {
            const controlsResponse = await makeApiCall('GET', '/_api/cr129_controls?$top=1');
            diagnostics.log('Permissions', 'Controls API Access', 'SUCCESS', 
                'cr129_controls API accessible', { status: controlsResponse.status });
        } catch (error) {
            diagnostics.log('Permissions', 'Controls API Access', 'FAILED', 
                'cr129_controls API failed', { error: error.message, status: error.status });
        }
        
        try {
            const riskctrlsResponse = await makeApiCall('GET', '/_api/cr129_riskctrls?$top=1');
            diagnostics.log('Permissions', 'RiskCtrls API Access', 'SUCCESS', 
                'cr129_riskctrls API accessible', { status: riskctrlsResponse.status });
        } catch (error) {
            diagnostics.log('Permissions', 'RiskCtrls API Access', 'FAILED', 
                'cr129_riskctrls API failed', { error: error.message, status: error.status });
        }
        
        // Test 1.2: Related Entity Access
        const relatedEntities = ['cr129_risks', 'cr129_controls'];
        for (const entity of relatedEntities) {
            try {
                const response = await makeApiCall('GET', `/_api/${entity}?$top=1`);
                diagnostics.log('Permissions', `${entity} Access`, 'SUCCESS', 
                    `${entity} API accessible`, { status: response.status });
            } catch (error) {
                diagnostics.log('Permissions', `${entity} Access`, 'FAILED', 
                    `${entity} API failed`, { error: error.message, status: error.status });
            }
        }
    }

    // Phase 2: Metadata and Schema Validation
    async function testMetadata() {
        console.log('\n📋 PHASE 2: Metadata and Schema Validation');
        
        // Test 2.1: Metadata Endpoint
        try {
            const metadataResponse = await makeApiCall('GET', '/_api/$metadata');
            const metadataText = metadataResponse.data;
            
            // Check for cr129_riskctrls in metadata
            if (metadataText.includes('cr129_riskctrls')) {
                diagnostics.log('Metadata', 'Entity Set Definition', 'SUCCESS', 
                    'cr129_riskctrls found in metadata');
            } else {
                diagnostics.log('Metadata', 'Entity Set Definition', 'FAILED', 
                    'cr129_riskctrls not found in metadata');
            }
            
            // Check for navigation properties
            const riskNavPattern = /cr129_riskid.*NavigationProperty/i;
            const controlNavPattern = /cr129_controlid.*NavigationProperty/i;
            
            if (riskNavPattern.test(metadataText)) {
                diagnostics.log('Metadata', 'Risk Navigation Property', 'SUCCESS', 
                    'Risk navigation property found');
            } else {
                diagnostics.log('Metadata', 'Risk Navigation Property', 'WARNING', 
                    'Risk navigation property not clearly defined');
            }
            
            if (controlNavPattern.test(metadataText)) {
                diagnostics.log('Metadata', 'Control Navigation Property', 'SUCCESS', 
                    'Control navigation property found');
            } else {
                diagnostics.log('Metadata', 'Control Navigation Property', 'WARNING', 
                    'Control navigation property not clearly defined');
            }
            
        } catch (error) {
            diagnostics.log('Metadata', 'Metadata Access', 'FAILED', 
                'Cannot access metadata endpoint', { error: error.message });
        }
    }

    // Phase 3: Site Settings Verification
    async function testSiteSettings() {
        console.log('\n⚙️ PHASE 3: Site Settings Verification');
        
        // Test 3.1: Entity Set Names in Working Entities
        const workingEntities = ['cr129_controls', 'cr129_risks'];
        const problemEntity = 'cr129_riskctrls';
        
        // We can't directly access site settings via API, but we can test the effects
        diagnostics.log('Site Settings', 'Configuration Review', 'WARNING', 
            'Site settings must be verified manually in portal admin', {
                check: [
                    'Webapi/cr129_riskctrl/enabled = true',
                    'Webapi/cr129_riskctrl/fields = * (test with all fields)',
                    'Webapi/EntitySetName/cr129_riskctrl = cr129_riskctrls'
                ]
            });
    }

    // Phase 4: Junction Table Specific Tests
    async function testJunctionTablePatterns() {
        console.log('\n🔗 PHASE 4: Junction Table Specific Tests');
        
        // Test 4.1: Basic CRUD Operations (if accessible)
        const crudTests = [
            { method: 'GET', query: '?$top=1', name: 'Basic Read' },
            { method: 'GET', query: '?$select=cr129_riskctrlid&$top=1', name: 'Select Fields' },
            { method: 'GET', query: '?$filter=statecode eq 0&$top=1', name: 'Filter by State' },
        ];
        
        for (const test of crudTests) {
            try {
                const response = await makeApiCall(test.method, `/_api/cr129_riskctrls${test.query}`);
                diagnostics.log('Junction Table', test.name, 'SUCCESS', 
                    `${test.name} operation successful`, { status: response.status });
            } catch (error) {
                diagnostics.log('Junction Table', test.name, 'FAILED', 
                    `${test.name} operation failed`, { error: error.message, status: error.status });
            }
        }
        
        // Test 4.2: Relationship Expansion (if basic access works)
        const expandTests = [
            '?$expand=cr129_riskid&$top=1',
            '?$expand=cr129_controlid&$top=1',
            '?$expand=cr129_riskid,cr129_controlid&$top=1'
        ];
        
        for (const expand of expandTests) {
            try {
                const response = await makeApiCall('GET', `/_api/cr129_riskctrls${expand}`);
                diagnostics.log('Junction Table', 'Expand Relationships', 'SUCCESS', 
                    `Expand query successful: ${expand}`, { status: response.status });
            } catch (error) {
                diagnostics.log('Junction Table', 'Expand Relationships', 'FAILED', 
                    `Expand query failed: ${expand}`, { error: error.message, status: error.status });
            }
        }
    }

    // Phase 5: Error Analysis and Detailed Diagnostics
    async function testDetailedErrorAnalysis() {
        console.log('\n🔍 PHASE 5: Detailed Error Analysis');
        
        // Test 5.1: HTTP Status Code Analysis
        const testQueries = [
            '/_api/cr129_riskctrls',
            '/_api/cr129_riskctrls?$top=1',
            '/_api/cr129_riskctrls?$count=true',
            '/_api/cr129_riskctrls?$select=cr129_riskctrlid'
        ];
        
        for (const query of testQueries) {
            try {
                const response = await makeApiCall('GET', query);
                diagnostics.log('Error Analysis', 'Query Test', 'SUCCESS', 
                    `Query successful: ${query}`, { status: response.status, recordCount: response.data?.value?.length });
            } catch (error) {
                // Analyze specific error codes
                let errorCategory = 'Unknown Error';
                if (error.status === 403) {
                    errorCategory = 'Permission Denied (403)';
                } else if (error.status === 400) {
                    errorCategory = 'Bad Request (400)';
                } else if (error.status === 404) {
                    errorCategory = 'Not Found (404)';
                }
                
                diagnostics.log('Error Analysis', errorCategory, 'FAILED', 
                    `Query failed: ${query}`, { 
                        status: error.status, 
                        error: error.message,
                        responseText: error.responseText 
                    });
            }
        }
    }

    // Phase 6: Configuration Recommendations
    function generateRecommendations() {
        console.log('\n💡 PHASE 6: Configuration Recommendations');
        
        const failedTests = diagnostics.results.filter(r => r.status === 'FAILED');
        const recommendations = [];
        
        // Analyze failure patterns
        const hasPermissionFailures = failedTests.some(t => t.category === 'Permissions');
        const hasMetadataIssues = failedTests.some(t => t.category === 'Metadata');
        const hasJunctionTableIssues = failedTests.some(t => t.category === 'Junction Table');
        
        if (hasPermissionFailures) {
            recommendations.push({
                priority: 'HIGH',
                action: 'Review Table Permissions',
                details: [
                    'Check for multiple permission records for cr129_riskctrl',
                    'Verify web role assignments match working entities',
                    'Consider scope (Global vs Contact vs Account)',
                    'Remove conflicting permission records'
                ]
            });
        }
        
        if (hasMetadataIssues) {
            recommendations.push({
                priority: 'HIGH',
                action: 'Verify Site Settings',
                details: [
                    'Set Webapi/cr129_riskctrl/fields to * temporarily',
                    'Verify Webapi/EntitySetName/cr129_riskctrl = cr129_riskctrls',
                    'Check Webapi/cr129_riskctrl/enabled = true',
                    'Restart portal to refresh metadata cache'
                ]
            });
        }
        
        if (hasJunctionTableIssues) {
            recommendations.push({
                priority: 'MEDIUM',
                action: 'Junction Table Configuration',
                details: [
                    'Verify related entity permissions (cr129_risk, cr129_control)',
                    'Check if parent/child permission relationships are needed',
                    'Test with simplified relationship queries',
                    'Consider alternative scoping for junction tables'
                ]
            });
        }
        
        // Always include cache clearing recommendation
        recommendations.push({
            priority: 'LOW',
            action: 'Cache Management',
            details: [
                'Clear browser cache and cookies',
                'Restart Power Pages portal if possible',
                'Force metadata refresh',
                'Test in incognito/private browser window'
            ]
        });
        
        recommendations.forEach((rec, index) => {
            diagnostics.log('Recommendations', `${rec.priority} Priority`, 'WARNING', 
                rec.action, { details: rec.details });
        });
        
        return recommendations;
    }

    // Utility function for making API calls
    function makeApiCall(method, url) {
        return new Promise((resolve, reject) => {
            // Try to use the webapi.safeAjax if available (Power Pages environment)
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
                // Fallback to regular jQuery AJAX
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

    // Main execution function
    async function runComprehensiveDiagnostics() {
        console.log('🚀 Starting Comprehensive cr129_riskctrls Diagnostics...\n');
        console.log('📋 Following troubleshooting plan: docs/CR129_RISKCTRLS_TROUBLESHOOTING_PLAN.md\n');
        
        try {
            await testPermissions();
            await testMetadata();
            await testSiteSettings();
            await testJunctionTablePatterns();
            await testDetailedErrorAnalysis();
            const recommendations = generateRecommendations();
            
            const summary = diagnostics.summary();
            
            console.log('\n📄 DETAILED RESULTS:');
            console.table(diagnostics.results);
            
            console.log('\n🎯 PRIORITY ACTIONS:');
            const highPriorityActions = recommendations.filter(r => r.priority === 'HIGH');
            highPriorityActions.forEach(action => {
                console.log(`❗ ${action.action}:`);
                action.details.forEach(detail => console.log(`   • ${detail}`));
            });
            
            // Save results to global scope for further analysis
            window.cr129DiagnosticResults = {
                summary,
                results: diagnostics.results,
                recommendations,
                timestamp: new Date().toISOString()
            };
            
            console.log('\n💾 Results saved to: window.cr129DiagnosticResults');
            console.log('\n📊 Run summary again with: diagnostics.summary()');
            
            return summary;
            
        } catch (error) {
            console.error('❌ Diagnostic script failed:', error);
            diagnostics.log('System', 'Script Execution', 'FAILED', 
                'Diagnostic script encountered error', { error: error.message });
        }
    }

    // Expose functions for manual testing
    window.cr129Diagnostics = {
        runAll: runComprehensiveDiagnostics,
        testPermissions,
        testMetadata,
        testJunctionTablePatterns,
        testDetailedErrorAnalysis,
        makeApiCall,
        results: diagnostics.results,
        summary: diagnostics.summary.bind(diagnostics)
    };

    // Auto-run the comprehensive diagnostics
    runComprehensiveDiagnostics();

})();

// Usage Instructions:
console.log(`
🔧 USAGE INSTRUCTIONS:
1. Copy and paste this entire script into your browser console while on the Power Pages portal
2. The script will automatically run a comprehensive diagnostic
3. Review the results and follow the HIGH priority recommendations first
4. Results are saved to window.cr129DiagnosticResults for further analysis
5. Re-run individual test phases using window.cr129Diagnostics.testPermissions(), etc.

📚 For detailed troubleshooting steps, see: docs/CR129_RISKCTRLS_TROUBLESHOOTING_PLAN.md
`); 