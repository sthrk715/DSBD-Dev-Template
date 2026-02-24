# フロントエンド実装仕様書

## チャートライブラリ

- ライブラリ: **Apache ECharts** (ヒートマップ・markLine/markArea・dataZoom対応)
- テーブル: **TanStack Table v8** (ソート・フィルタ・ページネーション)

| グラフ種別 | ECharts series type | 用途 | データソース (mart層) |
|-----------|-------------------|------|---------------------|
| 折れ線グラフ | line | 日次売上トレンド、比較グラフ | mart.daily_sales_summary, mart.time_series_comparison |
| 棒グラフ | bar | チャネル別比較、月次比較 | mart.daily_sales_summary |
| 面グラフ | line (areaStyle) | 契約者数推移、チャネル構成比推移 | mart.subscription_analysis |
| ドーナツチャート | pie (radius) | チャネル構成比、eギフト構成比 | mart.daily_sales_summary |
| ヒートマップ | heatmap | コホート分析リテンション | mart.subscription_cohort |
| ゲージ | gauge | ギフトシーズン進捗 | mart.gift_seasonal_sales |
| markArea | series.markArea | 販促イベント期間の帯表示 | mart.event_enriched_daily |
| markLine | series.markLine | アドホックイベントの縦線表示 | mart.event_enriched_daily |
| dataZoom | dataZoom (slider) | 期間スクロール | - |

## コンポーネント設計

shadcn/ui ベースのAtomic Design:

```
src/
├── components/
│   ├── ui/                    # shadcn/ui基盤（Atoms）
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── select.tsx
│   │   ├── popover.tsx
│   │   ├── calendar.tsx
│   │   ├── toggle-group.tsx
│   │   ├── tabs.tsx
│   │   └── ...
│   ├── atoms/                 # プロジェクト固有Atoms
│   │   ├── kpi-value.tsx
│   │   ├── trend-indicator.tsx  # ↑↓→ トレンド表示
│   │   └── status-badge.tsx
│   ├── molecules/             # Molecules
│   │   ├── kpi-card.tsx
│   │   ├── filter-select.tsx         # チャネルセレクタ
│   │   ├── date-range-picker.tsx     # 期間選択
│   │   ├── period-selector.tsx       # 日次/週次/月次
│   │   ├── compare-mode-toggle.tsx   # 暦日/同曜日
│   │   ├── season-selector.tsx       # ギフトシーズン（タブ6用）
│   │   └── echart-wrapper.tsx        # ECharts共通ラッパー
│   ├── organisms/             # Organisms
│   │   ├── filter-bar.tsx     # 共通フィルタバー
│   │   ├── tab-navigation.tsx # 9タブナビゲーション
│   │   ├── chart-container.tsx
│   │   ├── data-table.tsx     # TanStack Table
│   │   ├── cohort-heatmap.tsx # コホートヒートマップ
│   │   └── gift-progress-gauge.tsx # ギフト進捗ゲージ
│   ├── templates/             # Templates
│   │   ├── dashboard-layout.tsx  # サイドバー + タブ + フィルタバー + メインコンテンツ
│   │   └── settings-layout.tsx
│   └── pages/                 # Pages（App Routerのpage.tsx）
│       ├── tab-executive.tsx
│       ├── tab-channels.tsx
│       ├── tab-subscription.tsx
│       ├── tab-customers.tsx
│       ├── tab-access.tsx
│       ├── tab-gifts.tsx
│       ├── tab-products.tsx
│       ├── tab-email.tsx
│       └── tab-timeseries.tsx
```

**セレクタコンポーネント詳細仕様:** `docs/02_design/ui/components/selector-spec.md`

## 状態管理

- **Zustand** を使用（軽量でボイラープレート最小）
- ストア分割:
  - `useFilterStore` - 共通フィルタ状態（期間・チャネル・表示期間・比較モード）
  - `useUserStore` - ユーザー情報・ロール
- サーバー状態は **TanStack Query** で管理（キャッシュキーにフィルタ状態を含める）

### useFilterStore定義

```typescript
// src/stores/filter-store.ts
interface FilterState {
  dateRange: { from: Date; to: Date }
  preset: string             // last7d, last30d, last90d, thisMonth, lastMonth, thisQuarter, thisYear, custom
  channel: string            // all, shopify, amazon, rakuten, yahoo
  period: 'daily' | 'weekly' | 'monthly'
  compareMode: 'calendar' | 'same_dow'
  // タブ固有フィルタ
  giftSeason: string         // all, mothers_day, chugen, keiro, seibo, newyear（タブ6用）
  comparison: string          // yoy, mom, wow, same_dow, y2y（タブ9用）
  movingAvg: string           // none, 7d, 28d（タブ9用）
}
```

## フィルタ・パラメータ管理

- URLクエリパラメータと連動（ブックマーク可能）
- フィルタ変更時: 即時反映（DateRangePickerのみ「適用」ボタン付き）
- デフォルト値: 直近30日、チャネル=全て、期間=日次、比較モード=暦日
- リセットボタン: 全フィルタをデフォルト値に戻す + URLパラメータクリア

```
/dashboard?from=2026-01-15&to=2026-02-14&channel=shopify&period=daily&compareMode=calendar&tab=executive
```

## KPIカード仕様

各タブ上部に3-5枚のKPIカードを横並び表示。タブごとに異なるKPIを表示。

### KPIカードコンポーネント

```
┌────────────────────┐
│ 全チャネル売上（税抜）│
│ ¥12,500,000        │  ← text-2xl font-bold
│ +12.5% ↑           │  ← text-green-600 (up) / text-red-600 (down) / text-gray-500 (flat)
│ 前年比              │
└────────────────────┘
```

## ダークモード対応

- 初回リリースでは非対応
- 実装方式: Tailwind CSS `dark:` プレフィックス
- ライト基調で固定

## アクセシビリティ要件

| 項目 | 対応 |
|------|------|
| WCAG Level | AA |
| キーボード操作 | Tab/Enter/Escで操作可能 |
| スクリーンリーダー | ARIA属性の適切な付与 |
| カラーコントラスト | 4.5:1以上 |
| フォーカス表示 | 明確なフォーカスリング |
| グラフの代替テキスト | sr-onlyで数値情報を提供 |
| セレクタ操作 | キーボードナビゲーション対応（上下キー + Enter） |

## 関連ドキュメント

| ドキュメント | 内容 |
|------------|------|
| `ui/components/selector-spec.md` | セレクタコンポーネント仕様（Props/状態/バリアント/実装コード） |
| `ui/design-system.md` | デザインシステム（カラー/タイポグラフィ/スペーシング） |
| `ui/interactions/filter-behavior.md` | フィルタ動的挙動（ローディング/URL連動/依存関係） |
| `ui/interactions/responsive.md` | レスポンシブ対応（ブレイクポイント/モバイル表示） |
| `ui/interactions/drill-down.md` | ドリルダウン挙動 |
| `bigquery-etl-design.md` | mart層 ↔ UI要素のマッピング |
