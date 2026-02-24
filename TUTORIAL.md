# DSBD-Dev-Template チュートリアル
## Claude Code Prompt 完全ガイド

このドキュメントはテンプレートをプロジェクト開始から本番運用まで使い切るための、
**Claude Codeに実際に打ち込むPrompt集**です。

> **表記の見方**
> - `📋 コピーして打ち込む` → Claude Codeのチャットに貼り付けるPrompt
> - `🖥️ 自分でやる` → ターミナル・ブラウザ等で人間がやる操作
> - `⏳ 待つ` → Claude Codeが自律実行中（割り込まない）

---

## 事前準備チェックリスト

作業開始前に以下をローカルに準備しておく。

```
🖥️ 自分でやる（事前準備）

□ Node.js 22.x インストール済み（asdf / nvm 可）
□ Docker Desktop 起動済み
□ Google Cloud CLI インストール済み（gcloud auth login 完了）
□ GitHub CLI インストール済み（gh auth login 完了）
□ Terraform 1.9+ インストール済み
□ Claude Code インストール済み（claude コマンドで起動できる）
□ GCPプロジェクトを2つ作成済み（stg用・prod用）
```

---

## Step 0 ─ テンプレートをセットアップする

### 0-1. リポジトリを作成してClauseを起動する

```
🖥️ 自分でやる

# テンプレートから新リポジトリを作成
gh repo create <組織名>/<プロジェクト名> \
  --template DSBD-Dev-Template \
  --private \
  --clone

cd <プロジェクト名>

# Claude Code を起動
claude
```

### 0-2. 初回セットアップ＆現状確認を依頼する

```
📋 コピーして打ち込む

/workflow-kickoff
```

**Claude Codeがやること:**
- git remote の設定状況を確認
- GitHub Actions Secrets の設定手順を案内
- Slack Webhook の設定手順を案内
- docs/src/terraform/tests の完成度を4エージェントで並列評価
- フェーズ別の状態レポートを出力

**このあと自分でやること（Claude Codeの案内に従う）:**

```
🖥️ 自分でやる

# Claude Codeが出力した手順に従ってGitHubにpush
git push -u origin main
```

---

## Step 1 ─ ドキュメントを完成させる（Phase 1）

### 1-1. プロジェクト情報を渡してドキュメント生成を依頼する

以下のPromptを**自分のプロジェクトに合わせて書き換えて**打ち込む。

```
📋 コピーして打ち込む（★の箇所を書き換える）

/workflow-docs "プロジェクト名: ★売上分析ダッシュボード,
ビジネス目的: ★営業部門が日次・週次・月次の売上KPIをリアルタイムで確認できるようにする,
プロジェクト背景: ★現在Excelで行っている売上集計を自動化し意思決定スピードを向上させる,
想定ユーザー: ★営業マネージャー15名・営業担当100名,
KPI: ★月間売上・CVR・商談数・平均受注額・顧客獲得コスト,
データソース: ★BigQuery(analytics.sales_daily / analytics.deals / analytics.customers),
GCPプロジェクトID: ★my-company-dashboard,
GCPリージョン: asia-northeast1,
リリース予定日: ★2026-04-30,
ステークホルダー: ★PO: 山田部長 / 承認者: 田中CTO"
```

**⏳ 待つ（10〜20分）:** 4エージェントが並列でdocs/配下の全ファイルを記入する。

### 1-2. 生成されたドキュメントを確認してコミットする

```
📋 コピーして打ち込む

docs/配下の全ファイルに [要確認:] というマークがある箇所を教えてください。
一覧にして、私が回答すべき質問をまとめてください。
```

Claude Codeが質問を出してくるので、ターンで回答する。確認が終わったら：

```
📋 コピーして打ち込む

確認事項の回答をもとに docs/ を更新してください。
更新が終わったら、git add と commit まで実施してください。
コミットメッセージは Conventional Commits 形式でお願いします。
```

**このあと自分でやること:**

```
🖥️ 自分でやる

# GitHubにPRを作成してチームにドキュメントレビューを依頼
gh pr create \
  --title "docs: complete project documentation" \
  --body "Phase 1 ドキュメント完成。レビューをお願いします。" \
  --base main

# PRのURLをSlackに貼ってレビュー依頼
```

---

## Step 2 ─ プロトタイプを実装する（Phase 2）

### 2-1. ドキュメントのPRがマージされてから実装を依頼する

```
📋 コピーして打ち込む

/workflow-prototype
```

**⏳ 待つ（30〜60分）:** 4エージェントが順番に動く。
1. data-agent（BigQuery/Prisma/型定義）
2. backend-agent + frontend-agent（並列）
3. test-agent + security-agent（並列）

### 2-2. セキュリティ監査でHighが出た場合

