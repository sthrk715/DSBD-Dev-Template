# ブランチ戦略

## ブランチモデル（GitHub Flow拡張）

| ブランチ | 用途 | デプロイ先 | 保護 |
|---------|------|----------|------|
| `main` | 本番環境 | prod | 必須: PR + レビュー承認 |
| `staging` | ステージング環境 | stg | 必須: PR |
| `feature/*` | 機能開発 | - | - |
| `fix/*` | バグ修正 | - | - |
| `hotfix/*` | 緊急修正 | prod (直接) | 必須: レビュー承認 |

## ブランチフロー

```mermaid
gitgraph
    commit id: "init"
    branch staging
    branch feature/user-auth
    commit id: "feat: add auth"
    commit id: "test: add auth tests"
    checkout staging
    merge feature/user-auth id: "PR #1"
    checkout main
    merge staging id: "Release v1.0"
    branch hotfix/fix-login
    commit id: "fix: login bug"
    checkout main
    merge hotfix/fix-login id: "PR #2"
    checkout staging
    merge main id: "sync"
```

## マージルール

| ルール | 設定 |
|--------|------|
| PR必須 | 全ブランチ → main/staging |
| レビュー承認 | 最低1名（main: 2名推奨） |
| CIパス必須 | Lint + TypeCheck + Test |
| ブランチ最新化 | マージ前にbase branchを取り込み |
| スカッシュマージ | feature → staging: 推奨 |

## コミットメッセージ規約（Conventional Commits）

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type一覧
| Type | 説明 |
|------|------|
| feat | 新機能追加 |
| fix | バグ修正 |
| docs | ドキュメント変更 |
| style | コードスタイル変更（動作に影響なし） |
| refactor | リファクタリング |
| test | テスト追加・修正 |
| chore | ビルド・CI・設定変更 |
| perf | パフォーマンス改善 |

### AI生成コードのコミットメッセージ

```
feat(auth): JWT認証ミドルウェアを追加

Claude Codeを使用して初期実装を生成。
手動で以下を修正:
- トークン有効期限の検証ロジック追加
- エラーレスポンスフォーマット統一

Closes #123

Co-Authored-By: Claude Code <noreply@anthropic.com>
```

## Claude Codeによる自動PR作成のルール

- PRタイトル: Conventional Commits形式
- PR本文: 変更概要 + テスト結果 + チェックリスト
- `Closes #XX` でIssueと紐づけ
- AI利用の記録を含める
- Draft PRとして作成（レビュー前に人間が確認）
