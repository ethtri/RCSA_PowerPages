function logResult(stepId, success, message, data = null) {
    const section = document.getElementById(stepId);
    const resultDiv = document.getElementById(stepId + '-result');
    
    if (section) {
        section.className = `test-section ${success ? 'success' : 'error'}`;
        section.style.backgroundColor = success ? '#d4edda' : '#f8d7da';
        section.style.borderColor = success ? '#c3e6cb' : '#f5c6cb';
    }
    
    let html = `<p><strong>${success ? '✅ SUCCESS' : '❌ FAILED'}:</strong> ${message}</p>`;
    if (data) {
        html += `<pre style="background: #f8f9fa; padding: 10px; overflow-x: auto;">${JSON.stringify(data, null, 2)}</pre>`;
    }
    if (resultDiv) {
        resultDiv.innerHTML = html;
    }
    
    console.log(`${stepId}: ${success ? 'SUCCESS' : 'FAILED'} - ${message}`, data);
}

function testStep1() {
    console.log('🧪 Testing Step 1: Basic RiskCtrl endpoint');
    
    $.ajax({
        url: '/_api/cr129_riskctrls',
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        success: function(response) {
            logResult('step1', true, `Found ${response.value?.length || 0} cr129_riskctrl records`, {
                count: response.value?.length,
                firstRecord: response.value?.[0],
                oDataContext: response['@odata.context']
            });
        },
        error: function(xhr, status, error) {
            logResult('step1', false, `HTTP ${xhr.status}: ${xhr.statusText}`, {
                status: xhr.status,
                statusText: xhr.statusText,
                responseText: xhr.responseText
            });
        }
    });
}

function testStep2() {
    console.log('🧪 Testing Step 2: Basic filter');
    
    $.ajax({
        url: '/_api/cr129_riskctrls?$filter=statecode eq 0',
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        success: function(response) {
            logResult('step2', true, `Found ${response.value?.length || 0} active records`, {
                count: response.value?.length,
                firstRecord: response.value?.[0]
            });
        },
        error: function(xhr, status, error) {
            logResult('step2', false, `HTTP ${xhr.status}: ${xhr.statusText}`, {
                status: xhr.status,
                responseText: xhr.responseText
            });
        }
    });
}

function testStep3() {
    console.log('🧪 Testing Step 3: Metadata');
    
    $.ajax({
        url: '/_api/$metadata',
        type: 'GET',
        success: function(response) {
            // Look for cr129_riskctrl in the metadata
            const hasRiskCtrl = response.includes('cr129_riskctrl') || response.includes('cr129_RiskCtrl');
            const hasNavigationProps = response.includes('NavigationProperty');
            
            logResult('step3', true, `Metadata loaded successfully`, {
                hasRiskCtrlEntity: hasRiskCtrl,
                hasNavigationProperties: hasNavigationProps,
                responseLength: response.length
            });
        },
        error: function(xhr, status, error) {
            logResult('step3', false, `HTTP ${xhr.status}: ${xhr.statusText}`, {
                status: xhr.status,
                responseText: xhr.responseText?.substring(0, 500)
            });
        }
    });
}

function testStep4() {
    console.log('🧪 Testing Step 4: Simple expand');
    
    $.ajax({
        url: '/_api/cr129_riskctrls?$expand=cr129_controltitle',
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        success: function(response) {
            logResult('step4', true, `Expand worked! Found ${response.value?.length || 0} records`, {
                count: response.value?.length,
                firstRecord: response.value?.[0]
            });
        },
        error: function(xhr, status, error) {
            logResult('step4', false, `HTTP ${xhr.status}: ${xhr.statusText}`, {
                status: xhr.status,
                responseText: xhr.responseText
            });
        }
    });
}

function testStep5() {
    console.log('🧪 Testing Step 5: Working controls endpoint');
    
    $.ajax({
        url: '/_api/cr129_controls',
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        success: function(response) {
            logResult('step5', true, `Controls API working: ${response.value?.length || 0} records`, {
                count: response.value?.length,
                firstRecord: response.value?.[0]
            });
        },
        error: function(xhr, status, error) {
            logResult('step5', false, `HTTP ${xhr.status}: ${xhr.statusText}`, {
                status: xhr.status,
                responseText: xhr.responseText
            });
        }
    });
}

// Auto-run all tests in sequence
function runAllTests() {
    console.log('🚀 Starting comprehensive API diagnostic tests...');
    clearResults();
    testStep1();
    setTimeout(testStep2, 1000);
    setTimeout(testStep3, 2000);
    setTimeout(testStep4, 3000);
    setTimeout(testStep5, 4000);
}

function clearResults() {
    for (let i = 1; i <= 5; i++) {
        const section = document.getElementById(`step${i}`);
        const resultDiv = document.getElementById(`step${i}-result`);
        
        if (section) {
            section.className = 'test-section pending';
            section.style.backgroundColor = '#fff3cd';
            section.style.borderColor = '#ffeaa7';
        }
        
        if (resultDiv) {
            resultDiv.innerHTML = '';
        }
    }
    console.clear();
    console.log('🗑️ Cleared all test results');
}
