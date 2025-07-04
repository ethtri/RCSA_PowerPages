#!/bin/bash
set -e

echo "🔍 Checking for root directory changes..."

# Check if any changes are in root directory (not powerpages)
ROOT_CHANGES=$(git diff --cached --name-only | grep -E "^rcsa-copilot---site-5joks/" | grep -v "^powerpages/" || true)

if [ ! -z "$ROOT_CHANGES" ]; then
    echo "❌ ERROR: Changes to root directory detected!"
    echo "   Changed files:"
    echo "$ROOT_CHANGES"
    echo ""
    echo "🔧 FIX: Move all changes to powerpages/ directory:"
    echo "   All edits must be in: powerpages/rcsa-copilot---site-5joks/"
    exit 1
fi

echo "✅ No root directory changes detected"
