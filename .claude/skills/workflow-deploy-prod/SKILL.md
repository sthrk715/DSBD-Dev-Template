---
description: リリースゲートチェック通過後にGCP PROD環境へのデプロイと監視設定を行う（Phase 4）
allowed-tools: Read, Glob, Grep, Task, Write, Edit, Bash
disable-model-invocation: true
---

# Phase 4: PROD環境デプロイ エージェントチーム

あなたはPhase 4のPRODデプロイを管理するオーケストレーターです。
このフェーズは最も慎重に行います。gate-agentが全チェックを通過した場合のみ、prod-deploy-agentとmonitor-agentを起動します。

ユーザーからの引数: $ARGUMENTS

---

## ⚠️ 重要: このフェーズの実行前に必ず確認すること

PRODデプロイを開始する前に、以下を**全てユーザーに確認**してください:

```
PRODデプロイを開始します。以下を確認してください:

1. STG環境での全テストが通過しましたか？ (Yes/No)
2. ステークホルダー（PO）の承認を得ましたか？ (Yes/No)
3. docs/04_release/release-checklist.md の全項目を確認しましたか？ (Yes/No)
4. ロールバック手順 (docs/04_release/rollback-plan.md) を把握していますか？ (Yes/No)
5. PRODデプロイを実行する時間帯は適切ですか（メンテナンス時間帯推奨）? (Yes/No)

全て Yes の場合のみ続行します。
```

一つでも No がある場合は中断し、対応すべき事項をユーザーに案内してください。

※ セキュリティ監査（OWASP Top 10）は gate-agent が自動実行します。手動確認は不要です。

---

## エージェントチーム構成と実行順序

### フェーズ4-A: gate-agent（リリースゲートチェック）

gate-agentを**単独で**起動し、全チェックが通過した場合のみ次フェーズへ。

#### gate-agent — リリースゲート・品質チェック担当

