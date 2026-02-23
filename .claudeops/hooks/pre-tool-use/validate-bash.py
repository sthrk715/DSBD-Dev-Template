#!/usr/bin/env python3
"""
PreToolUse Hook: Bashコマンド実行前のセキュリティチェック
危険なコマンドをブロックし、本番環境操作を警告する。
"""
import sys
import json
import re

# ブロック対象のコマンドパターン
BLOCKED_PATTERNS = [
    (r"rm\s+-rf\s+/", "ルートディレクトリの再帰削除"),
    (r"rm\s+-rf\s+~", "ホームディレクトリの再帰削除"),
    (r"git\s+push\s+--force", "強制プッシュ"),
    (r"git\s+reset\s+--hard", "ハードリセット"),
    (r"git\s+clean\s+-f", "未追跡ファイルの強制削除"),
    (r"DROP\s+TABLE", "テーブル削除"),
    (r"DROP\s+DATABASE", "データベース削除"),
    (r"TRUNCATE\s+TABLE", "テーブルデータ全削除"),
    (r"--no-verify", "Git hookバイパス"),
    (r"chmod\s+-R\s+777", "過度に寛容なパーミッション"),
    (r"curl.*\|\s*bash", "リモートスクリプトの直接実行"),
    (r"wget.*\|\s*sh", "リモートスクリプトの直接実行"),
    (r"eval\s+\$\(", "動的コマンド評価"),
    (r"dd\s+if=", "ディスク直接操作"),
    (r"mkfs", "ファイルシステムフォーマット"),
    (r":\(\)\{\s*:\|:&\s*\};:", "フォーク爆弾"),
    (r"npm\s+publish", "パッケージ公開"),
    (r"terraform\s+destroy", "インフラ破壊"),
]

# 本番環境操作の警告パターン
WARN_PATTERNS = [
    (r"(production|prod)", "本番環境への操作の可能性あり"),
    (r"terraform\s+apply", "Terraformの適用操作"),
    (r"gcloud\s+run\s+deploy", "Cloud Runへのデプロイ"),
    (r"prisma\s+migrate\s+deploy", "本番DBマイグレーション"),
]


def validate(tool_input_json: str) -> dict:
    try:
        data = json.loads(tool_input_json)
        command = data.get("command", "")

        # ブロック判定
        for pattern, description in BLOCKED_PATTERNS:
            if re.search(pattern, command, re.IGNORECASE):
                return {
                    "decision": "block",
                    "reason": f"危険なコマンドを検出: {description}\nコマンド: {command}"
                }

        # 警告判定
        for pattern, description in WARN_PATTERNS:
            if re.search(pattern, command, re.IGNORECASE):
                return {
                    "decision": "ask",
                    "message": f"{description}。確認してください。\nコマンド: {command}"
                }

        return {"decision": "allow"}

    except Exception as e:
        return {"decision": "block", "reason": f"入力解析エラー: {str(e)}"}


if __name__ == "__main__":
    # $CLAUDE_TOOL_INPUT が空文字で渡される場合も "{}" にフォールバック
    raw = sys.argv[1] if len(sys.argv) > 1 else ""
    input_json = raw.strip() if raw.strip() else "{}"
    result = validate(input_json)
    print(json.dumps(result))
