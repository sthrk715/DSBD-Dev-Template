#!/bin/bash
# CLAUDE.mdのトークン効率を分析するスクリプト

CLAUDE_MD="${1:-CLAUDE.md}"

if [ ! -f "$CLAUDE_MD" ]; then
    echo "ERROR: $CLAUDE_MD が見つかりません"
    exit 1
fi

CHARS=$(wc -c < "$CLAUDE_MD" | tr -d ' ')
LINES=$(wc -l < "$CLAUDE_MD" | tr -d ' ')
# 日英混在の概算: 約2文字/token
EST_TOKENS=$((CHARS / 2))

echo "=== CLAUDE.md トークン効率分析 ==="
echo "ファイル: $CLAUDE_MD"
echo "文字数: $CHARS"
echo "行数: $LINES"
echo "推定トークン数: ~$EST_TOKENS"
echo ""

# 推奨閾値チェック
if [ "$EST_TOKENS" -gt 4000 ]; then
    echo "[WARNING] CLAUDE.mdが大きすぎます (>4000 tokens)。圧縮を検討してください。"
elif [ "$EST_TOKENS" -gt 2000 ]; then
    echo "[INFO] CLAUDE.mdは中程度のサイズです (2000-4000 tokens)。増大に注意。"
else
    echo "[OK] CLAUDE.mdはコンパクトです (<2000 tokens)。"
fi
echo ""

# 冗長パターン検出
echo "--- 最適化ポイント ---"

VERBOSE=$(grep -nc "例えば\|たとえば\|具体的には\|すなわち\|つまり\|言い換えると" "$CLAUDE_MD" 2>/dev/null || echo 0)
if [ "$VERBOSE" -gt 0 ]; then
    echo "  冗長な説明表現: ${VERBOSE}箇所 → 簡潔化を検討"
fi

EMPHASIS=$(grep -nc "必ず\|絶対に\|常に\|決して" "$CLAUDE_MD" 2>/dev/null || echo 0)
echo "  強調表現: ${EMPHASIS}箇所（多すぎると効果が薄れる）"

SECTIONS=$(grep -c "^##" "$CLAUDE_MD" 2>/dev/null || echo 0)
echo "  セクション数: $SECTIONS"

echo ""
echo "--- 推奨事項 ---"
echo "  - 冗長な説明は箇条書きに変換"
echo "  - セクション数は10以下を推奨"
echo "  - 具体例は最小限に（Claude Codeは基本知識を持っている）"
echo "  - 外部ドキュメントへの参照を活用（内容を全て書かない）"
