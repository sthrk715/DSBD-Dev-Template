---
description: プロジェクト情報をもとにdocs/配下の全ドキュメントを4エージェントで完成させる（Phase 1）
allowed-tools: Read, Glob, Grep, Task, Write, Edit
disable-model-invocation: true
---

# Phase 1: ドキュメント完成 エージェントチーム

あなたはPhase 1のドキュメント完成を管理するオーケストレーターです。
4つのエージェントが協働し、docs/配下の全ドキュメントをプロジェクト固有の情報で完成させます。

ユーザーからの引数 (プロジェクト情報): $ARGUMENTS

---

## 前提: ユーザーに情報を確認する

`$ARGUMENTS` が空または不十分な場合、**作業開始前に**以下の情報をユーザーに確認してください。
全て揃ってからエージェントを起動します。

```
ドキュメント完成に必要な情報を教えてください:

【必須】
1. プロジェクト名（例: 売上分析ダッシュボード）
2. ビジネス目的（例: 全社の売上・在庫・広告効果を一元可視化する）
3. プロジェクト背景（例: Excelレポートの集計工数削減と意思決定の迅速化）
4. 想定ユーザー（種別・人数: 例: 管理者10名、閲覧者100名）
5. 可視化したいKPI・指標（例: 月間売上、CVR、在庫回転率）
6. データソース（BigQueryデータセット・テーブル名: 例: analytics.sales_daily, analytics.inventory）
7. GCPプロジェクトID（例: my-company-dashboard-prod）
8. GCPリージョン（デフォルト: asia-northeast1）

【任意】
9. リリース予定日（YYYY-MM-DD）
10. ステークホルダー情報（PO名、承認者名）
11. 特記すべきセキュリティ・コンプライアンス要件
```

---

## エージェントチーム構成と実行順序

### フェーズ1-A: 同時並列実行（情報収集後すぐ）

**pm-agent** と **ops-agent** を同時にTask toolで起動する。

---

#### pm-agent — 要件・計画ドキュメント担当

```
あなたは要件定義・プロジェクト管理エージェント（pm-agent）です。
以下のプロジェクト情報をもとに、docs/01_planning/ 配下の全ファイルのTODOプレースホルダーを実際の内容で埋めてください。

プロジェクト情報: [ユーザーが提供した情報をここに全て転記]

担当ファイルと記入内容:

1. docs/01_planning/project-overview.md
   - プロジェクト名、目的、背景を記入
   - 想定ユーザー（種別・人数）を記入
   - 可視化対象KPIをテーブルに記入（KPI名、定義、データソース、更新頻度）
   - スケジュール・マイルストーンを具体的な日付で記入
   - ステークホルダー情報を記入

2. docs/01_planning/requirements-functional.md
   - 提供されたKPI・データソースをもとに、ダッシュボードの機能要件を具体化
   - 画面一覧のURLパターン・認証要件を確認し、プロジェクト固有の画面を追記
   - データ更新頻度をデータソース仕様に合わせて更新

3. docs/01_planning/requirements-non-functional.md
   - プロジェクト規模（ユーザー数）に合わせてパフォーマンス要件を調整
   - 特記セキュリティ要件があれば追記
   - SLA・可用性目標をプロジェクト実態に合わせて調整

4. docs/01_planning/data-source-spec.md
   - 提供されたデータソース情報をテーブルに記入（データソース名、種別、取得方法、頻度、機密性）
   - BigQueryのデータセット名・テーブル名を具体的に記入
   - PII・機密データの取り扱い方針を記入

5. docs/01_planning/prototype-spec.md
   - プロジェクト名を反映
   - KPIカード・チャート構成をrequirements-functional.mdの内容に合わせて具体化
   - 技術スタックの選定理由を CLAUDE.md の情報に基づいて記入

作業ルール:
- TODOプレースホルダーは全て削除し、実際の内容で置き換えること
- 不明な情報は [要確認: 内容] と明示してユーザーへの確認事項として残すこと
- 既存のドキュメント構造（テーブル・見出し）を維持すること
- ファイルは1つずつ順番に読んで、編集して保存すること
```

---

#### ops-agent — テスト・リリース・運用ドキュメント担当

```
あなたは運用・品質エージェント（ops-agent）です。
以下のプロジェクト情報をもとに、docs/03_test/, docs/04_release/, docs/05_operation/, docs/06_lifecycle/ 配下のドキュメントを完成させてください。

プロジェクト情報: [ユーザーが提供した情報をここに全て転記]
GCPプロジェクトID: [project_id]
GCPリージョン: [region]

担当ファイルと記入内容:

docs/03_test/:
- test-strategy.md: テスト戦略（Vitest単体/結合 + Playwright E2E）をプロジェクト規模に合わせて具体化
- test-cases.md: ダッシュボード機能の主要テストケースをリスト化

docs/04_release/:
- release-checklist.md: プロジェクト固有のリリースチェックリストを完成
- rollback-plan.md: Cloud Run + Cloud SQLのロールバック手順を具体化
- migration-guide.md: Prismaマイグレーション実行手順を記入

docs/05_operation/:
- monitoring-design.md: Cloud Monitoringのメトリクス設計（Cloud Run, BigQuery, Cloud SQL）
- alert-rules.md: レイテンシ・エラーレート・コスト上限のアラートルールを定義
- runbook.md: よくあるインシデント（高レイテンシ、DB接続エラー、BigQueryコスト超過）の対応手順

docs/06_lifecycle/:
- branching-strategy.md: Gitブランチ戦略（feature/→develop→staging→main）
- ci-cd-design.md: Cloud BuildのCI/CDパイプライン設計（cloudbuild.yamlに合わせて）
- issue-management.md: GitHub Issuesの運用ルール
- quality-gates.md: 各フェーズの品質ゲート条件（カバレッジ80%等）

作業ルール:
- TODOプレースホルダーは全て削除し、実際の内容で置き換えること
- GCPプロジェクトIDやリージョンが必要な箇所は提供された情報を使用すること
- 不明な情報は [要確認: 内容] と明示すること
```

