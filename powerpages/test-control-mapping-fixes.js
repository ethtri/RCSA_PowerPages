// Control Mapping Fixes Validation Script
// Run this in the browser console on the Control Mapping page

console.log('🧪 Starting Control Mapping Fixes Validation...');

// Test 1: Web API Authentication & Permissions
async function testWebAPIAccess() {
  console.log('\n📋 Test 1: Web API Authentication & Permissions');
  
  const endpoints = [
    '/_api/cr129_controls?$top=1',
    '/_api/cr129_risks?$top=1', 
    '/_api/cr129_riskctrls?$top=1',
    '/_api/cr129_procs?$top=1',
    '/_api/$metadata',
    '/_api/cr129_controls?$select=cr129_controlid,cr129_controltitle&$filter=statecode eq 0&$top=5',
    '/_api/cr129_riskctrls?$filter=statecode eq 0&$top=1'
  ];
  
  const results = {};
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint);
      results[endpoint] = {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      };
      
      if (response.ok) {
        console.log(`✅ ${endpoint} - SUCCESS (${response.status})`);
        
        // For successful data endpoints, show count
        if (endpoint !== '/_api/$metadata') {
          try {
            const data = await response.json();
            if (data.value) {
              console.log(`   📊 Records returned: ${data.value.length}`);
            }
          } catch (parseError) {
            console.log(`   ⚠️ Could not parse JSON response`);
          }
        } else {
          console.log(`   📊 Metadata endpoint accessible`);
        }
      } else {
        console.log(`❌ ${endpoint} - FAILED (${response.status} ${response.statusText})`);
      }
    } catch (error) {
      results[endpoint] = {
        status: 'ERROR',
        error: error.message
      };
      console.log(`❌ ${endpoint} - ERROR: ${error.message}`);
    }
  }
  
  return results;
}

// Test 2: React Version Conflicts
function testReactVersions() {
  console.log('\n📋 Test 2: React Version Conflicts');
  
  const reactVersion = typeof React !== 'undefined' ? React.version : 'undefined';
  const reactDOMVersion = typeof ReactDOM !== 'undefined' ? ReactDOM.version : 'undefined';
  
  console.log(`React version: ${reactVersion}`);
  console.log(`ReactDOM version: ${reactDOMVersion}`);
  
  if (reactVersion !== 'undefined' && reactDOMVersion !== 'undefined') {
    if (reactVersion === reactDOMVersion) {
      console.log('✅ React versions match');
      return { status: 'PASS', versions: { react: reactVersion, reactDOM: reactDOMVersion } };
    } else {
      console.log('⚠️ React versions mismatch');
      return { status: 'MISMATCH', versions: { react: reactVersion, reactDOM: reactDOMVersion } };
    }
  } else {
    console.log('✅ React not loaded (avoiding conflicts)');
    return { status: 'NOT_LOADED', versions: { react: reactVersion, reactDOM: reactDOMVersion } };
  }
}

// Test 3: WebChat Error Handling
function testWebChatErrors() {
  console.log('\n📋 Test 3: WebChat Error Handling');
  
  try {
    if (typeof window.WebChat !== 'undefined') {
      console.log('WebChat object found');
      
      if (window.WebChat.emojiSet) {
        console.log('✅ WebChat emojiSet is properly initialized');
        return { status: 'PASS', emojiSet: 'initialized' };
      } else {
        console.log('⚠️ WebChat emojiSet not found (may cause errors)');
        return { status: 'WARNING', emojiSet: 'missing' };
      }
    } else {
      console.log('✅ WebChat not loaded (no conflicts)');
      return { status: 'NOT_LOADED', emojiSet: 'n/a' };
    }
  } catch (error) {
    console.log(`❌ WebChat test error: ${error.message}`);
    return { status: 'ERROR', error: error.message };
  }
}

// Test 4: DOM Overlay Cleanup
function testDOMOverlayCleanup() {
  console.log('\n📋 Test 4: DOM Overlay Cleanup');
  
  const overlays = document.querySelectorAll('.overlay, .modal-backdrop, .loading-overlay');
  
  if (overlays.length === 0) {
    console.log('✅ No problematic overlays found');
    return { status: 'PASS', overlayCount: 0 };
  } else {
    console.log(`⚠️ Found ${overlays.length} overlay elements`);
    overlays.forEach((overlay, index) => {
      console.log(`  Overlay ${index + 1}:`, overlay.className);
    });
    return { status: 'WARNING', overlayCount: overlays.length };
  }
}

// Test 5: Web API Wrapper Availability
function testWebAPIWrapper() {
  console.log('\n📋 Test 5: Web API Wrapper Availability');
  
  if (typeof webapi !== 'undefined') {
    const methods = ['safeAjax', 'get', 'create', 'update', 'delete'];
    const availableMethods = methods.filter(method => typeof webapi[method] === 'function');
    
    console.log(`✅ Web API wrapper loaded with ${availableMethods.length}/${methods.length} methods`);
    console.log('Available methods:', availableMethods);
    
    return { 
      status: 'PASS', 
      methods: availableMethods,
      complete: availableMethods.length === methods.length
    };
  } else {
    console.log('❌ Web API wrapper not loaded');
    return { status: 'FAILED', methods: [] };
  }
}

// Test 6: Control Loading Functionality
async function testControlLoading() {
  console.log('\n📋 Test 6: Control Loading Functionality');
  
  try {
    if (typeof loadAvailableControls === 'function') {
      console.log('🔄 Testing control loading...');
      const controls = await loadAvailableControls();
      
      if (controls && controls.length > 0) {
        console.log(`✅ Controls loaded successfully: ${controls.length} controls`);
        return { status: 'PASS', controlCount: controls.length };
      } else {
        console.log('⚠️ No controls loaded');
        return { status: 'WARNING', controlCount: 0 };
      }
    } else {
      console.log('❌ loadAvailableControls function not found');
      return { status: 'FAILED', error: 'Function not found' };
    }
  } catch (error) {
    console.log(`❌ Control loading error: ${error.message}`);
    return { status: 'ERROR', error: error.message };
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Running all Control Mapping validation tests...\n');
  
  const results = {
    webAPIAccess: await testWebAPIAccess(),
    reactVersions: testReactVersions(),
    webChatErrors: testWebChatErrors(),
    domOverlayCleanup: testDOMOverlayCleanup(),
    webAPIWrapper: testWebAPIWrapper(),
    controlLoading: await testControlLoading()
  };
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  
  Object.entries(results).forEach(([testName, result]) => {
    const status = result.status;
    const icon = status === 'PASS' ? '✅' : status === 'WARNING' ? '⚠️' : '❌';
    console.log(`${icon} ${testName}: ${status}`);
  });
  
  console.log('\n🎯 Validation Complete!');
  console.log('If Web API tests show SUCCESS, the Control Mapping page should work correctly.');
  
  return results;
}

// Auto-run if this script is executed directly
if (typeof window !== 'undefined') {
  runAllTests().then(results => {
    window.controlMappingTestResults = results;
    console.log('\n💾 Results saved to window.controlMappingTestResults');
  });
} 