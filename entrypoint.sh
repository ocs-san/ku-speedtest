#!/bin/bash
set -e

echo "🚀 KU Speed Test - Starting..."

# Generate servers.json from environment variable
SERVERS_FILE="/speedtest/servers.json"

if [ -n "$SPEEDTEST_SERVERS" ]; then
    echo "📝 Generating servers.json from SPEEDTEST_SERVERS environment variable..."
    
    # Validate JSON format
    if echo "$SPEEDTEST_SERVERS" | jq empty 2>/dev/null; then
        echo "$SPEEDTEST_SERVERS" > "$SERVERS_FILE"
        echo "✅ servers.json created successfully"
        echo "   Servers configured: $(echo "$SPEEDTEST_SERVERS" | jq '. | length')"
    else
        echo "❌ ERROR: Invalid JSON in SPEEDTEST_SERVERS"
        echo "⚠️  Using empty array (standalone mode)"
        echo "[]" > "$SERVERS_FILE"
    fi
else
    echo "ℹ️  No SPEEDTEST_SERVERS environment variable found"
    echo "   Using standalone mode (no backend servers)"
    echo "[]" > "$SERVERS_FILE"
fi

# Set proper permissions
chmod 644 "$SERVERS_FILE"
chown www-data:www-data "$SERVERS_FILE"

echo "🔒 Setting up security configurations..."

# Start Apache
echo "🌐 Starting Apache web server..."
exec apache2-foreground
