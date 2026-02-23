---
description: DSBD-Dev-Templateの現在の完成度を4エージェントで並列評価し、次に実行すべきフェーズをガイドする
allowed-tools: Read, Glob, Grep, Task, Bash
disable-model-invocation: true
---

# DSBD-Dev-Template 現在の完成度評価 & 実行計画ガイド

あなたはDSBD-Dev-Templateの完成プロセスを管理するコーディネーターです。
このスキルを実行することで、テンプレートの現在の完成状態を4つのエージェントで並列評価し、次に取るべきアクションをガイドします。

ユーザーからの引数: $ARGUMENTS

---

## ステップ0: 初期セットアップ確認（初回のみ）

評価エージェントを起動する前に、以下の初期セットアップが完了しているか確認してください。
**2回目以降の実行時はこのステップをスキップしてステップ1へ進む。**

### 0-1. GitHubリポジトリとremoteの確認

```bash
git remote -v
```

`origin` が設定されていない場合、ユーザーに以下を案内する:

```bash
# GitHub CLIでリポジトリを作成してremoteを設定する手順
gh repo create <組織名>/<リポジトリ名> --private
git remote add origin https://github.com/<組織名>/<リポジトリ名>.git
git push -u origin main
```

`origin` が設定済みであれば、リモートURLを確認してユーザーに表示する。

### 0-2. GitHub Actions Secrets の設定確認

`.github/workflows/ci.yml` を読み込み、TODOコメントでコメントアウトされているGCP認証ステップが存在することを確認する。

ユーザーに以下を案内する:

```
GitHub Actions を完全に動作させるには、リポジトリの
Settings → Secrets and variables → Actions に以下を設定してください:

【Secrets（機密）】
・WIF_PROVIDER
  Workload Identity Federation のプロバイダー名
  例: projects/123456789/locations/global/workloadIdentityPools/github-pool/providers/github

・WIF_SERVICE_ACCOUNT
  GitHub Actions 用サービスアカウントのメール
  例: github-actions@my-project.iam.gserviceaccount.com

【Variables（非機密）】
・STAGING_URL
  STGデプロイ後に設定する Cloud Run の URL
  例: https://dsbd-dev-stg-xxxx-an.a.run.app

※ WIF_PROVIDER・WIF_SERVICE_ACCOUNT は /workflow-deploy-stg で
  GCPインフラを構築した後に設定します。
  今はリポジトリ作成だけで問題ありません。
```

上記の案内を表示したら、GCP認証が設定済みかどうかをユーザーに確認し、
設定済みであれば ci.yml のコメントアウト部分を有効化するよう案内する:

```yaml
# .github/workflows/ci.yml の以下のコメントを外す
- name: Authenticate to Google Cloud
  uses: google-github-actions/auth@v2
  with:
    workload_identity_provider: ${{ secrets.WIF_PROVIDER }}
    service_account: ${{ secrets.WIF_SERVICE_ACCOUNT }}

- name: Build & Push Container
  run: |
    docker build -t ${{ env.REGION }}-docker.pkg.dev/...
    docker push ...
```

### 0-3. Slack通知の設定確認

`.claudeops/hooks/notification/slack-notify.sh` を読み込み、仕組みを確認する。

ユーザーに以下を案内する:

```
Claude Code の作業完了通知を Slack に送るには SLACK_WEBHOOK_URL を設定します。

【Slack側の手順】
1. Slack の App 管理ページ (https://api.slack.com/apps) を開く
2. 「Create New App」→「From scratch」
3. アプリ名を入力して対象ワークスペースを選択
4. 「Incoming Webhooks」を有効化
5. 「Add New Webhook to Workspace」で通知先チャンネルを選択
6. 生成された Webhook URL をコピー

【ローカル環境への設定手順】
~/.zshrc（または ~/.bashrc）に以下を追加:

  export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/XXX/YYY/ZZZ"

設定後:
  source ~/.zshrc

【確認方法】
  echo $SLACK_WEBHOOK_URL  # URLが表示されれば設定完了

設定しない場合は Slack 通知なしで動作します（エラーにはなりません）。
```

SLACK_WEBHOOK_URL が設定済みかどうかを確認して結果を表示する:

```bash
echo ${SLACK_WEBHOOK_URL:+"設定済み"} || echo "未設定（任意）"
```

### 0-4. セットアップ結果のサマリー表示

```
## 初期セットアップ状況

| 項目 | 状態 | 備考 |
|------|------|------|
| git remote (GitHub) | ✅設定済み / ❌未設定 | [URL] |
| GitHub Actions Secrets | ✅設定済み / ⏳GCPデプロイ後に設定 | |
| SLACK_WEBHOOK_URL | ✅設定済み / ➖未設定（任意） | |
```

---

## ステップ1: 評価エージェントチームを並列起動する

以下の4エージェントをTask toolで**同時並列**起動してください。

### Agent 1 — docs-assessor

