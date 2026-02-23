---
description: 設計ドキュメントをもとに4エージェントでNext.jsプロトタイプを実装する（Phase 2）
allowed-tools: Read, Glob, Grep, Task, Write, Edit, Bash
disable-model-invocation: true
---

# Phase 2: プロトタイプ実装 エージェントチーム

あなたはPhase 2のプロトタイプ実装を管理するオーケストレーターです。
4つのエージェントが協働し、docs/02_design/ の設計ドキュメントをもとに動作するプロトタイプを実装します。

ユーザーからの引数: $ARGUMENTS

---

## 前提条件チェック

**作業開始前に**以下を確認してください。未完了の場合はユーザーに案内して中断します。

1. docs/01_planning/ の全ファイルにTODOプレースホルダーがないこと
2. docs/02_design/bigquery-schema.md にテーブル・カラム定義があること
3. docs/02_design/api-spec.md にエンドポイント定義があること
4. docs/02_design/ui/wireframes/ 配下にワイヤーフレームファイルがあること

Grepで `TODO` を docs/ 配下で検索し、残存件数を確認すること。
10件以上残っている場合は「Phase 1 が未完了です。先に /workflow-docs を実行してください」とユーザーに案内する。

---

## エージェントチーム構成と実行順序

### フェーズ2-A: data-agent を先行実行（他エージェントの前提）

#### data-agent — データ層実装担当

```
あなたはデータ層エージェント（data-agent）です。
docs/02_design/ の設計ドキュメントをもとに、BigQuery/Prismaのデータ層を実装してください。

まず以下を読み込む:
- docs/02_design/bigquery-schema.md
- docs/02_design/bigquery-etl-design.md
- docs/02_design/api-spec.md
- docs/01_planning/data-source-spec.md
- src/lib/bigquery-client.ts (現在の実装を確認)
- prisma/schema.prisma (現在のスキーマを確認)

実装するファイル:

1. src/lib/bigquery-client.ts の完成
   - executeQuery<T>() を維持（パラメータ化クエリを必須とする）
   - docs/02_design/bigquery-schema.md のテーブルに対応したクエリ関数を追加
   - 各クエリ関数には対応する型定義を src/types/index.ts に追加
   - 例: fetchKpiSummary(filters: DashboardFilters): Promise<KpiData[]>

2. prisma/schema.prisma の完成
   - docs/02_design/bigquery-schema.md と docs/02_design/auth-design.md をもとに
     Cloud SQL (PostgreSQL) 用のスキーマを定義
   - User, Session, AuditLog テーブルは最低限定義すること
   - Prisma Clientの型が src/types/index.ts と整合するよう注意

3. src/types/index.ts の完成
   - BigQueryクエリ結果の型定義
   - APIレスポンスの型定義
   - フィルター条件の型定義
   - docs/02_design/api-spec.md のレスポンス形式に対応すること

実装ルール:
- BigQueryへの書き込み禁止（読み取り専用）
- SQLインジェクション防止のためパラメータ化クエリ必須
- any型の使用禁止（unknown + 型ガードを使用）
- 関数30行以内
- CLAUDE.mdのセキュリティルールを厳守すること

テスト:
- 各BigQueryクエリ関数のユニットテストを tests/unit/lib/bigquery-client.test.ts に作成
- BigQueryはモックして実際のGCP接続は不要
- Prismaモデルの型テストを tests/unit/lib/prisma.test.ts に作成
```

---

### フェーズ2-B: data-agent 完了後に並列実行

data-agentが src/types/index.ts と src/lib/bigquery-client.ts を完成させたら、
以下の **backend-agent** と **frontend-agent** を同時にTask toolで起動する。

---

#### backend-agent — API Route・ミドルウェア実装担当

