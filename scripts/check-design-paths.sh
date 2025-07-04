#!/bin/bash
set -e

echo "🔍 Checking design system file paths..."

# Check for incorrect paths in HTML files
INCORRECT_PATHS=$(grep -r "/rcsa-design-system/" powerpages/ || true)

if [ ! -z "$INCORRECT_PATHS" ]; then
    echo "❌ ERROR: Incorrect design system paths found!"
    echo "$INCORRECT_PATHS"
    echo ""
    echo "🔧 FIX: Update paths to:"
    echo "   Expected: /logicgate-design-system.css"
    echo "   Expected: /logicgate-components.js"
    exit 1
fi

# Check that pages include design system
PAGES_WITHOUT_DESIGN=$(find powerpages/rcsa-copilot---site-5joks/web-pages -name "*.html" -exec grep -L "logicgate-design-system.css" {} \; || true)

if [ ! -z "$PAGES_WITHOUT_DESIGN" ]; then
    echo "⚠️  WARNING: Pages found without LogicGate design system:"
    echo "$PAGES_WITHOUT_DESIGN"
    echo ""
    echo "🔧 FIX: Add to page header:"
    echo '   <link rel="stylesheet" href="/logicgate-design-system.css">'
    echo '   <script src="/logicgate-components.js"></script>'
fi

echo "✅ Design system paths validated" 