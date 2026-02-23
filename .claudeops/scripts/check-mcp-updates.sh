#!/bin/bash
# MCPサーバーの更新確認スクリプト
# レジストリに登録されたMCPサーバーの最新バージョンを確認する

REGISTRY=".claudeops/mcp/mcp-registry.json"

if [ ! -f "$REGISTRY" ]; then
    echo "[ERROR] MCPレジストリが見つかりません: $REGISTRY"
    exit 1
fi

echo "=== MCP Server Update Check ==="
echo "Date: $(date -Iseconds)"
echo ""

python3 -c "
import json, subprocess, sys

with open('$REGISTRY') as f:
    registry = json.load(f)

for name, config in registry.get('mcpServers', {}).items():
    package = config.get('package', '')
    current = config.get('version', 'unknown')
    last_verified = config.get('lastVerified', 'unknown')

    try:
        result = subprocess.run(
            ['npm', 'view', package, 'version'],
            capture_output=True, text=True, timeout=10
        )
        latest = result.stdout.strip()
    except Exception:
        latest = None

    if not latest:
        print(f'[{name}] WARN: {package} の最新バージョン取得に失敗')
        continue

    if current == latest:
        print(f'[{name}] OK: {current} (最新)')
    else:
        print(f'[{name}] UPDATE: {current} -> {latest}')
        print(f'  パッケージ: {package}')
        print(f'  最終検証日: {last_verified}')
        print(f'  npm: https://www.npmjs.com/package/{package}')
    print()
"