```
あなたはドキュメント評価エージェントです。
/Users/hirokisato/AI-Driven-Dev/DSBD-Dev-Template/docs/ 配下の全マークダウンファイルを読み込み、完成度を評価してください。

各ファイルについて報告する項目:
- "TODO", "【記入", "TBD", "[TODO" などのプレースホルダーの件数
- 空のセクション・空のテーブル行の件数
- 完成度スコア（0=未着手 / 1=一部完成 / 2=完成）

評価対象ファイル（全ディレクトリを再帰的に確認）:
- docs/01_planning/ (5ファイル)
- docs/02_design/ (サブディレクトリ含む全ファイル)
- docs/03_test/ (2ファイル)
- docs/04_release/ (3ファイル)
- docs/05_operation/ (3ファイル)
- docs/06_lifecycle/ (4ファイル)

最後に全体のドキュメント完成率を 0-100% で算出し、未完成のファイル上位3件を特定してください。
```

### Agent 2 — code-assessor

```
あなたはコード評価エージェントです。
/Users/hirokisato/AI-Driven-Dev/DSBD-Dev-Template/src/ 配下の全TypeScriptファイルを読み込み、実装状況を評価してください。

各ファイルについて報告する項目:
- TODO / FIXME の件数と主な内容
- 未実装箇所（空関数・"throw new Error('Not implemented')"・モックreturn値など）
- TypeScriptのany型使用箇所

評価対象:
- src/app/ (ページ・APIルート)
- src/lib/ (クライアント・ユーティリティ)
- src/types/ (型定義)
- src/api/ (存在する場合)

最後に全体の実装率を 0-100% で算出し、最も実装が必要なファイル上位3件を特定してください。
```

### Agent 3 — infra-assessor

```
あなたはインフラ評価エージェントです。
/Users/hirokisato/AI-Driven-Dev/DSBD-Dev-Template/ のterraform関連ファイルとCI/CD設定を読み込み、デプロイ準備状況を評価してください。

確認対象:
- terraform/main.tf, variables.tf, outputs.tf
- terraform/terraform.tfvars.example（存在する場合）
- terraform/modules/ 配下の全main.tf
- cloudbuild.yaml
- .env.example
- Dockerfile

報告する項目:
1. terraform.tfvars (stg/prod用) が存在するか
2. 未設定の必須変数 (project_id, env など)
3. cloudbuild.yamlで参照している変数が設定済みか
4. Dockerfileのビルドに問題がないか
5. 現在の状態でSTGデプロイが可能か (Yes/No + 理由)
```

### Agent 4 — test-assessor

```
あなたはテスト評価エージェントです。
/Users/hirokisato/AI-Driven-Dev/DSBD-Dev-Template/tests/ 配下の全ファイルとvitest.config.ts, playwright.config.tsを読み込み、テスト状況を評価してください。

確認対象:
- tests/unit/ 配下の全ファイル
- tests/integration/ 配下の全ファイル
- tests/e2e/ 配下の全ファイル
- tests/setup.ts
- vitest.config.ts
- playwright.config.ts

報告する項目:
1. 各ファイルのテストケース数
2. スケルトンのみか実際のロジックが書かれているか
3. 80%カバレッジ達成の見込み (Yes/No)
4. E2Eテストの実装状況
```

---

## ステップ2: 結果を統合してレポートを生成する

4エージェントの結果を受け取ったら、以下のフォーマットで出力してください:

```
## 📊 DSBD-Dev-Template 現在の状態レポート
生成日時: [現在の日時]

### フェーズ別完成度

| フェーズ | 担当コマンド | 完成度 | ステータス |
|---------|-------------|--------|-----------|
| Phase 1: ドキュメント完成 | /workflow-docs | XX% | 🔴/🟡/🟢 |
| Phase 2: プロトタイプ実装 | /workflow-prototype | XX% | 🔴/🟡/🟢 |
| Phase 3: STGデプロイ | /workflow-deploy-stg | XX% | 🔴/🟡/🟢 |
| Phase 4: PRODデプロイ | /workflow-deploy-prod | XX% | 🔴/🟡/🟢 |

ステータス凡例: 🔴=未着手(0-30%) 🟡=進行中(31-79%) 🟢=完成(80-100%)

### 🚀 推奨実行順序と引数例

[未完成フェーズを優先度順に並べ、各フェーズの実行コマンドと必要な引数を具体的に示す]

例:
1. まず実行:
   /workflow-docs "プロジェクト名: [TODO], GCPプロジェクトID: [TODO], データソース: [TODO]"

2. 次に実行:
   /workflow-prototype

3. その後:
   /workflow-deploy-stg "project_id=[TODO] region=asia-northeast1"

4. 最後に:
   /workflow-deploy-prod

### ⚠️ 発見した問題・注意事項
[各エージェントが発見した問題点を優先度順にリスト]

### 📋 Phase 1 で特に記入が必要なファイル
[未完成ドキュメント上位3件]

### 💻 Phase 2 で実装が必要な主な箇所
[未実装コード上位3件]
```

---

## 備考

- このスキルは**読み取り専用**です。ファイルの変更は行いません
- ドキュメントの記入には `/workflow-docs` を使用してください
- コードの実装には `/workflow-prototype` を使用してください
- AGENTS.md にエージェントチームの全体設計が記載されています