```
あなたはバックエンドエージェント（backend-agent）です。
docs/02_design/api-spec.md をもとに、Next.js API Routeを実装してください。

まず以下を読み込む:
- docs/02_design/api-spec.md (全エンドポイント仕様)
- docs/02_design/auth-design.md (認証・認可設計)
- docs/02_design/permission-management.md (権限管理)
- src/lib/bigquery-client.ts (完成版)
- src/lib/auth.ts (現在の実装)
- src/lib/cache.ts (現在の実装)
- src/types/index.ts (完成版)
- .claudeops/prompts/patterns/api-endpoint.md (実装パターン)

実装するファイル:

1. src/lib/auth.ts の完成
   - NextAuth.js v5 の設定（Google OAuthプロバイダー）
   - セッション管理・JWTトークン設定
   - ロール（Admin/Editor/Viewer）の付与ロジック

2. src/lib/cache.ts の完成
   - BigQueryレスポンスのキャッシュ実装（インメモリ or Cloud Storage）
   - TTL設定（ダッシュボードデータ: 5分、KPIサマリー: 1時間）

3. src/app/api/ 配下のAPI Route実装
   api-spec.md のエンドポイントを全て実装:
   - GET /api/health → route.ts (既存を確認・補完)
   - GET /api/dashboards → route.ts
   - GET /api/dashboards/[id] → route.ts
   - GET /api/dashboards/[id]/data → route.ts (BigQueryクエリ呼び出し)
   - POST /api/dashboards/[id]/export → route.ts
   - GET /api/users → route.ts
   - POST /api/users → route.ts
   - PATCH /api/users/[id] → route.ts

   各API Routeで必須の実装:
   - Zod バリデーション（クエリパラメータ・リクエストボディ）
   - 認証ミドルウェア（未認証は401返却）
   - 認可チェック（権限不足は403返却）
   - RFC 7807準拠のエラーレスポンス
   - try-catchによるエラーハンドリング
   - BigQueryクエリはパラメータ化クエリのみ使用

実装ルール:
- .claudeops/prompts/patterns/api-endpoint.md のパターンに従うこと
- .claudeops/prompts/anti-patterns/common-mistakes.md の禁止事項を守ること
- CLAUDE.mdのセキュリティルールを厳守すること
- 関数30行以内、ネスト3段以内

テスト:
- 各API Routeの結合テストを tests/integration/ に作成
- 認証なしアクセス・権限不足アクセスのテストを含めること
- .claudeops/prompts/patterns/test-generation.md のパターンを参照すること
```

---

#### frontend-agent — UIコンポーネント・ページ実装担当

```
あなたはフロントエンドエージェント（frontend-agent）です。
docs/02_design/ui/ の仕様・ワイヤーフレームをもとに、Next.jsのUIを実装してください。

まず以下を読み込む:
- docs/02_design/dashboard-ui-spec.md
- docs/02_design/ui/design-system.md
- docs/02_design/ui/screen-list.md
- docs/02_design/ui/wireframes/ 配下の全ファイル
- docs/02_design/ui/components/selector-spec.md
- docs/02_design/ui/interactions/ 配下の全ファイル
- src/app/page.tsx (現在の実装)
- src/app/dashboard/page.tsx (現在の実装)

実装するファイル:

1. src/app/page.tsx — ホーム/ランディングページ
   - ログインへの誘導UI
   - requirements-functional.md のSCR-001仕様に準拠

2. src/app/dashboard/page.tsx — ダッシュボード一覧ページ

3. src/app/dashboard/[id]/page.tsx — ダッシュボード詳細ページ
   - KPIカード（4枚グリッド）
   - フィルターバー（日付範囲・カテゴリー等）
   - Rechartsチャート（折れ線・棒グラフ等）
   - ローディング/エラー/データ0件の各状態を全て実装

4. src/app/settings/page.tsx — 設定ページ
   - ユーザー管理（Admin権限のみ）

5. src/components/ 配下のコンポーネント
   - KpiCard.tsx — KPIカードコンポーネント
   - FilterBar.tsx — フィルターバーコンポーネント
   - DashboardChart.tsx — チャートラッパー（Recharts使用）
   - UserTable.tsx — ユーザー管理テーブル

実装ルール:
- docs/02_design/ui/wireframes/ のASCIIワイヤーフレームを忠実に実装すること
- docs/02_design/ui/design-system.md のカラー・フォント・余白に従うこと
- shadcn/ui の既存コンポーネントを最大限活用すること
- Rechartsで折れ線グラフ・棒グラフを実装すること
- TanStack Query でAPIデータ取得・キャッシュを行うこと
- Zustand でフィルター状態を管理すること
- 全画面で通常・ローディング・エラー・データ0件の4状態を実装すること
- CLAUDE.mdのUI実装ルールを厳守すること
- 1ファイル1コンポーネント・300行以内

テスト:
- 各コンポーネントのユニットテストを tests/unit/components/ に作成
- フィルター変更・データ表示の動作テストを含めること
```

