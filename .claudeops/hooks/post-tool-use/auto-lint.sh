#!/bin/bash
# PostToolUse Hook: ファイル変更後の自動Lint
# Write/Edit後に該当ファイルのリンターを実行する

TOOL_INPUT="$1"

# 変更されたファイルパスを抽出
FILE_PATH=$(echo "$TOOL_INPUT" | python3 -c "import sys,json; print(json.loads(sys.stdin.read()).get('file_path',''))" 2>/dev/null)

if [ -z "$FILE_PATH" ] || [ ! -f "$FILE_PATH" ]; then
    exit 0
fi

# 拡張子に応じたリンター実行
case "$FILE_PATH" in
    *.ts|*.tsx|*.js|*.jsx)
        RESULT=$(npx eslint "$FILE_PATH" 2>&1)
        if [ $? -ne 0 ]; then
            echo "{\"message\": \"Lintエラーを検出: $FILE_PATH\n修正してください。\n$RESULT\"}"
        fi
        ;;
    *.py)
        if command -v ruff &>/dev/null; then
            RESULT=$(ruff check "$FILE_PATH" 2>&1)
            if [ $? -ne 0 ]; then
                echo "{\"message\": \"Lintエラーを検出: $FILE_PATH\n修正してください。\n$RESULT\"}"
            fi
        fi
        ;;
    *.go)
        if command -v gofmt &>/dev/null; then
            gofmt -w "$FILE_PATH" 2>/dev/null
        fi
        ;;
esac

exit 0
