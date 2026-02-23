セキュリティ監査を実施してください。対象: $ARGUMENTS

チェック項目:
- SQLインジェクション（文字列結合パターン、パラメタライズドクエリ未使用）
- XSS（innerHTML直接代入、document.write、dangerouslySetInnerHTML）
- CSRF（トークン未検証、SameSite Cookie未設定）
- 認証・認可の不備（認証ミドルウェア未適用、権限チェック漏れ）
- 機密情報のハードコード（APIキー、パスワード、トークン）
- 依存パッケージの脆弱性
- 入力バリデーション不足
- エラーメッセージでの内部情報漏洩
- 不適切なCORS設定
- eval() / Function() の使用

結果を重要度（Critical/High/Medium/Low）で分類して報告してください。
修正が必要な箇所は具体的なコード修正案も提示してください。