---

### フェーズ2-C: backend-agent + frontend-agent 完了後（test-agent と security-agent を並列実行）

#### test-agent — E2Eテスト・カバレッジ確保担当

```
あなたはテストエージェント（test-agent）です。
実装されたプロトタイプのE2Eテストを作成し、カバレッジ80%以上を確保してください。

まず以下を読み込む:
- docs/03_test/test-strategy.md
- docs/03_test/test-cases.md
- playwright.config.ts
- tests/ 配下の既存テスト
- src/ 配下の実装済みファイル

実装するファイル:

1. tests/e2e/login.spec.ts
   - Google OAuthログインフロー（モック）
   - 未認証ユーザーのリダイレクト確認

2. tests/e2e/dashboard.spec.ts
   - ダッシュボード一覧の表示確認
   - ダッシュボード詳細の表示確認
   - KPIカード・チャートの表示確認

3. tests/e2e/filters.spec.ts
   - 日付フィルターの動作確認
   - カテゴリーフィルターの動作確認
   - フィルターURLパラメータ反映確認

4. tests/e2e/auth.spec.ts
   - Viewer権限での閲覧確認
   - Admin権限での管理機能確認
   - 権限不足時のエラー表示確認

5. カバレッジ確認
   - `npm run test:coverage` を実行して確認
   - 80%未満のファイルを特定し、追加ユニットテストを作成

テストルール:
- .claudeops/prompts/patterns/test-generation.md のパターンに従うこと
- テスト名は「〜の場合、〜となること」形式（日本語）
- 外部依存（BigQuery, Cloud SQL）はモックすること
- Arrange-Act-Assert 構造を維持すること
```

---

#### security-agent — OWASP Top 10 セキュリティ監査担当（初回実装後の一度だけ実施）

> **実施タイミングについて**
> このセキュリティ監査は**初回プロトタイプ実装完了時に一度だけ**実施します。
> 2回目以降のSTGへのpush（ステークホルダーフィードバックによる修正など）では、
> `.github/workflows/ci.yml` の GitHub Actions が自動でセキュリティスキャンを実施します：
> - **Semgrep**（SAST: コードの静的解析）
> - **Trivy**（SCA: 依存パッケージの脆弱性スキャン）
> - **Gitleaks**（シークレット漏洩検出）
>
> 次にClaude Codeによる手動OWASP監査が必要になるのは `/workflow-deploy-prod` の
> gate-agent（PROD直前）のみです。

```
あなたはセキュリティ監査エージェント（security-agent）です。
OWASP Top 10 および Claude Code Security のチェック項目に基づき、
初回実装済みのコードに対してセキュリティ監査を実施してください。

まず以下を読み込む:
- .claude/commands/security-audit.md（チェック基準の確認）
- CLAUDE.md（セキュリティルールの確認）
- src/ 配下の全TypeScriptファイル
- .claudeops/prompts/anti-patterns/common-mistakes.md

## OWASP Top 10 チェック項目

### A01: アクセス制御の不備
- src/app/api/ 配下の全 route.ts に認証ミドルウェアが適用されているか
- Admin/Editor/Viewer のロール別権限チェックが実装されているか
- 認証なしアクセスで401、権限不足で403が返るか（コードレビュー）

### A02: 暗号化の失敗
- 機密データ（パスワード・トークン）がコード内にハードコードされていないか
  Grep パターン: `(sk-|AIza|-----BEGIN|password\s*=\s*['"][^'"]+['"])`
- .env ファイルが src/ 配下にコミットされていないか
- Secret Manager 経由での秘匿情報参照になっているか

### A03: インジェクション
- BigQueryクエリが全てパラメータ化クエリ（QueryParameter）を使用しているか
  Grep パターン: `query\s*\+|query\s*\`.*\${` （文字列結合によるSQL構築）
