// API Diagnostic Test JavaScript
// This script provides comprehensive testing of Power Pages Web API endpoints

let metadataXml = null;
let testResults = {};

function log(elementId, message, type = 'info') {
    const element = document.getElementById(elementId);
    if (!element) {
        console.log(`[API Diagnostic] Element ${elementId} not found`);
        return;
    }
    
    const timestamp = new Date().toISOString();
    const className = type === 'error' ? 'error' : type === 'success' ? 'success' : type === 'warning' ? 'warning' : '';
    
    const logEntry = `[${timestamp}] ${message}\n`;
    element.innerHTML += logEntry;
    element.className = `results ${className}`;
    element.scrollTop = element.scrollHeight;
    
    // Also log to console for debugging
    console.log(`[API Diagnostic] ${message}`);
}

function clearResults() {
    const resultDivs = document.querySelectorAll('.results');
    resultDivs.forEach(div => {
        div.innerHTML = '';
        div.className = 'results';
    });
    testResults = {};
}

async function testMetadata() {
    const resultId = 'metadata-results';
    log(resultId, 'Testing /_api/$metadata endpoint...');
    
    try {
        const response = await fetch('/_api/$metadata', {
            method: 'GET',
            headers: {
                'Accept': 'application/xml',
                'Content-Type': 'application/xml'
            }
        });
        
        log(resultId, `Response Status: ${response.status} ${response.statusText}`);
        log(resultId, `Response Headers: ${JSON.stringify(Object.fromEntries(response.headers), null, 2)}`);
        
        if (response.ok) {
            const xmlText = await response.text();
            metadataXml = xmlText;
            log(resultId, `Metadata XML length: ${xmlText.length} characters`, 'success');
            log(resultId, `First 500 chars: ${xmlText.substring(0, 500)}...`);
            testResults.metadata = { success: true, data: xmlText };
        } else {
            const errorText = await response.text();
            log(resultId, `Error Response: ${errorText}`, 'error');
            testResults.metadata = { success: false, error: errorText, status: response.status };
        }
    } catch (error) {
        log(resultId, `Network Error: ${error.message}`, 'error');
        testResults.metadata = { success: false, error: error.message };
    }
}

function parseEntitySets() {
    const resultId = 'entitysets-results';
    
    if (!metadataXml) {
        log(resultId, 'No metadata available. Please run metadata test first.', 'warning');
        return;
    }
    
    log(resultId, 'Parsing entity sets from metadata...');
    
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(metadataXml, 'text/xml');
        
        // Look for EntitySet elements
        const entitySets = xmlDoc.querySelectorAll('EntitySet');
        
        if (entitySets.length === 0) {
            log(resultId, 'No EntitySet elements found in metadata', 'warning');
            return;
        }
        
        log(resultId, `Found ${entitySets.length} entity sets:`, 'success');
        
        const entitySetNames = [];
        entitySets.forEach(entitySet => {
            const name = entitySet.getAttribute('Name');
            const entityType = entitySet.getAttribute('EntityType');
            entitySetNames.push(name);
            log(resultId, `  - ${name} (${entityType})`);
        });
        
        testResults.entitySets = entitySetNames;
        
        // Check if our expected entity sets are present
        const expectedSets = ['cr129_risks', 'cr129_controls', 'cr129_procs', 'cr129_riskctrls', 'cr129_bus'];
        const missingSets = expectedSets.filter(set => !entitySetNames.includes(set));
        
        if (missingSets.length > 0) {
            log(resultId, `Missing expected entity sets: ${missingSets.join(', ')}`, 'warning');
        } else {
            log(resultId, 'All expected entity sets found!', 'success');
        }
        
    } catch (error) {
        log(resultId, `Error parsing metadata: ${error.message}`, 'error');
    }
}

async function testEntity(entityName) {
    const resultId = 'entity-results';
    log(resultId, `Testing /_api/${entityName} endpoint...`);
    
    try {
        const response = await fetch(`/_api/${entityName}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        log(resultId, `${entityName} - Status: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
            const data = await response.json();
            log(resultId, `${entityName} - Success! Record count: ${data.value ? data.value.length : 'N/A'}`, 'success');
            if (data.value && data.value.length > 0) {
                log(resultId, `${entityName} - First record keys: ${Object.keys(data.value[0]).join(', ')}`);
            }
            testResults[entityName] = { success: true, count: data.value ? data.value.length : 0 };
        } else {
            const errorText = await response.text();
            log(resultId, `${entityName} - Error: ${errorText}`, 'error');
            testResults[entityName] = { success: false, error: errorText, status: response.status };
        }
    } catch (error) {
        log(resultId, `${entityName} - Network Error: ${error.message}`, 'error');
        testResults[entityName] = { success: false, error: error.message };
    }
}

