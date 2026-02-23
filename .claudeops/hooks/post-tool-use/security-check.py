#!/usr/bin/env python3
"""
PostToolUse Hook: Write/Edit後のセキュリティパターン検出
危険なコードパターンを検出してClaude Codeにフィードバックする。
"""
import sys
import json
import re

# 危険なパターンと警告メッセージ
DANGEROUS_PATTERNS = [
    (r'eval\(', 'eval()の使用は禁止です。代替手段を使用してください。'),
    (r'innerHTML\s*=', 'innerHTML直接代入はXSSリスクあり。textContentまたはDOMPurifyを使用してください。'),
    (r'document\.write', 'document.writeは禁止です。DOM操作APIを使用してください。'),
    (r'dangerouslySetInnerHTML', 'dangerouslySetInnerHTMLの使用は要注意。サニタイズ済みか確認してください。'),
    (r'SELECT.*\+.*FROM|WHERE.*\+', 'SQL文字列結合はSQLインジェクションリスクあり。パラメタライズドクエリを使用してください。'),
    (r'password\s*[:=]\s*["\'][^"\']{3,}', 'パスワードのハードコードを検出。環境変数またはSecret Managerを使用してください。'),
    (r'api[_-]?key\s*[:=]\s*["\'][^"\']{3,}', 'APIキーのハードコードを検出。環境変数またはSecret Managerを使用してください。'),
    (r'secret\s*[:=]\s*["\'][^"\']{3,}', 'シークレットのハードコードを検出。環境変数またはSecret Managerを使用してください。'),
    (r'token\s*[:=]\s*["\'][A-Za-z0-9_\-]{20,}', 'トークンのハードコードを検出。環境変数またはSecret Managerを使用してください。'),
    (r'Access-Control-Allow-Origin:\s*\*', 'CORSが過度に寛容です。許可するオリジンを限定してください。'),
    (r'new\s+Function\(', 'Function()コンストラクタの使用は危険です。代替手段を使用してください。'),
    (r'\.exec\s*\(', 'child_process.execの使用はコマンドインジェクションリスクあり。execFileを検討してください。'),
    (r'console\.(log|debug|info)\s*\(.*(?:password|secret|token|key)', 'ログに機密情報が含まれている可能性があります。'),
]


def check(tool_input_json: str) -> None:
    try:
        data = json.loads(tool_input_json)
        content = data.get("content", "") or data.get("new_string", "")

        if not content:
            return

        warnings = []
        for pattern, message in DANGEROUS_PATTERNS:
            if re.search(pattern, content, re.IGNORECASE):
                warnings.append(message)

        if warnings:
            feedback = {
                "message": "セキュリティ警告:\n" + "\n".join(f"- {w}" for w in warnings) +
                           "\n\n上記の問題を修正してください。"
            }
            print(json.dumps(feedback))

    except Exception:
        pass


if __name__ == "__main__":
    input_json = sys.argv[1] if len(sys.argv) > 1 else "{}"
    check(input_json)
