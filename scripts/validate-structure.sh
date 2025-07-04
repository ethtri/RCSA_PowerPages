#!/bin/bash
set -e

echo "🔍 Validating Power Pages directory structure..."

# Check if duplicate directory exists
if [ -d "rcsa-copilot---site-5joks" ] && [ ! -L "rcsa-copilot---site-5joks" ]; then
    echo "❌ ERROR: Duplicate directory detected!"
    echo "   Found: rcsa-copilot---site-5joks/"
    echo "   Expected: Only powerpages/rcsa-copilot---site-5joks/"
    echo ""
    echo "🔧 FIX: Remove duplicate directory:"
    echo "   rm -rf rcsa-copilot---site-5joks/"
    exit 1
fi

# Check if powerpages directory exists
if [ ! -d "powerpages/rcsa-copilot---site-5joks" ]; then
    echo "❌ ERROR: Power Pages directory missing!"
    echo "   Expected: powerpages/rcsa-copilot---site-5joks/"
    exit 1
fi

# Check for design system files in correct location
if [ ! -f "powerpages/rcsa-copilot---site-5joks/web-files/logicgate-design-system.css" ]; then
    echo "❌ ERROR: LogicGate design system CSS missing!"
    echo "   Expected: powerpages/rcsa-copilot---site-5joks/web-files/logicgate-design-system.css"
    exit 1
fi

if [ ! -f "powerpages/rcsa-copilot---site-5joks/web-files/logicgate-components.js" ]; then
    echo "❌ ERROR: LogicGate design system JS missing!"
    echo "   Expected: powerpages/rcsa-copilot---site-5joks/web-files/logicgate-components.js"
    exit 1
fi

echo "✅ Directory structure validated"
echo "✅ Design system files present" 