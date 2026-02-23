# AGENTS.md — エージェントチーム設計書

このファイルはDSBD-Dev-Templateの完成プロセスで使用するエージェントチームの役割・責務・協働ルールを定義します。

---

## 全体フロー

```
/workflow-kickoff    → 現在の完成度を評価し、次のステップをガイド
      ↓
/workflow-docs       → Phase 1: 全ドキュメントをAIとの対話で完成させる
      ↓
/workflow-prototype  → Phase 2: 完成したドキュメントをもとにプロトタイプを実装する
      ↓
/workflow-deploy-stg → Phase 3: GCP STG環境にデプロイする
      ↓
/workflow-deploy-prod → Phase 4: GCP PROD環境にデプロイする
```

---

## Phase 0: Kickoff Agent Team

**実行コマンド**: `/workflow-kickoff`

| エージェント名 | 役割 | 担当ファイル |
|--------------|------|------------|
| docs-assessor | ドキュメントの完成度評価 | docs/**/* |
| code-assessor | コードの実装状況評価 | src/**/* |
| infra-assessor | インフラ設定の評価 | terraform/**, cloudbuild.yaml |
| test-assessor | テストの実装状況評価 | tests/**/* |

**出力**: フェーズ別完成度レポート + 推奨実行順序

---

## Phase 1: Document Completion Agent Team

**実行コマンド**: `/workflow-docs "プロジェクト名: XXX, ビジネス概要: XXX, GCPプロジェクトID: XXX, データソース: XXX"`

| エージェント名 | 役割 | 担当ドキュメント |
|--------------|------|----------------|
| pm-agent | 要件・計画ドキュメントの完成 | docs/01_planning/*.md |
| architect-agent | 技術設計ドキュメントの完成 | docs/02_design/architecture.md, api-spec.md, bigquery-*.md |
| ui-agent | UI仕様・設計の完成 | docs/02_design/dashboard-ui-spec.md, ui/* |
| ops-agent | テスト・リリース・運用ドキュメントの完成 | docs/03_test/*, docs/04_release/*, docs/05_operation/*, docs/06_lifecycle/* |

**並列実行**: pm-agent と ops-agent は同時実行可能。architect-agent と ui-agent は pm-agent 完了後に実行。

**入力として必要な情報**:
- プロジェクト名・目的
- ビジネス背景（なぜこのダッシュボードが必要か）
- 想定ユーザーと規模
- 可視化したいKPI・指標
- データソース（BigQueryのデータセット名・テーブル名）
- GCPプロジェクトID・リージョン
- リリース予定日

---

## Phase 2: Prototype Build Agent Team

**実行コマンド**: `/workflow-prototype`

| エージェント名 | 役割 | 担当ファイル |
|--------------|------|------------|
| frontend-agent | UIコンポーネント・ページの実装 | src/app/**, src/components/** |
| backend-agent | API Route・ミドルウェアの実装 | src/app/api/**, src/lib/auth.ts, src/lib/cache.ts |
| data-agent | BigQuery/Prismaデータ層の実装 | src/lib/bigquery-client.ts, prisma/schema.prisma |
| test-agent | Unit/Integration/E2Eテストの実装 | tests/**/* |

**実行順序**:
1. data-agent（データ層が他エージェントの前提）
2. backend-agent + frontend-agent（並列可能）
3. test-agent + security-agent（並列可能・両方の完了が必要）

**セキュリティゲート**: security-agent で OWASP Top 10 の Critical/High が検出された場合、Phase 3 への進行を停止する
**以降のSTG反復時**: GitHub Actions（Semgrep/Trivy/Gitleaks）が PR/push 毎に自動スキャン。手動 OWASP 監査は PROD 直前（gate-agent）のみ実施

**前提条件**: Phase 1 のドキュメントが完成していること（特に docs/02_design/ の全ファイル）

---

## Phase 3: STG Deploy Agent Team

**実行コマンド**: `/workflow-deploy-stg "project_id=XXX region=asia-northeast1 env=stg"`

| エージェント名 | 役割 | 担当領域 |
|--------------|------|---------|
| infra-agent | Terraform設定・STG環境プロビジョニング | terraform/**, terraform.tfvars |
| ci-agent | Cloud Build・Artifact Registry設定確認 | cloudbuild.yaml, Dockerfile |
| verify-agent | デプロイ後の動作確認 | /api/health, 主要画面 |

**実行順序**:
1. infra-agent（terraform plan → apply）
2. ci-agent（Cloud Build実行）
3. verify-agent（デプロイ後検証）

**必要な権限**:
- `roles/run.admin`
- `roles/cloudsql.admin`
- `roles/bigquery.admin`
- `roles/iam.serviceAccountAdmin`
- `roles/secretmanager.admin`

---

## Phase 4: PROD Deploy Agent Team

**実行コマンド**: `/workflow-deploy-prod`

| エージェント名 | 役割 | 担当領域 |
|--------------|------|---------|
| gate-agent | リリース前チェックリスト実行 | テスト結果, セキュリティ監査 |
| prod-deploy-agent | PROD環境へのデプロイ実行 | terraform, Cloud Build |
| monitor-agent | 監視・アラート設定の確認 | Cloud Monitoring, docs/05_operation/ |

**実行順序**:
1. gate-agent（全チェックリストが通過してからのみ継続）
2. prod-deploy-agent
3. monitor-agent

**ゲート条件**（全て満たすこと）:
- STG環境での全テスト通過
- セキュリティ監査 (/security-audit) 通過
- カバレッジ 80% 以上
- ステークホルダーの承認記録あり

---

## エージェント協働ルール

1. **読み取り専用が原則**: 評価エージェントはファイルを読むのみ。書き込みは担当エージェントのみ行う
2. **ドキュメント→コード→インフラの順**: 前フェーズのドキュメントが完成してから次フェーズを開始する
3. **CLAUDE.mdのルールに従う**: 全エージェントはCLAUDE.mdのコーディング規約・セキュリティルールを遵守する
4. **不明点はIssueに記録**: エージェントが判断できない事項はユーザーに質問し、判明した情報をdocsに記録する
5. **テストファースト**: backend-agent/data-agentはTDDサイクル（Red→Green→Refactor）を厳守する

---

## スキルの使い方 クイックリファレンス

```bash
# 現在の状態を確認
/workflow-kickoff

# Phase 1: ドキュメント完成（プロジェクト情報を引数で渡す）
/workflow-docs "プロジェクト名: 売上ダッシュボード, GCPプロジェクトID: my-project-123, データソース: analytics.sales_daily"

# Phase 2: プロトタイプ実装
/workflow-prototype

# Phase 3: STGデプロイ
/workflow-deploy-stg "project_id=my-project-123 region=asia-northeast1"

# Phase 4: PRODデプロイ
/workflow-deploy-prod
```