- Prismaクエリでユーザー入力を直接埋め込んでいないか
- Zodスキーマによる入力バリデーションがAPI Routeに実装されているか

### A04: 安全でない設計
- APIレスポンスにスタックトレース・内部パス・DB構造が含まれていないか
  Grep パターン: `error\.stack|__dirname|process\.env` （エラーレスポンス内）
- エラーメッセージがユーザーに内部情報を漏洩していないか

### A05: セキュリティ設定のミス
- next.config.ts に CSP・CORS ヘッダーが設定されているか
- API Route に適切な Content-Type ヘッダーが返されているか
- 開発用デバッグコードが残っていないか（console.log のシークレット出力）
  Grep パターン: `console\.log.*(token|secret|password|key)`

### A06: 脆弱なコンポーネント
```bash
npm audit --audit-level=high
```
High/Critical の脆弱性があれば報告すること。

### A07: 認証・セッション管理の失敗
- NextAuth.js の設定で NEXTAUTH_SECRET が環境変数から読み込まれているか
- セッション有効期限が適切に設定されているか
- JWTトークンの検証ロジックに問題がないか

### A08: ソフトウェアとデータの整合性の失敗
- eval() / Function() コンストラクタの使用がないか
  Grep パターン: `\beval\s*\(|new\s+Function\s*\(`
- dangerouslySetInnerHTML の使用がないか
  Grep パターン: `dangerouslySetInnerHTML`

### A09: セキュリティログと監視の失敗
- 認証失敗・権限エラーが適切にログ出力されているか（Cloud Logging向け）
- 監査ログ（AuditLog）テーブルへの記録が実装されているか

### A10: サーバーサイドリクエストフォージェリ (SSRF)
- 外部URLへのfetchがユーザー入力から直接生成されていないか
  Grep パターン: `fetch\s*\(\s*(req\.|params\.|body\.)`

## 結果報告フォーマット

発見した問題を以下の重要度で分類して報告してください:

```
## セキュリティ監査結果（OWASP Top 10）

| 重要度 | 件数 |
|--------|------|
| 🔴 Critical | X件 |
| 🟠 High | X件 |
| 🟡 Medium | X件 |
| 🔵 Low | X件 |

### 発見した問題

#### 🔴 Critical
- [ファイル:行番号] 問題の説明 → 修正案

#### 🟠 High
- [ファイル:行番号] 問題の説明 → 修正案

（Medium/Low も同様）

### 判定
🟢 PASS: Critical/High の問題なし → Phase 2 完了可能
🔴 FAIL: Critical/High が X件あり → 修正後に再監査が必要
```

**Critical または High が1件でもある場合は「security-agent: FAIL」と報告し、
修正が完了するまで Phase 3 への進行を停止すること。**
```

---

## 完了確認

全4エージェントの作業完了後、以下を確認してください:

```bash
npm run lint        # ESLintエラーがないこと
npm run typecheck   # TypeScriptエラーがないこと
npm run test        # 全テストがパスすること
npm run test:coverage  # カバレッジ80%以上であること
npm run build       # ビルドが成功すること
```

全て成功したら、ユーザーに以下を案内してください:

```
## Phase 2 完了レポート

### 実装したファイル
[実装ファイルの一覧]

### テスト結果
- ユニットテスト: XX件 パス
- 統合テスト: XX件 パス
- E2Eテスト: XX件 パス
- カバレッジ: XX%

### ビルド結果
✅ ビルド成功

### セキュリティ監査結果（OWASP Top 10）
[security-agentの判定結果を記載]

### 以降のセキュリティスキャンについて
Phase 2完了後のSTGへのpushはGitHub ActionsのCIが自動でセキュリティチェックを実施します:
- Semgrep（SAST）/ Trivy（SCA）/ Gitleaks（シークレット検出）
- PRを作成するたびに自動実行されるため、手動での再実施は不要です
- 次にClaude Codeによる手動OWASP監査が必要になるのは /workflow-deploy-prod の直前のみです

### 次のステップ
STGデプロイに進む場合は以下を実行してください:
/workflow-deploy-stg "project_id=[GCPプロジェクトID] region=asia-northeast1"
```
