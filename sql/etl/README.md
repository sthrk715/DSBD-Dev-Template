# ETL SQLファイル

詳細設計: `docs/02_design/bigquery-etl-design.md`

## ファイル命名規則

```
{step}_{source}_to_{target}.sql
```

| ステップ | ファイル名 | 説明 |
|---------|-----------|------|
| 02 | `02_raw_sales_to_fact_sales.sql` | 売上: raw → dwh |
| 02 | `02_raw_customers_to_dim_customers.sql` | 顧客: raw → dwh |
| 02 | `02_raw_products_to_dim_products.sql` | 商品: raw → dwh |
| 03 | `03_dwh_to_mart_sales_daily.sql` | 日次売上マート生成 |
| 03 | `03_dwh_to_mart_category_summary.sql` | カテゴリ別集計 |
| 03 | `03_dwh_to_mart_customer_segments.sql` | 顧客セグメント集計 |
| 03 | `03_dwh_to_mart_kpi_summary.sql` | KPIサマリ生成 |
| 04 | `04_mart_to_mart_sales_monthly.sql` | 月次売上マート生成 |
| 99 | `99_quality_check.sql` | データ品質チェック |

## 実行方法

```bash
# stg環境での実行（Claude Code実行可能）
bq query --project_id=$GCP_PROJECT_ID_STG --use_legacy_sql=false < sql/etl/{filename}.sql

# 品質チェック
bq query --project_id=$GCP_PROJECT_ID_STG --use_legacy_sql=false < sql/etl/99_quality_check.sql
```
