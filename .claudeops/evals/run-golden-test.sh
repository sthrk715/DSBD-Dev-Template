#!/bin/bash
# Golden Tests 実行スクリプト
# Claude Codeの出力品質を期待パターンで検証する

set -euo pipefail

TEST_DIR=".claudeops/evals/golden-tests"
RESULTS_FILE="/tmp/golden-test-results-$(date +%Y%m%d%H%M%S).txt"
PASS_COUNT=0
FAIL_COUNT=0

echo "=== Golden Tests Execution ==="
echo "Date: $(date -Iseconds)"
echo ""

if [ ! -d "$TEST_DIR" ] || [ -z "$(ls -A "$TEST_DIR" 2>/dev/null)" ]; then
    echo "No golden tests found in $TEST_DIR"
    echo "Create test directories with prompt.txt and expected-patterns.txt"
    exit 0
fi

for test_dir in "$TEST_DIR"/*/; do
    [ ! -d "$test_dir" ] && continue

    test_name=$(basename "$test_dir")
    prompt_file="$test_dir/prompt.txt"
    patterns_file="$test_dir/expected-patterns.txt"

    if [ ! -f "$prompt_file" ] || [ ! -f "$patterns_file" ]; then
        echo "SKIP [$test_name]: Missing prompt.txt or expected-patterns.txt"
        continue
    fi

    prompt=$(cat "$prompt_file")
    echo "Running: $test_name..."

    # Claude Codeヘッドレスモードで実行
    RESULT=$(claude -p "$prompt" \
        --output-format json --max-turns 5 \
        --allowedTools "Read,Grep,Glob,Write" 2>/dev/null | \
        python3 -c "import sys,json; print(json.loads(sys.stdin.read()).get('result',''))" 2>/dev/null || echo "")

    if [ -z "$RESULT" ]; then
        echo "FAIL [$test_name]: No output from Claude Code"
        FAIL_COUNT=$((FAIL_COUNT + 1))
        continue
    fi

    # 期待パターンの検証
    TEST_PASS=true
    while IFS= read -r criteria; do
        [ -z "$criteria" ] && continue
        [[ "$criteria" == \#* ]] && continue  # コメント行をスキップ

        if ! echo "$RESULT" | grep -qiE "$criteria"; then
            echo "FAIL [$test_name]: Missing pattern: $criteria"
            TEST_PASS=false
        fi
    done < "$patterns_file"

    if $TEST_PASS; then
        echo "PASS [$test_name]"
        PASS_COUNT=$((PASS_COUNT + 1))
    else
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
done

echo ""
echo "=== Results ==="
echo "PASS: $PASS_COUNT"
echo "FAIL: $FAIL_COUNT"
echo "TOTAL: $((PASS_COUNT + FAIL_COUNT))"

# 失敗がある場合は非ゼロで終了
[ "$FAIL_COUNT" -gt 0 ] && exit 1
exit 0