```
あなたはリリースゲートエージェント（gate-agent）です。
PRODデプロイ前の最終品質チェックを実施してください。

まず以下を読み込む:
- docs/04_release/release-checklist.md
- docs/04_release/rollback-plan.md
- docs/03_test/test-strategy.md

チェック1: テスト・品質チェック
```bash
npm run lint        # ESLintエラー: 0件必須
npm run typecheck   # TypeScriptエラー: 0件必須
npm run test        # 全テスト: パス必須
npm run test:coverage  # カバレッジ: 80%以上必須
npm run build       # ビルド: 成功必須
```

チェック2: OWASP Top 10 セキュリティ監査（自動実行）
.claude/commands/security-audit.md のチェック基準に基づき、以下を全て実施すること:

[A01] アクセス制御の不備
- src/app/api/ 配下の全 route.ts に認証ミドルウェアが適用されているか確認
- Admin/Editor/Viewer の権限チェックが実装されているか確認

[A02] 暗号化の失敗
- Grep パターン `(sk-|AIza|-----BEGIN|password\s*=\s*['"][^'"]+['"])` でハードコードを検索
- .env ファイルのコミット有無を確認（git log）

[A03] インジェクション
- Grep パターン `query\s*\+|` でBigQuery文字列結合クエリを検索
- Zodバリデーションが全API Routeに実装されているか確認

[A04] 安全でない設計
- Grep パターン `error\.stack` でスタックトレース漏洩を検索
- エラーレスポンスに内部情報が含まれていないか確認

[A05] セキュリティ設定のミス
- next.config.ts のCSP・CORSヘッダー設定を確認
- Grep パターン `console\.log.*(token|secret|password|key)` で機密ログを検索

[A06] 脆弱なコンポーネント
```bash
npm audit --audit-level=high
```

[A07] 認証・セッション管理の失敗
- NextAuth設定でNEXTAUTH_SECRETが環境変数から読み込まれているか確認
- セッション有効期限の設定を確認

[A08] ソフトウェア整合性の失敗
- Grep パターン `\beval\s*\(|new\s+Function\s*\(` でeval使用を検索
- Grep パターン `dangerouslySetInnerHTML` の使用箇所を確認

[A09] ログと監視の失敗
- 認証失敗・権限エラーのログ出力が実装されているか確認

[A10] SSRF
- Grep パターン `fetch\s*\(\s*(req\.|params\.|body\.)` でSSRFリスクを検索

発見した問題を Critical / High / Medium / Low で分類すること。
**Critical または High が1件でもある場合は即座に「gate-agent: FAIL」とし、処理を停止すること。**

チェック3: .env ファイルのコミット確認
```bash
git log --all --full-history -- "**/.env" "**/.env.*" | grep -v ".env.example"
```
.envファイルがコミット履歴に存在する場合は即座に中断し、ユーザーに対処を求めること。

チェック4: docs/04_release/release-checklist.md の確認
チェックリストを読み込み、全項目に対してチェックを実施。
未確認項目があれば報告する。

チェック5: STG環境の最終確認
```bash
curl -f [STG URL]/api/health
```
STGが正常稼働していることを確認。

最終レポート:
```
## リリースゲート チェック結果

| チェック項目 | 結果 | 詳細 |
|------------|------|------|
| テスト全通過 | ✅/❌ | XX件/XX件 |
| カバレッジ80%以上 | ✅/❌ | XX% |
| ESLintエラー0件 | ✅/❌ | |
| TypeScriptエラー0件 | ✅/❌ | |
| ビルド成功 | ✅/❌ | |
| OWASP A01: アクセス制御 | ✅/❌ | |
| OWASP A02: 暗号化 | ✅/❌ | |
| OWASP A03: インジェクション | ✅/❌ | |
| OWASP A04〜A05: 設計・設定 | ✅/❌ | |
| OWASP A06: 依存脆弱性 (npm audit) | ✅/❌ | Critical/High X件 |
| OWASP A07: 認証管理 | ✅/❌ | |
| OWASP A08〜A10: その他 | ✅/❌ | |
| .envコミットなし | ✅/❌ | |
| リリースチェックリスト | ✅/❌ | XX/XX項目 |
| STG正常稼働 | ✅/❌ | |

**判定**: 🟢 全チェック通過 → PRODデプロイ続行可能
       または
       🔴 XX件の問題あり → 解決後に再実行してください
```

全チェックが ✅ の場合のみ「gate-agent: PASS」と報告すること。
一つでも ❌ がある場合は「gate-agent: FAIL」として処理を停止すること。
```

---

### フェーズ4-B: gate-agent PASS後のみ — 並列実行

#### prod-deploy-agent — PROD環境デプロイ担当

```
あなたはPRODデプロイエージェント（prod-deploy-agent）です。
GCP PROD環境へのデプロイを実行してください。

GCPプロジェクトID: [引数から取得、またはterraform出力から取得]
GCPリージョン: [引数から取得]
環境: prod

まず以下を読み込む:
- terraform/terraform.tfvars.stg (STG設定の参考として)
- cloudbuild.yaml
- docs/06_lifecycle/ci-cd-design.md
- docs/04_release/rollback-plan.md (緊急時のため事前確認)

ステップ1: PROD用 Terraform 設定の確認
terraform/terraform.tfvars.prod が存在するか確認。
存在しない場合は作成:

```hcl
# terraform/terraform.tfvars.prod
project_id = "[PROD GCPプロジェクトID]"
region     = "[GCPリージョン]"
env        = "prod"
```

ステップ2: Terraform PROD 計画の確認
```bash
terraform init -backend-config="bucket=[PROD GCPプロジェクトID]-terraform-state" \
               -backend-config="prefix=prod"
terraform plan -var-file="terraform.tfvars.prod" -out=tfplan.prod
```

planを読み込み、削除リソースがある場合は**必ずユーザーに確認**して中断すること。

ステップ3: ユーザーに terraform apply の最終確認
「以下のリソースが作成・変更されます。PROD環境への適用を承認しますか？」と確認。
承認後のみ:
```bash
terraform apply tfplan.prod
```

ステップ4: Cloud Build PROD デプロイ
```bash
gcloud builds submit \
  --config=cloudbuild.yaml \
  --substitutions=_ENV=prod,_PROJECT_ID=[PROD GCPプロジェクトID],_REGION=[GCPリージョン] \
  --project=[PROD GCPプロジェクトID]
```

ステップ5: Cloud Run トラフィック移行の確認
```bash
gcloud run services describe dsbd-dev-prod \
  --region=[GCPリージョン] \
  --project=[PROD GCPプロジェクトID] \
  --format="value(status.url,status.traffic)"
```

PROD URLをユーザーに報告してください。

重要ルール:
- 各ステップで必ずユーザーの承認を得てから実行すること
- terraform destroy は絶対に実行しないこと
- デプロイ失敗時はロールバック手順 (docs/04_release/rollback-plan.md) をユーザーに案内すること
- gcloud run deploy --tag=prod* は settings.json で deny されているため、
  ユーザーに手動実行を案内すること
```

---

#### monitor-agent — 監視・アラート設定担当

```
あなたはモニタリングエージェント（monitor-agent）です。
PROD環境の監視設定を確認・整備してください。

GCPプロジェクトID: [引数から取得]
GCPリージョン: [引数から取得]

まず以下を読み込む:
- docs/05_operation/monitoring-design.md
- docs/05_operation/alert-rules.md
- docs/05_operation/runbook.md

ステップ1: Cloud Monitoring ダッシュボード確認
```bash
gcloud monitoring dashboards list --project=[GCPプロジェクトID]
```
monitoring-design.md に記載のメトリクスがモニタリングに存在するか確認。

ステップ2: アラートポリシーの確認
```bash
gcloud alpha monitoring policies list --project=[GCPプロジェクトID]
```
alert-rules.md に記載のアラートが設定されているか確認。
不足しているアラートがあれば、設定手順をユーザーに案内する:

- Cloud Run レイテンシ > 3s アラート
- Cloud Run エラーレート > 1% アラート
- BigQuery コスト > 閾値 アラート
- Cloud SQL 接続数 > 上限 × 0.8 アラート

ステップ3: ログベースのアラート確認
```bash
gcloud logging sinks list --project=[GCPプロジェクトID]
```
エラーログのCloud Monitoring転送が設定されているか確認。

ステップ4: runbook.md の最終確認
docs/05_operation/runbook.md を読み込み、以下のインシデント対応手順が完成しているか確認:
- 高レイテンシ発生時
- Cloud SQL 接続エラー時
- BigQuery コスト急増時
- アプリケーションエラー急増時

未完成の場合はユーザーに完成を依頼すること。

最終報告:
```
## 監視設定 確認結果

| 設定項目 | 状態 | 備考 |
|---------|------|------|
| Cloud Monitoring ダッシュボード | ✅/❌ | |
| Cloud Runアラート | ✅/❌ | |
| BigQueryコストアラート | ✅/❌ | |
| Cloud SQLアラート | ✅/❌ | |
| ログ転送設定 | ✅/❌ | |
| Runbook完成 | ✅/❌ | |
```
```

---

## フェーズ4-C: PROD動作確認

prod-deploy-agent と monitor-agent が完了したら、以下を実施してください:

```bash
# PRODヘルスチェック
curl -f [PROD URL]/api/health

# Cloud Runログ確認（デプロイ直後）
gcloud logging read \
  "resource.type=cloud_run_revision AND resource.labels.service_name=dsbd-dev-prod" \
  --project=[PROD GCPプロジェクトID] \
  --limit=20 \
  --freshness=10m
```

エラーが出ていないことを確認してユーザーに報告してください。

---

## 完了後の案内

全フェーズ完了後、ユーザーに以下を報告してください:

```
## 🎉 Phase 4 完了 — DSBD-Dev-Template 本番リリース完了

### PROD環境情報
- PROD URL: [URL]
- デプロイ日時: [日時]
- イメージタグ: [タグ]

### リリース後の対応
1. ステークホルダーへのリリース通知を送付してください
2. 24時間はCloud Monitoringのアラートを監視してください
3. 問題発生時のロールバック手順: docs/04_release/rollback-plan.md を参照

### 完成した成果物
✅ docs/ — 全ドキュメント完成
✅ src/  — プロトタイプ実装完成
✅ STG環境 — GCP STGデプロイ済み
✅ PROD環境 — GCP PRODデプロイ済み

お疲れ様でした！🚀
```
