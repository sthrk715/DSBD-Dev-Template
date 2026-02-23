# API仕様書

## エンドポイント一覧

### ダッシュボードデータAPI（全ユーザー）

| メソッド | パス | 説明 |
|---------|------|------|
| GET | /api/health | ヘルスチェック（認証不要） |
| GET | /api/dashboard/executive | エグゼクティブサマリ（タブ1） |
| GET | /api/dashboard/channels | チャネル別詳細（タブ2） |
| GET | /api/dashboard/subscription | サブスク分析（タブ3） |
| GET | /api/dashboard/customers | 顧客分析（タブ4） |
| GET | /api/dashboard/access | アクセス・CVR分析（タブ5） |
| GET | /api/dashboard/gifts | ギフト売上（タブ6） |
| GET | /api/dashboard/products | 商品カテゴリ別売上（タブ7） |
| GET | /api/dashboard/email | メルマガ分析（タブ8） |
| GET | /api/dashboard/timeseries | 時系列比較（タブ9） |
| GET | /api/export/csv | CSVエクスポート |

### 管理API（Admin専用）

| メソッド | パス | 説明 |
|---------|------|------|
| GET | /api/admin/users | ユーザー一覧取得 |
| POST | /api/admin/users/invite | ユーザー招待 |
| GET | /api/admin/users/:id | ユーザー詳細取得 |
| PUT | /api/admin/users/:id/role | ロール変更 |
| PUT | /api/admin/users/:id/deactivate | アカウント無効化 |
| DELETE | /api/admin/users/:id | ユーザー削除 |
| GET | /api/admin/settings | システム設定取得 |
| PUT | /api/admin/settings | システム設定更新 |
| GET | /api/admin/events | イベントカレンダー取得 |
| POST | /api/admin/events | イベント登録 |
| PUT | /api/admin/events/:id | イベント更新 |
| DELETE | /api/admin/events/:id | イベント削除 |
| GET | /api/admin/targets | 売上目標取得 |
| POST | /api/admin/targets | 売上目標登録 |
| PUT | /api/admin/targets/:id | 売上目標更新 |
| GET | /api/admin/gift-seasons | ギフトシーズン定義取得 |
| PUT | /api/admin/gift-seasons/:id | ギフトシーズン定義更新 |

---

## 認証

NextAuth.js JWTセッション（HttpOnly Cookie）。API RouteでNextAuth `auth()` を呼び出してセッション検証。
Admin専用APIは `requireAdmin()` ヘルパーで権限チェック。

---

## 共通クエリパラメータ（ダッシュボードAPI）

全ダッシュボードAPIは以下の共通フィルタパラメータを受け付ける。

| パラメータ | 型 | 必須 | デフォルト | 説明 |
|-----------|---|------|-----------|------|
| startDate | string (YYYY-MM-DD) | 任意 | 30日前 | 開始日 |
| endDate | string (YYYY-MM-DD) | 任意 | 今日 | 終了日 |
| channel | string | 任意 | all | チャネル（all/shopify/amazon/rakuten/yahoo） |
| period | string | 任意 | daily | 表示期間（daily/weekly/monthly） |
| compareMode | string | 任意 | calendar | 比較モード（calendar/same_dow） |

---

## 共通レスポンス形式

### 成功レスポンス
```json
{
  "data": { ... },
  "meta": {
    "generatedAt": "2026-02-24T08:00:00Z",
    "cacheHit": true
  }
}
```

### エラーレスポンス（RFC 7807準拠）
```json
{
  "type": "VALIDATION_ERROR",
  "title": "リクエストパラメータが不正です",
  "status": 400,
  "detail": "startDateはYYYY-MM-DD形式で指定してください",
  "instance": "/api/dashboard/executive"
}
```

### ページネーション（管理API）

- 方式: オフセットベース
- パラメータ: `?page=1&perPage=20`
- レスポンスに `meta.total`, `meta.page`, `meta.perPage` を含む

---

## エンドポイント詳細

### GET /api/dashboard/executive

エグゼクティブサマリ（タブ1）のデータを取得。

**レスポンス:**
```json
{
  "data": {
    "kpis": {
      "totalSales": { "value": 12345678, "previousValue": 11000000, "changeRate": 12.2 },
      "targetAchievement": { "value": 87.3, "target": 15000000 },
      "yoyGrowth": { "value": 12.5 },
      "orderCount": { "value": 1234, "previousValue": 1100, "changeRate": 12.2 }
    },
    "dailySalesTrend": [
      { "date": "2026-02-01", "sales": 450000, "prevYearSales": 400000 }
    ],
    "channelBreakdown": [
      { "channel": "shopify", "sales": 5000000, "ratio": 0.42 },
      { "channel": "rakuten", "sales": 3500000, "ratio": 0.29 },
      { "channel": "amazon", "sales": 2500000, "ratio": 0.21 },
      { "channel": "yahoo", "sales": 1000000, "ratio": 0.08 }
    ],
    "channelKpiTable": [
      { "channel": "shopify", "sales": 5000000, "orders": 500, "avgPrice": 10000, "yoyGrowth": 15.2 }
    ],
    "events": [
      { "id": "ev1", "name": "楽天マラソン", "startDate": "2026-02-01", "endDate": "2026-02-05", "type": "promotion" }
    ]
  }
}
```

