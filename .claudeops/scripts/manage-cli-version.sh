#!/bin/bash
# Claude Code CLI バージョン管理スクリプト
# チーム全員が同じバージョンを使用することを保証する

REQUIRED_VERSION_FILE=".tool-versions"

get_current_version() {
    claude --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+'
}

get_required_version() {
    grep '^claude-code' "$REQUIRED_VERSION_FILE" 2>/dev/null | awk '{print $2}'
}

check_version() {
    local current=$(get_current_version)
    local required=$(get_required_version)

    if [ -z "$current" ]; then
        echo "[ERROR] Claude Code CLI が見つかりません"
        echo "  インストール: curl -fsSL https://claude.ai/install.sh | bash"
        return 1
    fi

    if [ -z "$required" ]; then
        echo "[WARN] $REQUIRED_VERSION_FILE にバージョン指定がありません"
        echo "  現在のバージョン: $current"
        return 0
    fi

    if [ "$current" != "$required" ]; then
        echo "[WARN] Claude Code バージョン不一致"
        echo "  現在:   $current"
        echo "  要求:   $required"
        echo ""
        echo "  更新方法:"
        echo "    curl -fsSL https://claude.ai/install.sh | bash"
        echo "    または: brew upgrade claude-code"
        return 1
    fi

    echo "[OK] Claude Code バージョン: $current"
    return 0
}

check_latest() {
    local latest=$(gh api repos/anthropics/claude-code/releases/latest --jq '.tag_name' 2>/dev/null | sed 's/^v//')
    local current=$(get_current_version)

    if [ -z "$latest" ]; then
        echo "[WARN] 最新バージョンの確認に失敗しました"
        return 0
    fi

    if [ "$current" != "$latest" ]; then
        echo "[INFO] 新バージョンが利用可能: $latest (現在: $current)"
        echo "  リリースノート: https://github.com/anthropics/claude-code/releases"
    else
        echo "[OK] 最新バージョンを使用中: $current"
    fi
}

case "${1:-check}" in
    check)   check_version ;;
    latest)  check_latest ;;
    update)
        echo "更新方法:"
        echo "  curl -fsSL https://claude.ai/install.sh | bash"
        echo "  または: brew upgrade claude-code"
        ;;
    *)       echo "Usage: $0 {check|latest|update}" ;;
esac
