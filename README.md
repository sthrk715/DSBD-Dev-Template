# DSBD-Dev-Template

EC統合ダッシュボードを素早く立ち上げるための **Next.js + GCP テンプレート**。
複数ECチャネル（Shopify自社EC、Amazon、楽天市場、Yahoo!ショッピング）の売上・顧客・サブスク・ギフト・メルマガ等のKPIを横断的に可視化します。

## Demo

https://dsbd-template-mh7iiczq2a-an.a.run.app/dashboard

## 特徴

- **9タブのダッシュボード** — エグゼクティブサマリ / チャネル別 / サブスク / 顧客 / アクセス・CVR / ギフト / 商品カテゴリ / メルマガ / 時系列比較
- **100+ UIコンポーネント** — shadcn/ui ベース、ダッシュボード専用チャート（ECharts）、フィルタバー、データテーブル
- **認証・権限管理** — NextAuth.js v5 (Google OAuth) + ADMIN/VIEWER ロール
- **API層** — 9ダッシュボードAPI + 管理API + CSVエクスポート、Zodバリデーション
- **モックデータサービス** — DB不要で即動作。BigQuery実装に差し替え可能
- **GCPデプロイ対応** — Dockerfile / Cloud Build / Terraform（Cloud Run + Cloud SQL + BigQuery）
- **Claude Code対応** — AGENTS.md によるワークフロー自動化、CLAUDE.md によるコーディング規約

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 15 (App Router) + TypeScript |
| UI | shadcn/ui + Tailwind CSS 4 + Radix UI |
| チャート | Apache ECharts (echarts-for-react) |
| 状態管理 | Zustand (クライアント) + TanStack Query (サーバー) |
| 認証 | NextAuth.js v5 (Google OAuth 2.0) |
| ORM | Prisma 6 + PostgreSQL |
| バリデーション | Zod |
| テスト | Vitest + Playwright |
| インフラ | GCP Cloud Run + Terraform |

## クイックスタート

### ローカル開発

```bash
# テンプレートからリポジトリを作成
gh repo create <org>/<project> --template DSBD-Dev-Template --private --clone
cd <project>

# 依存関係のインストール
npm install

# ローカルDB起動（Docker必須）
docker compose up -d

# Prismaセットアップ
npx prisma migrate dev

# 開発サーバー起動
npm run dev
```

http://localhost:3000/dashboard でダッシュボードが表示されます。
`SKIP_AUTH=true` を `.env.local` に設定すると認証をバイパスできます。

### GCPクイックデプロイ

Terraform/Cloud SQL/Google OAuth不要で、モックデータで素早くCloud Runにデプロイできます。

```bash
# GCPプロジェクトを設定
gcloud config set project <your-project-id>

# 必要なAPIを有効化
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com

# デプロイ
gcloud run deploy dsbd-web \
  --source . \
  --region asia-northeast1 \
  --allow-unauthenticated \
  --set-env-vars="SKIP_AUTH=true,NODE_ENV=production"
```

## プロジェクト構造

