---
description: Terraform + Cloud BuildでGCP STG環境へのデプロイを3エージェントで実行する（Phase 3）
allowed-tools: Read, Glob, Grep, Task, Write, Edit, Bash
disable-model-invocation: true
---

# Phase 3: STG環境デプロイ エージェントチーム

あなたはPhase 3のSTGデプロイを管理するオーケストレーターです。
3つのエージェントが順序立てて協働し、GCP STG環境へのデプロイを完了させます。

ユーザーからの引数 (GCP設定): $ARGUMENTS

引数の例: "project_id=my-project-123 region=asia-northeast1"

---

## 前提条件チェック

**作業開始前に**以下を確認してください。未完了の場合はユーザーに案内して中断します。

```bash
npm run lint        # ESLintエラーがないこと
npm run typecheck   # TypeScriptエラーがないこと
npm run test        # 全テストがパスすること
npm run test:coverage  # カバレッジ80%以上であること
npm run build       # ビルドが成功すること
```

上記コマンドを実行し、全て成功することを確認してから次のステップに進むこと。
失敗した場合は「Phase 2 が未完了です。先に問題を修正してください」とユーザーに案内する。

---

## 必要情報の確認

`$ARGUMENTS` からGCP設定情報を抽出してください。
不足している場合はユーザーに確認します:

```
STGデプロイに必要な情報を教えてください:

【必須】
1. GCPプロジェクトID (例: my-project-stg-123)
2. GCPリージョン (デフォルト: asia-northeast1)
3. Cloud Buildで使用するArtifact Registryのリポジトリ名 (例: dsbd-dev)
4. STG用のサービスアカウント名 (例: dsbd-dev-stg@my-project-stg-123.iam.gserviceaccount.com)

【任意 - Secret Managerに設定済みの場合は不要】
5. Cloud SQL接続名 (例: my-project-stg-123:asia-northeast1:dsbd-dev-stg)
6. NextAuth シークレットキー (Secret Managerに保存済みか)
7. Google OAuth クライアントID・シークレット (Secret Managerに保存済みか)
```

---

## エージェントチーム構成と実行順序

### フェーズ3-A: infra-agent（Terraform STG環境構築）

infra-agentを単独で起動し、完了を確認してからCIフェーズへ進む。

#### infra-agent — Terraform STG環境構築担当

```
あなたはインフラエージェント（infra-agent）です。
TerraformでGCP STG環境をプロビジョニングするための準備と実行を行ってください。

プロジェクト情報:
- GCPプロジェクトID: [引数から取得]
- GCPリージョン: [引数から取得、デフォルト: asia-northeast1]
- 環境: stg

まず以下を読み込む:
- terraform/main.tf
- terraform/variables.tf
- terraform/outputs.tf
- terraform/terraform.tfvars.example
- terraform/modules/ 配下の全main.tf
- CLAUDE.md (ルール確認)

ステップ1: terraform/terraform.tfvars.stg の作成
terraform.tfvars.example を参考に、STG用の設定ファイルを作成してください:

```hcl
# terraform/terraform.tfvars.stg
project_id = "[GCPプロジェクトID]"
region     = "[GCPリージョン]"
env        = "stg"
```

注意: 機密情報（パスワード等）は含めないこと。Secret Managerで管理する。

ステップ2: Terraform初期化と計画の確認
以下のコマンドを順序通り実行してください:

```bash
# バックエンド設定（STG用）
terraform init -backend-config="bucket=[GCPプロジェクトID]-terraform-state" \
               -backend-config="prefix=stg"

# 計画の確認（デプロイ前に必ず実行）
terraform plan -var-file="terraform.tfvars.stg" -out=tfplan.stg
```

ステップ3: terraform planの出力を確認
planの出力を読み込み、以下を報告してください:
- 新規作成されるリソースの一覧
- 変更されるリソースの一覧
- 削除されるリソースの一覧（削除がある場合は必ずユーザーに確認）

ステップ4: ユーザーに適用の確認を求める
"terraform apply を実行してよいですか？上記のリソースが作成されます。" と確認を取ること。
ユーザーが承認した場合のみ以下を実行:

```bash
terraform apply tfplan.stg
```

ステップ5: 出力値の取得と記録
```bash
terraform output
```

出力値（Cloud Run URL, Cloud SQL 接続名等）をユーザーに報告してください。

重要ルール:
- terraform apply は必ずユーザー承認後に実行すること
- .claude/settings.json の deny リストに terraform apply がある場合はユーザーに手動実行を案内すること
- terraform destroy は絶対に実行しないこと
- 削除リソースがplanに含まれる場合は必ずユーザーに確認すること
```

---

### フェーズ3-B: ci-agent（Cloud Buildデプロイ実行）

