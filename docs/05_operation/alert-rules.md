# アラートルール定義

## アラート条件一覧

| # | 条件 | 重大度 | 閾値 | 判定期間 |
|---|------|--------|------|---------|
| A-001 | Cloud Runエラーレート | Critical | > 5% | 5分間 |
| A-002 | Cloud Runレイテンシ P95 | High | > 3秒 | 5分間 |
| A-003 | BigQueryクエリ失敗 | High | > 0 | 即時 |
| A-004 | Cloud SQLストレージ使用量 | Warning | > 80% | - |
| A-005 | Cloud SQLストレージ使用量 | Critical | > 90% | - |
| A-006 | 日次バッチ未完了 | High | 完了未確認 | [TODO: AM 9:00] |
| A-007 | Cloud Runメモリ使用率 | Warning | > 80% | 5分間 |
| A-008 | SSL証明書期限 | Warning | 残30日以下 | 日次チェック |
| A-009 | BigQueryスキャン量異常 | Warning | [TODO: 日平均の3倍] | 日次 |
| A-010 | ログインエラー連続 | High | 同一IP 10回/分 | 1分間 |

## 通知先

| 重大度 | 通知先 | 方式 |
|--------|--------|------|
| Critical | [TODO: 運用チーム全員] | Slack (#alerts-critical) + PagerDuty + メール |
| High | [TODO: 運用担当者] | Slack (#alerts-high) + メール |
| Warning | [TODO: 開発チーム] | Slack (#alerts-warning) |
| Info | - | Cloud Monitoring ダッシュボードのみ |

## エスカレーションルール

| 段階 | 条件 | 対応者 | アクション |
|------|------|--------|----------|
| Level 1 | アラート発生 | 当番エンジニア | 初動対応（15分以内） |
| Level 2 | 30分以内に解消しない | テックリード | 判断・指示 |
| Level 3 | 1時間以内に解消しない | PM + ステークホルダー | 顧客通知判断 |

## アラート対応フロー

```
1. アラート通知受信
2. Cloud Monitoring / Logging で状況確認
3. runbook.md の該当手順を参照
4. 初動対応実施
5. 解消確認
6. インシデントレポート作成（P1/P2の場合）
```
