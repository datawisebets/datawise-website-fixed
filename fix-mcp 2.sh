#!/bin/bash

echo "🔧 Fixing Claude Code MCP Connection..."

# 1. Kill any running Claude processes
echo "📍 Step 1: Stopping Claude Code..."
pkill -f "claude" 2>/dev/null || true
sleep 2

# 2. Clear NPX cache
echo "📍 Step 2: Clearing NPX cache..."
rm -rf ~/.npm/_npx/*

# 3. Clear any temporary MCP files
echo "📍 Step 3: Clearing temporary files..."
rm -rf /tmp/mcp-* 2>/dev/null || true
rm -rf /tmp/context7-* 2>/dev/null || true

# 4. Re-add Context7 with explicit path
echo "📍 Step 4: Re-configuring Context7..."
# First, let's modify the config directly to ensure proper setup
claude mcp add context7 "npx -y @upstash/context7-mcp@latest" || echo "⚠️  Failed to add Context7, it may already exist"

# 5. Test Context7 installation
echo "📍 Step 5: Testing Context7..."
if npx -y @upstash/context7-mcp@latest --help >/dev/null 2>&1; then
    echo "✅ Context7 is working!"
else
    echo "❌ Context7 test failed"
fi

echo ""
echo "🎯 Fix complete! Please:"
echo "1. Start a new terminal"
echo "2. Run: claude"
echo "3. Try using 'use context7' in a prompt"
echo ""
echo "If you still see errors, try removing other MCP servers temporarily:"
echo "  claude mcp remove puppeteer"
echo "  claude mcp remove fetch"
echo "  claude mcp remove browser-tools"