```
📋 コピーして打ち込む

セキュリティ監査で報告された High の問題をすべて修正してください。
修正後、該当箇所だけ再度セキュリティチェックを実施して結果を報告してください。
```

### 2-3. 特定の画面だけ先に確認したい場合

```
📋 コピーして打ち込む

dashboard詳細ページ（src/app/dashboard/[id]/page.tsx）の実装が完了したら
npm run dev を起動して、ブラウザで確認すべき画面の一覧を教えてください。
```

### 2-4. 実装内容のコードレビューを依頼する

```
📋 コピーして打ち込む

/review src/app/api/
```

### 2-5. ローカルで動作確認してPRを作成する

```
📋 コピーして打ち込む

以下を順番に実行して、全て通過したらcommitとPR作成までやってください:
1. npm run lint
2. npm run typecheck
3. npm run test
4. npm run test:coverage
5. npm run build

PRのタイトルは "feat: implement sales dashboard MVP" で、
bodyにはテスト結果とカバレッジ、OWASP監査の結果を含めてください。
```

---

## Quick Deploy ─ 動作確認用のクイックデプロイ（任意）

Terraform/Cloud SQL/Google OAuthを設定せずに、モックデータで素早くCloud Runにデプロイして動作確認できます。

### 前提条件

```
🖥️ 自分でやる

# GCPプロジェクトを選択
gcloud config set project ★your-gcp-project-id

# 必要なAPIを有効化（Cloud Run + Artifact Registry + Cloud Build）
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com
```

### デプロイ実行

```
🖥️ 自分でやる

# ソースベースデプロイ（Docker buildはCloud Build上で実行される）
gcloud run deploy dsbd-web \
  --source . \
  --region asia-northeast1 \
  --allow-unauthenticated \
  --set-env-vars="SKIP_AUTH=true,NODE_ENV=production"
```

- `SKIP_AUTH=true`: NextAuth認証をバイパス（Google OAuth不要）
- モックデータサービスが自動的に使用される（DATABASE_URL未設定時）
- デプロイ後のURLで全9タブのダッシュボードが確認可能

> **注意**: このデプロイは認証なしの公開URLになります。デモ確認後は削除するか、本番用のSTGデプロイに移行してください。

### テンプレートに含まれるデプロイ用ファイル

| ファイル | 用途 |
|---------|------|
| `Dockerfile` | Multi-stage build（deps → builder → runner） |
| `.dockerignore` | Cloud Buildへのアップロード除外（node_modules等） |
| `.gcloudignore` | `gcloud run deploy --source` 時のアップロード除外 |
| `.npmrc` | npm設定（peer dep衝突時の設定を記載する場所） |
| `public/.gitkeep` | Next.js standalone buildに必要な空publicディレクトリ |
| `cloudbuild.yaml` | CI/CD用パイプライン（Secret Manager連携あり） |

---

## Step 3 ─ STG環境にデプロイする（Phase 3）

### 3-1. GCPの事前設定（デプロイの前に自分でやる）

```
🖥️ 自分でやる

# STGプロジェクトを設定
gcloud config set project ★my-company-dashboard-stg

# Terraform用のGCSバケットを作成（Stateファイル保存先）
gcloud storage buckets create gs://★my-company-dashboard-stg-terraform-state \
  --location=asia-northeast1

# 必要なAPIを有効化
gcloud services enable \
  run.googleapis.com \
  sql-component.googleapis.com \
  sqladmin.googleapis.com \
  bigquery.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com
```

### 3-2. STGデプロイを依頼する

```
📋 コピーして打ち込む（★の箇所を書き換える）

/workflow-deploy-stg "project_id=★my-company-dashboard-stg region=asia-northeast1"
```

**⏳ 待つ:** infra-agent が terraform plan を実行し、確認を求めてくる。

```
📋 terraform applyの確認が来たら打ち込む

はい、applyしてください。
```

**⏳ さらに待つ（15〜30分）:** Cloud Run・Cloud SQL・BigQueryが作成される。

### 3-3. Secret Managerにシークレットを登録する（Claude Codeの案内に従う）

```
🖥️ 自分でやる（Claude Codeが案内したコマンドを実行）

# 例: NextAuth シークレット
echo -n "$(openssl rand -base64 32)" | \
  gcloud secrets create NEXTAUTH_SECRET_STG \
    --data-file=- \
    --project=★my-company-dashboard-stg

# 例: Google OAuth クライアントID（GCPコンソールで取得した値）
echo -n "★your-client-id.apps.googleusercontent.com" | \
  gcloud secrets create GOOGLE_CLIENT_ID_STG \
    --data-file=- \
    --project=★my-company-dashboard-stg
```

### 3-4. デプロイ後に GitHub Actions を有効化する