### GET /api/dashboard/subscription

サブスク分析（タブ3）のデータを取得。

**レスポンス:**
```json
{
  "data": {
    "kpis": {
      "activeContracts": { "value": 1234 },
      "newContracts": { "value": 56 },
      "churnRate": { "value": 3.2 },
      "pauseRate": { "value": 1.8 },
      "skipRate": { "value": 5.1 }
    },
    "contractTrend": [
      { "month": "2026-01", "active": 1200, "paused": 80, "churned": 40 }
    ],
    "cohortHeatmap": [
      { "cohortMonth": "2025-06", "monthsSinceStart": 0, "retentionRate": 100 },
      { "cohortMonth": "2025-06", "monthsSinceStart": 1, "retentionRate": 85.2 }
    ],
    "monthlyChurnTrend": [
      { "month": "2026-01", "churnRate": 3.2 }
    ]
  }
}
```

### GET /api/dashboard/gifts

ギフト売上（タブ6）のデータを取得。

**追加パラメータ:**

| パラメータ | 型 | 必須 | デフォルト | 説明 |
|-----------|---|------|-----------|------|
| season | string | 任意 | all | シーズン（all/mothers_day/chugen/keiro/seibo/fukubako） |

**レスポンス:**
```json
{
  "data": {
    "kpis": {
      "seasonTotal": { "value": 12500000, "previousValue": 10500000, "changeRate": 19.0 },
      "eGiftRatio": { "value": 35.0 },
      "remainingDays": { "value": 12 }
    },
    "dailyProgress": [
      { "date": "2026-05-01", "cumulative": 500000, "prevYearCumulative": 400000 }
    ],
    "seasonComparison": [
      { "season": "mothers_day", "currentYear": 5000000, "prevYear": 4200000, "yoyGrowth": 19.0 }
    ],
    "eGiftBreakdown": {
      "eGift": 4375000,
      "physical": 8125000
    }
  }
}
```

### GET /api/dashboard/timeseries

時系列比較（タブ9）のデータを取得。

**追加パラメータ:**

| パラメータ | 型 | 必須 | デフォルト | 説明 |
|-----------|---|------|-----------|------|
| comparison | string | 任意 | yoy | 比較種別（yoy/mom/wow/same_dow/y2y） |
| movingAvg | string | 任意 | none | 移動平均（none/7d/28d） |

**レスポンス:**
```json
{
  "data": {
    "series": [
      { "date": "2026-02-01", "current": 450000, "comparison": 400000 }
    ],
    "movingAverage": [
      { "date": "2026-02-01", "value": 430000 }
    ],
    "mtdSales": 8500000,
    "ytdSales": 95000000,
    "events": [
      { "id": "ev1", "name": "楽天マラソン", "startDate": "2026-02-01", "endDate": "2026-02-05", "type": "promotion" }
    ]
  }
}
```

### GET /api/export/csv

CSVエクスポート。BigQuery → GCS → 署名付きURLで返却。

**パラメータ:**

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| tab | string | 要 | 対象タブ（executive/channels/subscription/...） |
| startDate | string | 要 | 開始日 |
| endDate | string | 要 | 終了日 |
| channel | string | 任意 | チャネルフィルタ |

**レスポンス:**
```json
{
  "data": {
    "downloadUrl": "https://storage.googleapis.com/...",
    "expiresAt": "2026-02-24T09:00:00Z",
    "rowCount": 1500,
    "fileName": "executive_20260201_20260224.csv"
  }
}
```

---

## レート制限

| エンドポイント | 制限 |
|--------------|------|
| ダッシュボードAPI | 100 req/min per user |
| CSVエクスポート | 10 req/hour per user |
| 管理API | 60 req/min per user |

## ステータスコード

| コード | 説明 |
|--------|------|
| 200 | 成功 |
| 201 | 作成成功 |
| 400 | リクエスト不正（バリデーションエラー） |
| 401 | 認証エラー（未ログイン） |
| 403 | 権限不足（Viewer → Admin API等） |
| 404 | リソースなし |
| 429 | レート制限超過 |
| 500 | サーバーエラー |
