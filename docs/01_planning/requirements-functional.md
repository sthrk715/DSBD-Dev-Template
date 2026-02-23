# 機能要件定義書

## 画面一覧

| 画面ID | 画面名 | URL | 認証 | 概要 |
|--------|--------|-----|------|------|
| SCR-001 | ログイン | /login | 不要 | Google SSO + Email/Password認証 |
| SCR-002 | ダッシュボード一覧 | /dashboard | 要 | ダッシュボード選択画面 |
| SCR-003 | ダッシュボード詳細 | /dashboard/:id | 要 | KPI・グラフ・フィルタ表示 |
| SCR-004-A | ユーザー管理 | /settings/users | 要（Admin） | ユーザー招待・権限変更・削除 |
| SCR-004-B | システム設定 | /settings/system | 要（Admin） | システム全般の設定 |
| SCR-005 | パスワードリセット | /auth/reset-password | 不要 | パスワード再設定 |
| SCR-006 | パスワード変更 | /settings/password | 要 | ログイン後のPW変更 |

## 画面別機能定義

### SCR-001: ログイン画面

**設計書:** `docs/02_design/auth-design.md`

- [ ] Google OAuth 2.0 SSO認証（「Googleでログイン」ボタン）
- [ ] Email & Password認証（フォーム入力）
- [ ] パスワード表示/非表示トグル（目アイコン）
- [ ] 未認証ユーザーの自動リダイレクト
- [ ] ログイン失敗時のエラー表示（アカウント列挙対策: 統一メッセージ）
- [ ] アカウントロック時のエラー表示（「30分後に再試行」）
- [ ] 「パスワードを忘れた場合」リンク → SCR-005
- [ ] ログイン後のリダイレクト（元のURL or /dashboard）

### SCR-002: ダッシュボード一覧
- [ ] ダッシュボード一覧の表示（カード形式）
- [ ] お気に入り機能
- [ ] 最終閲覧日時の表示
- [ ] [TODO: 追加機能]

### SCR-003: ダッシュボード詳細

**設計書:** `docs/02_design/dashboard-ui-spec.md`, `docs/02_design/ui/components/selector-spec.md`

- [ ] KPIカード表示（4枚: 売上合計/注文件数/ユニーク顧客数/平均注文額）
  - データソース: `mart_kpi_summary`
  - 前期比（%）+ トレンドアイコン（↑↓→）
- [ ] グラフ表示
  - 日次トレンド LineChart（データソース: `mart_sales_daily`）
  - カテゴリ構成比 PieChart（データソース: `mart_category_summary`）
  - 月次比較 BarChart（データソース: `mart_sales_monthly`）
  - 顧客セグメント BarChart（データソース: `mart_customer_segments`）
- [ ] フィルタバー
  - 期間選択 DateRangePicker（プリセット付き、デフォルト: 直近30日）
  - チャネル FilterSelect（web/store/api、「すべて」付き）
  - カテゴリ FilterSelect（大カテゴリ一覧）
  - 地域 FilterMultiSelect（複数選択可）
  - 表示期間切替 PeriodSelector（日次/週次/月次）
  - リセットボタン
- [ ] フィルタ状態のURL連動（ブックマーク可能）
- [ ] データエクスポート（CSV/Excel）— Editor以上
- [ ] ドリルダウン（グラフクリックで詳細遷移）
- [ ] データテーブル表示（ページネーション + ソート）

### SCR-004-A: ユーザー管理画面

**設計書:** `docs/02_design/permission-management.md`

- [ ] ユーザー一覧テーブル（名前/メール/ロール/状態/最終ログイン）
- [ ] 検索・フィルタ（テキスト検索、ロール、ステータス）
- [ ] ユーザー招待モーダル（メール/名前/ロール/認証方式選択）
  - Google SSO招待: ログインURLをメール送信
  - Email/PW招待: 仮パスワード + パスワード変更URLをメール送信
- [ ] ロール変更（ドロップダウンから即時変更、確認ダイアログ付き）
  - 自分自身のロール変更は不可
  - 最後のAdminのロール降格は不可
- [ ] アカウント無効化（ソフトデリート）
- [ ] 管理者によるパスワードリセット送信
- [ ] ユーザー削除（メールアドレス入力で確認）
- [ ] ページネーション

### SCR-004-B: システム設定
- [ ] 通知設定
- [ ] [TODO: 追加機能]

### SCR-005: パスワードリセット
- [ ] メールアドレス入力フォーム
- [ ] リセットメール送信（ユーザー存在有無にかかわらず同一メッセージ表示）
- [ ] リセットURL経由の新パスワード設定フォーム
- [ ] トークン期限切れ時のエラー表示

### SCR-006: パスワード変更
- [ ] 現在のパスワード入力
- [ ] 新パスワード入力（バリデーション: 12文字以上、3種以上の文字種）
- [ ] 新パスワード確認入力
- [ ] パスワード強度インジケーター

## ユーザー権限と認証方式

### 認証方式

| 方式 | 対象 | 実装 |
|------|------|------|
| Google SSO (OAuth 2.0) | Google Workspace ユーザー | NextAuth.js Google Provider |
| Email & Password | 外部パートナー等 | NextAuth.js Credentials Provider + bcrypt |

- パスワード暗号化: bcrypt (ソルトラウンド12)
- MFA: [TODO: 要/不要]

### ロール定義

| ロール | 説明 | 権限 |
|--------|------|------|
| Admin | システム管理者 | 全機能アクセス、ユーザー管理、システム設定 |
| Editor | 編集者 | ダッシュボード作成・編集、データエクスポート |
| Viewer | 閲覧者 | ダッシュボード閲覧のみ |

**詳細な権限マトリクス:** `docs/02_design/auth-design.md` 参照

## データ更新頻度

| データ種別 | 更新頻度 | 方式 | ETL参照 |
|-----------|---------|------|---------|
| 売上データ (raw_sales) | 日次バッチ (AM 1:00) | Cloud Functions → BigQuery | `docs/02_design/bigquery-etl-design.md` Step 1 |
| 顧客マスタ (raw_customers) | 日次バッチ (AM 1:00) | Cloud Functions → BigQuery | 同上 |
| 商品マスタ (raw_products) | 日次バッチ (AM 1:00) | Cloud Functions → BigQuery | 同上 |
| 日次集計 (mart_*) | 日次 (AM 3:00) | BigQuery Scheduled Query | 同上 Step 3 |
| 月次集計 (mart_sales_monthly) | 毎月1日 AM 4:00 | BigQuery Scheduled Query | 同上 Step 4 |

## マルチテナント要件

- マルチテナント: [TODO: 要/不要]
- データ分離方式: [TODO: 行レベルセキュリティ / データセット分離 / 該当なし]

## 通知機能

| 通知種別 | トリガー | 通知先 |
|---------|---------|--------|
| [TODO: 閾値アラート] | [TODO: KPIが閾値を超過] | [TODO: メール / Slack] |
| [TODO: レポート配信] | [TODO: 毎朝9時] | [TODO: メール] |
| ユーザー招待 | Admin が招待実行 | 招待対象のメール |
| ロール変更通知 | Admin がロール変更 | 対象ユーザーのメール |
| パスワードリセット | ユーザー要求 or Admin 操作 | 対象ユーザーのメール |
