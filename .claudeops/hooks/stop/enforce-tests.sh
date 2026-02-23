#!/bin/bash
# Stop Hook: メインエージェント停止時にテスト強制実行
# コード変更がある場合、テストが通ることを確認する

cd "$CLAUDE_PROJECT_DIR" 2>/dev/null || exit 0

# package.jsonにtestスクリプトがあるか確認
if [ -f "package.json" ] && python3 -c "import json; d=json.load(open('package.json')); exit(0 if 'test' in d.get('scripts',{}) else 1)" 2>/dev/null; then
    # 変更されたファイルがあるか確認
    CHANGED=$(git diff --name-only HEAD 2>/dev/null | grep -E '\.(ts|tsx|js|jsx)$' | head -5)
    if [ -n "$CHANGED" ]; then
        OUTPUT=$(npm test 2>&1)
        if [ $? -ne 0 ]; then
            echo "{\"message\": \"テストが失敗しています。以下のテスト結果を確認して修正してください:\n$(echo "$OUTPUT" | tail -20)\"}"
        fi
    fi
fi

exit 0