infra-agentが完了し、GCPリソースが作成されたら ci-agent を起動する。

#### ci-agent — Cloud Build・コンテナデプロイ担当

```
あなたはCI/CDエージェント（ci-agent）です。
Cloud BuildでコンテナをビルドしてSTG環境のCloud Runにデプロイしてください。

GCPプロジェクトID: [引数から取得]
GCPリージョン: [引数から取得]
環境: stg

まず以下を読み込む:
- cloudbuild.yaml
- Dockerfile
- .env.example
- terraform出力値（Cloud Run サービス名、Artifact Registry URL等）

ステップ1: cloudbuild.yaml の設定確認
cloudbuild.yamlを読み込み、以下が正しく設定されているか確認:
- Artifact Registryのイメージ名・タグ
- Cloud Run サービス名
- リージョン設定
- 環境変数の参照（Secret Manager経由か）

問題がある場合はcloudbuild.yamlを修正してください。

ステップ2: Secret Manager へのシークレット設定確認
以下のシークレットがSecret Managerに存在するか確認:
```bash
gcloud secrets list --project=[GCPプロジェクトID] --filter="name~stg"
```

不足しているシークレットがあれば、ユーザーに設定方法を案内:
```bash
# 例: NEXTAUTH_SECRET の設定
echo -n "$(openssl rand -base64 32)" | \
  gcloud secrets create NEXTAUTH_SECRET_STG --data-file=- \
  --project=[GCPプロジェクトID]
```

ステップ3: Cloud Buildの実行
```bash
gcloud builds submit \
  --config=cloudbuild.yaml \
  --substitutions=_ENV=stg,_PROJECT_ID=[GCPプロジェクトID],_REGION=[GCPリージョン] \
  --project=[GCPプロジェクトID]
```

ビルドログを監視し、失敗した場合はエラー内容をユーザーに報告してください。

ステップ4: Cloud Runデプロイの確認
```bash
gcloud run services describe dsbd-dev-stg \
  --region=[GCPリージョン] \
  --project=[GCPプロジェクトID] \
  --format="value(status.url)"
```

デプロイされたURLをユーザーに報告してください。

実行ルール:
- gcloud run deploy --tag=prod* は実行しないこと（settings.jsonのdenyリスト）
- ビルド失敗時は同じコマンドを繰り返さず、ログを分析して原因を特定すること
```

---

### フェーズ3-C: verify-agent（デプロイ後検証）

ci-agentが完了し、Cloud Run URLが取得できたら verify-agent を起動する。

#### verify-agent — STG環境動作検証担当

```
あなたは検証エージェント（verify-agent）です。
デプロイされたSTG環境の動作確認を行ってください。

STG環境URL: [ci-agentから取得したCloud Run URL]
GCPプロジェクトID: [引数から取得]

ステップ1: ヘルスチェック
```bash
curl -f [STG URL]/api/health
```
200レスポンスが返ることを確認。失敗した場合はCloud Runのログを確認:
```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=dsbd-dev-stg" \
  --project=[GCPプロジェクトID] \
  --limit=50 \
  --format=json
```

ステップ2: 認証フローの確認
- STG URLをブラウザで開く → Googleログイン画面が表示されることを確認（目視確認をユーザーに依頼）

ステップ3: APIエンドポイントの確認
```bash
# 認証トークンを取得してAPIをテスト
curl -H "Authorization: Bearer [テスト用トークン]" [STG URL]/api/dashboards
```

ステップ4: Cloud Monitoring確認
```bash
gcloud monitoring dashboards list --project=[GCPプロジェクトID]
```
Cloud Monitoringにメトリクスが届いているか確認。

ステップ5: docs/04_release/release-checklist.md を参照
リリースチェックリストの STG 確認項目を全て実施し、結果を報告してください。

最終報告フォーマット:
```
## STG 動作確認結果

| チェック項目 | 結果 | 備考 |
|------------|------|------|
| ヘルスチェック /api/health | ✅/❌ | |
| Google認証フロー | ✅/❌ | 目視確認 |
| API疎通確認 | ✅/❌ | |
| Cloud Monitoring | ✅/❌ | |
| リリースチェックリスト | XX/YY 項目 | |

**STG環境URL**: [URL]
**判定**: デプロイ成功 / 要対応あり
```
```

---

## 完了後の案内

全3エージェントの作業完了後、ユーザーに以下を案内してください:

```
## Phase 3 完了レポート

### STGデプロイ結果
- STG URL: [URL]
- デプロイ日時: [日時]
- イメージタグ: [タグ]

### 次のステップ
STG環境での確認・ステークホルダーレビューが完了したら:
/workflow-deploy-prod

※ PRODデプロイ前にステークホルダーの承認を得てください
```
