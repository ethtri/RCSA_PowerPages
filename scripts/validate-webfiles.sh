#!/bin/bash
set -e

echo "🔍 Validating web file configurations..."

# Check that every CSS/JS file has corresponding .webfile.yml
for file in powerpages/rcsa-copilot---site-5joks/web-files/*.css powerpages/rcsa-copilot---site-5joks/web-files/*.js; do
    if [ -f "$file" ]; then
        webfile_config="${file}.webfile.yml"
        if [ ! -f "$webfile_config" ]; then
            echo "❌ ERROR: Missing webfile configuration!"
            echo "   File: $file"
            echo "   Expected: $webfile_config"
            echo ""
            echo "🔧 FIX: Create webfile.yml with proper configuration"
            exit 1
        fi
        
        # Validate webfile.yml contains required fields
        if ! grep -q "adx_name:" "$webfile_config"; then
            echo "❌ ERROR: Invalid webfile configuration!"
            echo "   File: $webfile_config"
            echo "   Missing: adx_name field"
            exit 1
        fi
        
        if ! grep -q "adx_partialurl:" "$webfile_config"; then
            echo "❌ ERROR: Invalid webfile configuration!"
            echo "   File: $webfile_config"
            echo "   Missing: adx_partialurl field"
            exit 1
        fi
    fi
done

echo "✅ Web file configurations validated" 