```
🖥️ 自分でやる

# Workload Identity Federation を設定（初回のみ）
# → GCPコンソール: IAM > Workload Identity Federation > プールを作成

# GitHub Secrets に以下を設定
# → GitHubリポジトリ: Settings > Secrets and variables > Actions
# WIF_PROVIDER: projects/★123456789/locations/global/workloadIdentityPools/github-pool/providers/github
# WIF_SERVICE_ACCOUNT: github-actions@★my-company-dashboard-stg.iam.gserviceaccount.com
# STAGING_URL: ★https://dsbd-dev-stg-xxxx-an.a.run.app（terraform outputから取得）
```

```
📋 コピーして打ち込む

.github/workflows/ci.yml のGCP認証部分（コメントアウトされている箇所）を
有効化してコミットしてください。
```

### 3-5. STG環境をステークホルダーに共有する

```
🖥️ 自分でやる（Slackに貼る文面の例）

STG環境ができました！フィードバックをお願いします 🙏

🔗 URL: https://dsbd-dev-stg-xxxx-an.a.run.app
📅 確認期限: ★2026-03-15
📝 フィードバック方法: このスレッドに返信 or GitHub Issues

ログイン: Googleアカウント（会社のメール）でサインイン
```

---

## Step 4 ─ フィードバックを受けて修正する（反復フェーズ）

### 4-1. フィードバックをIssueに起票する

```
🖥️ 自分でやる（ステークホルダーのフィードバックごとにIssueを作成）

gh issue create \
  --title "KPIカードに前月比（MoM）を追加" \
  --body "売上KPIカードに前月比の数値と矢印を表示してほしい。

  **受入条件**
  - [ ] 前月比が % で表示される
  - [ ] 増加時は緑の上矢印、減少時は赤の下矢印が表示される
  - [ ] データがない場合は「-」が表示される" \
  --label "enhancement"
```

### 4-2. Issueを渡して修正を依頼する

```
📋 コピーして打ち込む（Issue番号を書き換える）

GitHub Issue #★12 の内容を実装してください。

実装前に docs/02_design/ui/wireframes/ と docs/02_design/dashboard-ui-spec.md を
確認してから着手してください。

実装後は /review と lint/typecheck/test を実行して、
全て通過したら feature/12-kpi-mom-display ブランチでcommitしてください。
```

### 4-3. 複数のIssueをまとめて対応する場合

```
📋 コピーして打ち込む

以下のIssueを優先度順に実装してください:
- #12: KPIカードに前月比（MoM）を追加
- #13: フィルターバーのカテゴリー順序を変更
- #14: ダッシュボード詳細のローディングスケルトンを改善

各Issueを1つのfeatureブランチにまとめず、それぞれ別のブランチで実装してください。
```

### 4-4. STGに再デプロイする

修正のPRがマージされたら：

```
📋 コピーして打ち込む

フィードバック修正分をSTGに再デプロイしてください。
project_id=★my-company-dashboard-stg region=asia-northeast1
```

このサイクル（Issue起票 → 修正依頼 → PR → 再デプロイ）を
**ステークホルダーのOKが出るまで繰り返す。**

---

## Step 5 ─ 本番環境にデプロイする（Phase 4）

### 5-1. PRODのGCP事前設定

```
🖥️ 自分でやる（STGと同様にPROD用GCPプロジェクトを設定）

gcloud config set project ★my-company-dashboard-prod

gcloud storage buckets create gs://★my-company-dashboard-prod-terraform-state \
  --location=asia-northeast1

gcloud services enable \
  run.googleapis.com \
  sql-component.googleapis.com \
  sqladmin.googleapis.com \
  bigquery.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com
```

### 5-2. ステークホルダーの承認を記録する

```
🖥️ 自分でやる

# SlackのスレッドにPO承認のメッセージを残しておく（記録として重要）
# 例:
# 「★山田部長より 2026-03-20 にSTG確認完了・本番リリースのGOをいただきました」
```

### 5-3. PRODデプロイを実行する（メンテナンス時間帯に実施）

```
📋 コピーして打ち込む

/workflow-deploy-prod
```

**確認の質問が5つ来るので全てYesで答える:**

```
📋 確認質問への回答

1. STG環境での全テストが通過しましたか？ → はい
2. ステークホルダー（PO）の承認を得ましたか？ → はい
3. docs/04_release/release-checklist.md の全項目を確認しましたか？ → はい
4. ロールバック手順を把握していますか？ → はい
5. デプロイ時間帯は適切ですか？ → はい
```

**⏳ 待つ:** gate-agent が OWASP Top 10 監査を自動実行。全通過したら：

```
📋 terraform applyの確認が来たら打ち込む

はい、PROD環境への適用を承認します。
```

### 5-4. リリース完了通知を出す

