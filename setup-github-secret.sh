#!/bin/bash

# 🔐 GitHub Secret Setup Helper Script
# This script helps you set up SSO authentication for GitHub Actions

set -e

echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║  🔐 GitHub Actions SSO Authentication Setup          ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# Check if auth.json exists
if [ ! -f "auth.json" ]; then
    echo "❌ auth.json not found!"
    echo ""
    echo "📌 First, generate a valid session:"
    echo "   npm run login"
    echo ""
    echo "   Then complete MFA verification and click Resume."
    echo ""
    exit 1
fi

echo "✅ auth.json found"
echo ""

# Encode to base64
echo "📝 Encoding auth.json to base64..."
echo ""

AUTH_JSON_BASE64=$(cat auth.json | base64 -w 0 2>/dev/null || cat auth.json | openssl enc -base64 -A)

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "BASE64 ENCODED SECRET (Copy this):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "$AUTH_JSON_BASE64"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Try to copy to clipboard if available
if command -v xclip &> /dev/null; then
    echo "$AUTH_JSON_BASE64" | xclip -selection clipboard
    echo "✅ Base64 string copied to clipboard!"
    echo ""
fi

if command -v pbcopy &> /dev/null; then
    echo "$AUTH_JSON_BASE64" | pbcopy
    echo "✅ Base64 string copied to clipboard!"
    echo ""
fi

echo "📋 Next steps:"
echo ""
echo "1. Go to: https://github.com/YOUR-USERNAME/YOUR-REPO/settings/secrets/actions"
echo ""
echo "2. Click 'New repository secret'"
echo ""
echo "3. Fill in:"
echo "   • Name: AUTH_JSON"
echo "   • Value: [paste the base64 string above]"
echo ""
echo "4. Click 'Add secret'"
echo ""
echo "5. Test the workflow:"
echo "   • Go to Actions tab"
echo "   • Select 'Daily Regression Tests'"
echo "   • Click 'Run workflow'"
echo ""

echo "✨ Done! Your GitHub Actions workflow can now authenticate to SSO."
echo ""
