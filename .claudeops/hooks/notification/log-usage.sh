#!/bin/bash
# Notification Hook: セッション使用状況のJSONLログ記録
# Claude Codeの使用状況を記録し、メトリクス分析に活用する

SESSION_ID="${1:-unknown}"
TOOL_NAME="${2:-unknown}"
TIMESTAMP=$(date -Iseconds)
LOG_DIR=".claudeops/metrics/logs"
LOG_FILE="$LOG_DIR/usage-$(date +%Y-%m-%d).jsonl"

mkdir -p "$LOG_DIR"

# JSONLフォーマットでログ出力
python3 -c "
import json
print(json.dumps({
    'timestamp': '$TIMESTAMP',
    'session_id': '$SESSION_ID',
    'tool': '$TOOL_NAME',
    'user': '$(whoami)',
    'branch': '$(git branch --show-current 2>/dev/null || echo unknown)'
}))
" >> "$LOG_FILE" 2>/dev/null

exit 0
