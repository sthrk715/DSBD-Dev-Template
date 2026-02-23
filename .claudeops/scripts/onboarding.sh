#!/bin/bash
# 新メンバーのClaude Code環境セットアップ

set -euo pipefail

echo "╔══════════════════════════════════════════╗"
echo "║   Claude Code Ops - Onboarding Setup     ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Step 1: Claude Code CLIの確認
echo "--- Step 1: Claude Code CLI ---"
if ! command -v claude &>/dev/null; then
    echo "Claude Code CLI が見つかりません。インストールしてください:"
    echo "  curl -fsSL https://claude.ai/install.sh | bash"
    echo "  または: brew install --cask claude-code"
else
    echo "Claude Code CLI: $(claude --version 2>/dev/null || echo 'バージョン不明')"
    bash .claudeops/scripts/manage-cli-version.sh check 2>/dev/null || true
fi
echo ""

# Step 2: 認証の確認
echo "--- Step 2: Authentication ---"
if [ -z "${ANTHROPIC_API_KEY:-}" ]; then
    echo "[WARN] ANTHROPIC_API_KEY が設定されていません"
    echo "  設定方法:"
    echo "    a) 環境変数: export ANTHROPIC_API_KEY=\"sk-ant-...\""
    echo "    b) ブラウザ認証: claude auth login"
else
    echo "[OK] ANTHROPIC_API_KEY が設定されています"
fi
echo ""

# Step 3: ローカル設定の作成
echo "--- Step 3: Local Settings ---"
if [ ! -f .claude/settings.local.json ]; then
    cat > .claude/settings.local.json << 'SETTINGS'
{
  "_comment": "個人設定 - Gitにコミットしない",
  "preferences": {
    "theme": "dark",
    "verbosity": "normal"
  }
}
SETTINGS
    echo "[OK] .claude/settings.local.json を作成しました"
else
    echo "[OK] ローカル設定は既に存在します"
fi
echo ""

# Step 4: Hooksの動作確認
echo "--- Step 4: Hooks ---"
for hook_dir in .claudeops/hooks/*/; do
    [ ! -d "$hook_dir" ] && continue
    hook_type=$(basename "$hook_dir")
    count=$(find "$hook_dir" -type f \( -name "*.sh" -o -name "*.py" \) 2>/dev/null | wc -l | tr -d ' ')
    echo "  $hook_type: $count hook(s)"
done
echo ""

# Step 5: MCPサーバーの確認
echo "--- Step 5: MCP Servers ---"
if [ -f .claudeops/mcp/mcp-registry.json ]; then
    python3 -c "
import json
with open('.claudeops/mcp/mcp-registry.json') as f:
    data = json.load(f)
for name, config in data.get('mcpServers', {}).items():
    print(f'  {name}: {config.get(\"package\", \"\")}@{config.get(\"version\", \"\")}')
" 2>/dev/null || echo "  レジストリの解析に失敗"
else
    echo "  MCPサーバーレジストリなし"
fi
echo ""

# Step 6: 必読ドキュメント
echo "--- Step 6: Required Reading ---"
echo "  1. CLAUDE.md                          - プロジェクト指示書"
echo "  2. docs/02_design/architecture.md     - システムアーキテクチャ"
echo "  3. docs/06_lifecycle/branching-strategy.md - ブランチ戦略"
echo "  4. .claudeops/prompts/                - 再利用プロンプト集"
echo ""

echo "╔══════════════════════════════════════════╗"
echo "║         Onboarding Complete!              ║"
echo "║   Run 'make claude-ops-check' to verify  ║"
echo "╚══════════════════════════════════════════╝"
