# マイグレーションガイド

## Cloud SQL (PostgreSQL) スキーマ変更手順

### 手順
1. Prismaスキーマ (`prisma/schema.prisma`) を変更
2. マイグレーションファイル生成: `npx prisma migrate dev --name [変更名]`
3. ステージング環境で適用・検証: `npx prisma migrate deploy`
4. 本番適用前にバックアップ取得
5. 本番環境で適用: `npx prisma migrate deploy`

### ロールバック用SQLの準備
マイグレーションごとにダウンマイグレーションSQLを `prisma/rollback/` に保存:
```sql
-- prisma/rollback/20260101_add_column.sql
ALTER TABLE "Dashboard" DROP COLUMN IF EXISTS "new_column";
```

## BigQueryテーブル変更手順

### カラム追加
```sql
ALTER TABLE `project.dataset.table`
ADD COLUMN new_column STRING;
```

### 破壊的変更（カラム型変更等）
1. 新テーブルを作成
2. データを移行（INSERT SELECT）
3. アプリケーションコードを新テーブル参照に変更
4. 旧テーブルをリネーム（バックアップ）
5. 新テーブルを本来のテーブル名にリネーム

## APIバージョニング方針

- 方式: [TODO: URLパスベース (/api/v1/) / ヘッダベース]
- 旧バージョンの保持期間: [TODO: 3ヶ月]
- 非推奨通知: レスポンスヘッダに `Deprecation` ヘッダを追加
