# 新機能追加レシピ

## 手順

### Step 1: 要件確認
1. GitHub Issueの内容を確認
2. docs/01_planning/ の関連要件を確認
3. 不明点があればIssueにコメントして確認

### Step 2: 設計確認
1. docs/02_design/ の関連設計書を確認
2. UI実装の場合は docs/02_design/ui/ のワイヤーフレーム・デザインシステムを確認
3. API実装の場合は docs/02_design/api-spec.md を確認

### Step 3: ブランチ作成
```
git checkout -b feature/[issue番号]-[機能名]
```

### Step 4: TDD実装
1. **Red**: テストを先に書く（テスト失敗を確認）
2. **Green**: テストが通る最小限の実装
3. **Refactor**: コード品質の改善
4. **Verify**: 全テストがパスすることを確認

### Step 5: セルフレビュー
1. /review コマンドで自動レビュー
2. /security-audit コマンドでセキュリティ監査
3. 指摘事項を修正

### Step 6: PR作成
1. コミット（Conventional Commits形式）
2. PR作成（テンプレートに沿って記述）
3. Closes #XX でIssueと紐づけ

## チェックリスト
- [ ] 要件・設計の確認完了
- [ ] テスト作成（正常系/異常系/エッジケース）
- [ ] 実装完了
- [ ] リント・型チェック通過
- [ ] カバレッジ基準達成（80%以上）
- [ ] セキュリティ監査実施
- [ ] ドキュメント更新（必要に応じて）