```
🖥️ 自分でやる（Slackに投稿）

🎉 本番リリース完了しました！

📦 プロダクト名: ★売上分析ダッシュボード
🔗 URL: ★https://dsbd-dev-prod-xxxx-an.a.run.app
📅 リリース日時: ★2026-03-21 02:00
📝 変更内容: [リリースノートのURL]

今後24時間はCloud Monitoringでアラートを監視します。
問題があれば #incident チャンネルへ。
```

---

## 運用フェーズ ─ 日常的なPrompt集

### バグ報告を受けた時

```
📋 コピーして打ち込む

以下のバグを調査して修正してください:

【症状】★日付フィルターで先月を選択すると売上グラフが表示されない
【再現手順】★1. ダッシュボード詳細を開く 2. 日付フィルターで「先月」を選択 3. 画面が空白になる
【発生環境】★本番環境 / Chrome最新版
【GitHub Issue】★#45

まず原因を調査してから、修正方針を私に説明してください。
承認後に実装に進んでください。
```

### 新機能を追加したい時

```
📋 コピーして打ち込む

GitHub Issue #★67「週次トレンドグラフの追加」を実装してください。

.claudeops/prompts/recipes/new-feature.md の手順に従い、
TDDサイクル（Red→Green→Refactor）で実装してください。

実装前に以下を確認すること:
- docs/02_design/api-spec.md（APIの追加が必要か）
- docs/02_design/ui/wireframes/dashboard-detail.md（UI配置）
- docs/02_design/bigquery-schema.md（クエリ設計）
```

### セキュリティ監査を実施したい時

```
📋 コピーして打ち込む

/security-audit src/
```

### コードレビューを依頼したい時

```
📋 コピーして打ち込む

/review src/app/api/dashboards/
```

### パフォーマンス問題を調査したい時

```
📋 コピーして打ち込む

ダッシュボード詳細ページ（/dashboard/[id]）のロードが遅いと報告を受けました。
以下を調査して改善案を提案してください:

1. src/app/api/dashboards/[id]/data/route.ts のBigQueryクエリを確認
2. src/app/dashboard/[id]/page.tsx のデータフェッチパターンを確認
3. src/lib/cache.ts のキャッシュ設定を確認

原因の仮説と改善案をまず説明してください。
```

### Cloud Monitoringのアラートが発火した時

```
📋 コピーして打ち込む

Cloud Monitoringでアラートが発火しました:
【アラート内容】★Cloud Run レイテンシ p95 > 3s
【発生時刻】★2026-03-22 14:30 JST

docs/05_operation/runbook.md の該当手順を確認して、
次に私がとるべきアクションを優先度順に教えてください。
```

### 依存パッケージを更新したい時

```
📋 コピーして打ち込む

npm audit の結果を確認して、High/Critical の脆弱性があるパッケージを
安全にアップデートしてください。

メジャーバージョンアップが必要な場合は、
先に変更の影響範囲を説明してから私の承認を得てください。
```

### データ設計の変更が必要になった時

```
📋 コピーして打ち込む

BigQueryに新しいテーブル analytics.★weekly_summary を追加する必要があります。
テーブルの仕様:

★カラム: date(DATE), channel(STRING), revenue(FLOAT64), orders(INT64)
★更新頻度: 毎週月曜 6:00 AM JST

以下のドキュメントとコードを更新してください:
1. docs/02_design/bigquery-schema.md
2. docs/01_planning/data-source-spec.md
3. src/lib/bigquery-client.ts（クエリ関数の追加）
4. src/types/index.ts（型定義の追加）
5. 対応するユニットテスト
```

---

## Prompt作成のコツ

### うまくいくPromptのパターン

```
# ✅ 良い例：目的・制約・確認ステップを明示する
Issue #12 の「KPIカードに前月比を追加」を実装してください。
実装前に docs/02_design/dashboard-ui-spec.md を必ず確認してください。
実装後は lint・typecheck・test を実行して、全て通過したら私に報告してください。
PRの作成は私が確認してからにしてください。

# ❌ 悪い例：丸投げで制約がない
KPIカードに前月比を追加して
```

### Claude Codeを止めたい時

```
📋 コピーして打ち込む

ちょっと待ってください。実装を始める前に、
[変更したい点・疑問点] を確認させてください。
```

### エラーが出て詰まった時

```
📋 コピーして打ち込む

以下のエラーが出て詰まっています:

エラーメッセージ:
★[エラー内容をここに貼る]

同じコマンドを繰り返さず、原因を分析してから
別のアプローチで解決策を提案してください。
```

### 作業を中断して再開する時

```
📋 コピーして打ち込む

前回の作業の続きです。
現在の状態を確認するために /workflow-kickoff を実行して、
どこまで完了しているかを教えてください。
```
