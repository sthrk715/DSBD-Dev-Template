# API仕様書

## エンドポイント一覧

| メソッド | パス | 認証 | 説明 |
|---------|------|------|------|
| GET | /api/health | 不要 | ヘルスチェック |
| GET | /api/dashboards | 要 | ダッシュボード一覧取得 |
| GET | /api/dashboards/:id | 要 | ダッシュボード詳細取得 |
| GET | /api/dashboards/:id/data | 要 | ダッシュボードデータ取得 |
| POST | /api/dashboards/:id/export | 要 | データエクスポート |
| GET | /api/users | 要(Admin) | ユーザー一覧取得 |
| PUT | /api/users/:id/role | 要(Admin) | ユーザーロール変更 |
| [TODO] | [TODO] | [TODO] | [TODO] |

## 認証ヘッダ仕様

```
Authorization: Bearer <JWT_TOKEN>
```

## 共通レスポンス形式

### 成功レスポンス
```json
{
  "data": { ... },
  "meta": {
    "total": 100,
    "page": 1,
    "perPage": 20
  }
}
```

### エラーレスポンス（RFC 7807準拠）
```json
{
  "type": "https://example.com/errors/not-found",
  "title": "リソースが見つかりません",
  "status": 404,
  "detail": "指定されたダッシュボード(id=123)は存在しません",
  "instance": "/api/dashboards/123"
}
```

## ページネーション方式

- 方式: オフセットベース
- パラメータ: `?page=1&perPage=20`
- レスポンスに `meta.total`, `meta.page`, `meta.perPage` を含む

## エンドポイント詳細

### GET /api/dashboards/:id/data

ダッシュボードのデータを取得する。

**リクエスト:**
```
GET /api/dashboards/1/data?startDate=2026-01-01&endDate=2026-01-31&category=all
```

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| startDate | string (YYYY-MM-DD) | 要 | 開始日 |
| endDate | string (YYYY-MM-DD) | 要 | 終了日 |
| category | string | 任意 | カテゴリフィルタ |
| [TODO] | [TODO] | [TODO] | [TODO] |

**レスポンス:**
```json
{
  "data": {
    "kpis": [
      { "id": "revenue", "label": "売上", "value": 1234567, "unit": "円", "change": 5.2 }
    ],
    "charts": [
      {
        "id": "revenue-trend",
        "type": "line",
        "data": [
          { "date": "2026-01-01", "value": 100000 }
        ]
      }
    ]
  }
}
```

## レート制限

| エンドポイント | 制限 |
|--------------|------|
| 全API共通 | [TODO: 1000 req/min per user] |
| データエクスポート | [TODO: 10 req/hour per user] |

## ステータスコード

| コード | 説明 |
|--------|------|
| 200 | 成功 |
| 201 | 作成成功 |
| 400 | リクエスト不正 |
| 401 | 認証エラー |
| 403 | 権限不足 |
| 404 | リソースなし |
| 429 | レート制限超過 |
| 500 | サーバーエラー |