async function testComplexQueries() {
    const resultId = 'complex-results';
    log(resultId, 'Testing complex queries used in Control Mapping...');
    
    // Test the exact queries from the Control Mapping page
    const queries = [
        {
            name: 'Risks with Business Unit',
            url: '/_api/cr129_risks?$select=cr129_riskid,cr129_risktitle,cr129_businessunitname&$expand=cr129_businessunitname($select=cr129_businessunitname)'
        },
        {
            name: 'Controls Basic',
            url: '/_api/cr129_controls?$select=cr129_controlid,cr129_controltitle'
        },
        {
            name: 'Risk-Control Mappings',
            url: '/_api/cr129_riskctrls?$select=cr129_riskctrlid,cr129_riskid,cr129_controlid&$expand=cr129_riskid($select=cr129_risktitle),cr129_controlid($select=cr129_controltitle)'
        },
        {
            name: 'Business Units',
            url: '/_api/cr129_bus?$select=cr129_businessunitname'
        }
    ];
    
    for (const query of queries) {
        log(resultId, `Testing: ${query.name}`);
        log(resultId, `URL: ${query.url}`);
        
        try {
            const response = await fetch(query.url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            log(resultId, `${query.name} - Status: ${response.status} ${response.statusText}`);
            
            if (response.ok) {
                const data = await response.json();
                log(resultId, `${query.name} - Success! Records: ${data.value ? data.value.length : 'N/A'}`, 'success');
            } else {
                const errorText = await response.text();
                log(resultId, `${query.name} - Error: ${errorText}`, 'error');
            }
        } catch (error) {
            log(resultId, `${query.name} - Network Error: ${error.message}`, 'error');
        }
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

async function testAuthentication() {
    const resultId = 'auth-results';
    log(resultId, 'Testing authentication status...');
    
    // Check if we can access any user info
    try {
        // Try to get current user info if available
        if (window.Shell && window.Shell.getCurrentUser) {
            const user = window.Shell.getCurrentUser();
            log(resultId, `Current User: ${JSON.stringify(user)}`, 'success');
        } else {
            log(resultId, 'Shell.getCurrentUser not available');
        }
        
        // Test a simple authenticated endpoint
        const response = await fetch('/_api/contacts', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        log(resultId, `Contacts endpoint test - Status: ${response.status}`);
        
        if (response.ok) {
            log(resultId, 'Authentication appears to be working (contacts accessible)', 'success');
        } else {
            log(resultId, 'Authentication may have issues (contacts not accessible)', 'warning');
        }
        
    } catch (error) {
        log(resultId, `Authentication test error: ${error.message}`, 'error');
    }
}

async function runAllTests() {
    const resultId = 'summary-results';
    log(resultId, 'Running all diagnostic tests...');
    
    await testMetadata();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    parseEntitySets();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const entities = ['cr129_risks', 'cr129_controls', 'cr129_procs', 'cr129_riskctrls', 'cr129_bus'];
    for (const entity of entities) {
        await testEntity(entity);
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    await testComplexQueries();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testAuthentication();
    
    // Summary
    log(resultId, '\n=== DIAGNOSTIC SUMMARY ===', 'success');
    log(resultId, `Metadata: ${testResults.metadata ? (testResults.metadata.success ? 'SUCCESS' : 'FAILED') : 'NOT TESTED'}`);
    
    if (testResults.entitySets) {
        log(resultId, `Entity Sets Found: ${testResults.entitySets.length}`);
    }
    
    entities.forEach(entity => {
        if (testResults[entity]) {
            log(resultId, `${entity}: ${testResults[entity].success ? 'SUCCESS' : 'FAILED'}`);
        }
    });
    
    log(resultId, '\nCheck individual test sections above for detailed results.');
}

// Initialize when DOM is ready
$(document).ready(function() {
    // Auto-run metadata test after a short delay
    setTimeout(function() {
        if (typeof testMetadata === 'function') {
            testMetadata();
        }
    }, 1000);
});
