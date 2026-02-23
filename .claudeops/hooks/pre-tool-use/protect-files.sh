#!/bin/bash
# PreToolUse Hook: 保護ファイルへの書き込み警告
# Write/Edit ツールで重要ファイルを変更しようとした場合に確認を求める

TOOL_INPUT="$1"

# 保護対象ファイル一覧
PROTECTED_FILES=(
    "package-lock.json"
    ".env"
    ".env.local"
    ".env.production"
    "docker-compose.prod.yml"
    "CLAUDE.md"
    ".claude/settings.json"
    "cloudbuild.yaml"
    "terraform.tfvars"
)

# ファイルパスを抽出
FILE_PATH=$(echo "$TOOL_INPUT" | python3 -c "import sys,json; print(json.loads(sys.stdin.read()).get('file_path',''))" 2>/dev/null)

if [ -z "$FILE_PATH" ]; then
    exit 0
fi

for protected in "${PROTECTED_FILES[@]}"; do
    if [[ "$FILE_PATH" == *"$protected"* ]]; then
        echo "{\"decision\": \"ask\", \"message\": \"保護対象ファイル '$protected' を変更しようとしています。続行しますか？\"}"
        exit 0
    fi
done

# 保護対象でなければ許可
exit 0
