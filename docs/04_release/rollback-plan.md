# ロールバック計画

## ロールバック判断基準

以下のいずれかに該当する場合、ロールバックを実施する:

| 条件 | 閾値 | 判断者 |
|------|------|--------|
| エラーレート | [TODO: 5%超過（5分間継続）] | SRE / 運用チーム |
| レスポンスタイム | [TODO: P95 > 3秒（5分間継続）] | SRE / 運用チーム |
| 重大バグ | ユーザー影響のある機能不全 | PM + TL |
| データ不整合 | 表示データの誤り | PM + TL |

## Cloud Runリビジョン切り戻し

```bash
# 1. 現在のリビジョン一覧確認
gcloud run revisions list --service=[SERVICE_NAME] --region=[REGION]

# 2. 前バージョンへトラフィック100%切替
gcloud run services update-traffic [SERVICE_NAME] \
  --to-revisions=[PREVIOUS_REVISION]=100 \
  --region=[REGION]

# 3. 切り戻し後の動作確認
curl -s https://[SERVICE_URL]/api/health | jq .
```

## BigQueryスキーマ変更のロールバック

```bash
# テーブル定義の復元（バックアップテーブルから）
# ※ 変更前にバックアップテーブルを作成しておくこと
bq cp [DATASET].[TABLE]_backup_[DATE] [DATASET].[TABLE]
```

## Terraformのロールバック

```bash
# 1. 前のstateを確認
terraform show

# 2. 特定リソースの状態復元
terraform plan -target=[RESOURCE]

# 3. 必要に応じて前のcommitのTerraformコードに戻す
git checkout [PREVIOUS_COMMIT] -- terraform/
terraform plan
terraform apply  # ※人間の承認必須
```

## データマイグレーションの復旧

```bash
# Prismaマイグレーションのロールバック
# ※ downマイグレーションスクリプトを事前に用意
npx prisma migrate resolve --rolled-back [MIGRATION_NAME]
```

## ロールバック後の確認事項

- [ ] ヘルスチェックエンドポイントの正常応答
- [ ] 主要画面の表示確認
- [ ] ログインの動作確認
- [ ] データの整合性確認
- [ ] エラーレート・レスポンスタイムの正常化確認
- [ ] 関係者への通知
- [ ] インシデントレポートの作成
