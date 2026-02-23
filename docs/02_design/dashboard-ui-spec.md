# フロントエンド実装仕様書

## チャートライブラリ

- ライブラリ: **Recharts** (React向け宣言的チャートライブラリ)
- 使用グラフ種別:

| グラフ種別 | コンポーネント | 用途 | データソース (mart層) |
|-----------|-------------|------|---------------------|
| 折れ線グラフ | LineChart | 日次売上トレンド | mart_sales_daily |
| 棒グラフ | BarChart | 月次比較・セグメント比較 | mart_sales_monthly, mart_customer_segments |
| 円グラフ | PieChart | カテゴリ構成比 | mart_category_summary |
| エリアチャート | AreaChart | 累積売上推移 | mart_sales_daily |

## コンポーネント設計

shadcn/ui ベースのAtomic Design:

```
src/
├── components/
│   ├── ui/                    # shadcn/ui基盤（Atoms）
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── popover.tsx
│   │   ├── calendar.tsx
│   │   ├── checkbox.tsx
│   │   ├── toggle-group.tsx
│   │   ├── command.tsx
│   │   └── ...
│   ├── atoms/                 # プロジェクト固有Atoms
│   │   ├── kpi-value.tsx
│   │   ├── trend-indicator.tsx  # ↑↓→ トレンド表示
│   │   └── status-badge.tsx
│   ├── molecules/             # Molecules
│   │   ├── kpi-card.tsx
│   │   ├── filter-select.tsx         # → セレクタ仕様: ui/components/selector-spec.md
│   │   ├── filter-multi-select.tsx   # → 同上
│   │   ├── date-range-picker.tsx     # → 同上
│   │   ├── period-selector.tsx       # → 同上
│   │   └── searchable-select.tsx     # → 同上
│   ├── organisms/             # Organisms
│   │   ├── dashboard-header.tsx
│   │   ├── chart-container.tsx
│   │   ├── filter-bar.tsx     # 全セレクタを統合配置
│   │   └── data-table.tsx
│   ├── templates/             # Templates
│   │   ├── dashboard-layout.tsx
│   │   └── settings-layout.tsx
│   └── pages/                 # Pages（App Routerのpage.tsx）
```

**セレクタコンポーネント詳細仕様:** `docs/02_design/ui/components/selector-spec.md`

## 状態管理

- **Zustand** を使用（軽量でボイラープレート最小）
- ストア分割:
  - `useFilterStore` - フィルタ状態（期間・チャネル・カテゴリ・地域・表示期間）
  - `useUserStore` - ユーザー情報
  - `useDashboardStore` - ダッシュボード設定
- サーバー状態は **TanStack Query** で管理

### useFilterStore定義

```typescript
// src/stores/filter-store.ts — 詳細: ui/components/selector-spec.md
interface FilterState {
  dateRange: { from: Date; to: Date }
  preset: string             // last7d, last30d, last90d, thisMonth, lastMonth, thisQuarter, custom
  channel: string            // web, store, api, '' (全て)
  categoryL1: string         // 大カテゴリ, '' (全て)
  regions: string[]          // 地域コード配列 ([] = 全て)
  period: 'daily' | 'weekly' | 'monthly'
}
```

## フィルタ・パラメータ管理

- URLクエリパラメータと連動（ブックマーク可能）
- フィルタ変更時: 即時反映（DateRangePickerのみ「適用」ボタン付き）
- デフォルト値: 直近30日、チャネル=全て、カテゴリ=全て、地域=全て、期間=日次
- リセットボタン: 全フィルタをデフォルト値に戻す + URLパラメータクリア

```
/dashboard/1?from=2026-01-15&to=2026-02-14&preset=last30d&channel=web&category=electronics&regions=JP-13,JP-27&period=daily
```

## KPIカード仕様

4枚のKPIカードをダッシュボード上部に横並び表示。

| # | KPI名 | 単位 | データソース | 表示例 |
|---|-------|------|------------|--------|
| 1 | 売上合計 | 円 | mart_kpi_summary (total_sales) | ¥12,500,000 (+5.2%) ↑ |
| 2 | 注文件数 | 件 | mart_kpi_summary (order_count) | 1,847件 (-2.1%) ↓ |
| 3 | ユニーク顧客数 | 人 | mart_kpi_summary (unique_customers) | 1,203人 (+8.7%) ↑ |
| 4 | 平均注文額 | 円 | mart_kpi_summary (avg_order_value) | ¥6,768 (+0.3%) → |

### KPIカードコンポーネント

```
┌────────────────────┐
│ 売上合計            │
│ ¥12,500,000        │  ← text-2xl font-bold
│ +5.2% ↑            │  ← text-green-600 (up) / text-red-600 (down) / text-gray-500 (flat)
│ 前日比              │
└────────────────────┘
```

## ダークモード対応

- 初回リリースでは非対応（Phase 2で検討）
- 実装方式: Tailwind CSS `dark:` プレフィックス
- 切替: システム設定に追従 + 手動切替

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
| タッチ操作 | タップ領域 44x44px以上 |

## 関連ドキュメント

| ドキュメント | 内容 |
|------------|------|
| `ui/components/selector-spec.md` | セレクタコンポーネント仕様（Props/状態/バリアント/実装コード） |
| `ui/design-system.md` | デザインシステム（カラー/タイポグラフィ/スペーシング） |
| `ui/interactions/filter-behavior.md` | フィルタ動的挙動（ローディング/URL連動/依存関係） |
| `ui/interactions/responsive.md` | レスポンシブ対応（ブレイクポイント/モバイル表示） |
| `ui/interactions/drill-down.md` | ドリルダウン挙動 |
| `bigquery-etl-design.md` | mart層 ↔ UI要素のマッピング |