---

### フェーズ1-B: pm-agent 完了後に並列実行

pm-agentが docs/01_planning/ の記入を完了したら、以下の2エージェントを同時に起動する。

---

#### architect-agent — 技術設計ドキュメント担当

```
あなたは技術アーキテクトエージェント（architect-agent）です。
docs/01_planning/ の完成したドキュメントを読み込み、docs/02_design/ の技術設計ドキュメントを完成させてください。

まず以下を読み込む:
- docs/01_planning/project-overview.md (完成版)
- docs/01_planning/requirements-functional.md (完成版)
- docs/01_planning/data-source-spec.md (完成版)

次に以下のファイルを完成させる:

1. docs/02_design/architecture.md
   - システム構成図のMermaid図にプロジェクト固有の要素（BigQueryデータセット名等）を反映
   - 環境別設定（dev/stg/prod）をプロジェクトのGCPプロジェクトIDで具体化
   - ADR（アーキテクチャ決定記録）セクションに主要な技術選定理由を記入

2. docs/02_design/api-spec.md
   - requirements-functional.md のKPI・機能に合わせてAPIエンドポイントを具体化
   - BigQueryクエリで取得するデータ構造をAPIレスポンスに反映
   - レート制限・認証要件をプロジェクト実態に合わせて設定

3. docs/02_design/bigquery-schema.md
   - data-source-spec.md のデータソース情報をもとにBigQueryのスキーマを定義
   - テーブル名・カラム名・型・説明を記入

4. docs/02_design/bigquery-etl-design.md
   - データソースからBigQueryへのETLパイプライン設計を記入
   - バッチ処理のスケジュール・依存関係を定義

5. docs/02_design/auth-design.md
   - NextAuth.js + Google OAuthの認証フローを具体化
   - RBAC（Admin/Editor/Viewer）の権限マトリクスを完成

6. docs/02_design/data-pipeline-design.md
   - BigQueryへのデータ取得パイプライン設計を完成

7. docs/02_design/permission-management.md
   - IAM・RBAC設計をプロジェクトのユーザー種別に合わせて完成

作業ルール:
- まず docs/01_planning/ のファイルを全て読んでから記入を開始すること
- テーブル名・カラム名は data-source-spec.md の内容と整合させること
- 既存のドキュメント構造を維持すること
```

---

#### ui-agent — UI仕様ドキュメント担当

```
あなたはUI/UXデザインエージェント（ui-agent）です。
docs/01_planning/ の完成したドキュメントを読み込み、docs/02_design/ui/ 配下のUI仕様ドキュメントを完成させてください。

まず以下を読み込む:
- docs/01_planning/requirements-functional.md (完成版)
- docs/01_planning/prototype-spec.md (完成版)

次に以下のファイルを完成させる:

1. docs/02_design/dashboard-ui-spec.md
   - KPIカードの表示仕様（指標名、単位、前期比表示等）を具体化
   - チャートの種類・軸・凡例の仕様を記入
   - フィルターバーの仕様（日付範囲、カテゴリー等）を要件から具体化

2. docs/02_design/ui/design-system.md
   - カラーパレット・フォントサイズ・余白の設計システムを記入
   - shadcn/ui + Tailwind CSS の使用コンポーネントリストを記入

3. docs/02_design/ui/screen-list.md
   - requirements-functional.md の画面一覧をもとに全画面のリストを完成
   - 各画面の目的・コンポーネント構成を記入

4. docs/02_design/ui/components/selector-spec.md
   - フィルターセレクターコンポーネントの仕様を記入
   - 日付ピッカー・マルチセレクト等の動作仕様を定義

5. docs/02_design/ui/interactions/filter-behavior.md
   - フィルター操作時のチャート更新動作を記入
   - URLパラメータへの反映方式を定義

6. docs/02_design/ui/interactions/drill-down.md
   - ドリルダウン動作の仕様（クリック→詳細表示のフロー）を記入

7. docs/02_design/ui/interactions/responsive.md
   - ブレークポイント設計・モバイル/タブレット対応方針を記入

8. docs/02_design/ui/wireframes/ 配下
   - 各画面のASCIIワイヤーフレームを作成（login.md, dashboard-list.md, dashboard-detail.md, settings.md）
   - これがプロトタイプ実装の参照元になるため、KPIカード・チャート・フィルターの配置を明確に示すこと

作業ルール:
- docs/02_design/ui/wireframes/ 配下に .md ファイルとしてASCIIワイヤーフレームを作成すること
- shadcn/ui のコンポーネント名（Card, Select, DatePicker等）を使用すること
- モバイル(375px)・タブレット(768px)・デスクトップ(1280px) の3ブレークポイントを考慮すること
```

---

## 完了確認

全4エージェントの作業完了後、以下を確認してください:

1. docs/ 配下の全ファイルで "TODO" の件数をGrepで確認
2. 残存するTODOがある場合、それが「要確認事項」として意図的に残されているか確認
3. ユーザーに最終確認を促す

```
## Phase 1 完了レポート

### 完成したファイル
[完成したファイルの一覧]

### 残存する要確認事項
[ユーザーへの確認が必要な項目のリスト]

### 次のステップ
Phase 2 のプロトタイプ実装に進む場合は以下を実行してください:
/workflow-prototype
```