```
DSBD-Dev-Template/
├── src/
│   ├── app/
│   │   ├── dashboard/          # 9タブのダッシュボードページ
│   │   │   ├── page.tsx        #   エグゼクティブサマリ
│   │   │   ├── channels/       #   チャネル別詳細
│   │   │   ├── subscription/   #   サブスク分析
│   │   │   ├── customers/      #   顧客分析
│   │   │   ├── access/         #   アクセス・CVR分析
│   │   │   ├── gift/           #   ギフト売上
│   │   │   ├── products/       #   商品カテゴリ別売上
│   │   │   ├── email/          #   メルマガ分析
│   │   │   └── timeseries/     #   時系列比較
│   │   ├── api/
│   │   │   ├── dashboard/      # ダッシュボードAPI (9エンドポイント)
│   │   │   ├── admin/          # 管理API (ユーザー/イベント/ターゲット)
│   │   │   ├── export/         # CSVエクスポート
│   │   │   ├── auth/           # NextAuthハンドラー
│   │   │   └── health/         # ヘルスチェック
│   │   ├── login/              # ログインページ
│   │   └── settings/           # 設定ページ (ユーザー管理/プロフィール)
│   ├── components/
│   │   ├── dashboard/          # ダッシュボード専用コンポーネント
│   │   │   └── charts/         # EChartsラッパー (Bar/Line/Area/Donut等)
│   │   ├── ui/                 # shadcn/ui コンポーネント
│   │   ├── molecules/          # フィルタ/セレクタ等
│   │   └── forms/              # フォームコンポーネント
│   ├── hooks/                  # TanStack Queryフック (タブ別データ取得)
│   ├── stores/                 # Zustandストア (フィルタ状態)
│   └── lib/
│       ├── data-service/       # データサービス抽象化 (mock/BigQuery切替)
│       ├── auth.ts             # NextAuth設定
│       └── format.ts           # 数値フォーマッタ
├── prisma/                     # Prismaスキーマ/マイグレーション
├── terraform/                  # GCPインフラ (Cloud Run/SQL/BigQuery/IAM)
├── docs/                       # 設計ドキュメント (6カテゴリ)
├── Dockerfile                  # Multi-stage build (Cloud Run用)
├── cloudbuild.yaml             # Cloud Build CI/CDパイプライン
├── AGENTS.md                   # Claude Codeワークフロー定義
├── CLAUDE.md                   # コーディング規約
└── TUTORIAL.md                 # Claude Code Prompt完全ガイド
```

## コマンド

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | プロダクションビルド |
| `npm run lint` | ESLint実行 |
| `npm run typecheck` | TypeScript型チェック |
| `npm run test` | Vitest実行 |
| `npm run test:e2e` | Playwright E2Eテスト |
| `npm run test:coverage` | カバレッジ計測 |
| `npm run db:migrate:dev` | Prismaマイグレーション (開発) |
| `npm run db:studio` | Prisma Studio起動 |

## カスタマイズ

### ブランド変更

`src/lib/design-tokens.ts` の `APP_CONFIG` を編集：

```ts
export const APP_CONFIG = {
  name: 'あなたのダッシュボード名',
  shortName: 'ABC',
  description: 'あなたの会社名 ダッシュボード',
}
```

ログインページ: `src/app/login/page.tsx`
サイドバー: `src/components/app-sidebar.tsx`

### データソース切替

`src/lib/data-service/index.ts` で環境変数 `DATA_SOURCE` を設定：
- `mock` (デフォルト): モックデータ
- `bigquery`: BigQuery実データ (`src/lib/data-service/bigquery-service.ts` を実装)

### チャートカスタマイズ

EChartsベースのチャートコンポーネント:
- `src/components/dashboard/charts/BarChart.tsx`
- `src/components/dashboard/charts/LineChart.tsx`
- `src/components/dashboard/charts/AreaLineChart.tsx`
- `src/components/dashboard/charts/DonutChart.tsx`
- `src/components/dashboard/charts/StackedBarChart.tsx`
- `src/components/dashboard/charts/ComposedChart.tsx`

## Claude Code ワークフロー

このテンプレートは [Claude Code](https://claude.com/claude-code) によるAI駆動開発に最適化されています。

```bash
# 現在の状態を確認
/workflow-kickoff

# Phase 1: ドキュメント完成
/workflow-docs "プロジェクト名: ..., GCPプロジェクトID: ..., データソース: ..."

# Phase 2: プロトタイプ実装
/workflow-prototype

# Phase 3: STGデプロイ
/workflow-deploy-stg "project_id=... region=asia-northeast1"

# Phase 4: PRODデプロイ
/workflow-deploy-prod
```

詳細は [TUTORIAL.md](TUTORIAL.md) を参照。

## ドキュメント

| ディレクトリ | 内容 |
|-------------|------|
| `docs/01_planning/` | プロジェクト概要、要件定義、データソース仕様 |
| `docs/02_design/` | アーキテクチャ、API仕様、UI仕様、認証設計 |
| `docs/03_test/` | テスト計画 |
| `docs/04_release/` | リリースチェックリスト、ロールバック計画 |
| `docs/05_operation/` | 運用Runbook、監視設計 |
| `docs/06_lifecycle/` | CI/CD設計 |

## ライセンス

Private
