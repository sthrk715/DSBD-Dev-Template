# デザインシステム定義

## カラーパレット

### ブランドカラー
| 名称 | HEX | 用途 |
|------|-----|------|
| Primary | #2563EB | ボタン、リンク、アクティブ状態 |
| Primary Dark | #1D4ED8 | ホバー状態 |
| Primary Light | #DBEAFE | 背景ハイライト |
| Secondary | #64748B | サブ要素、補助テキスト |

### セマンティックカラー
| 名称 | HEX | 用途 |
|------|-----|------|
| Success | #16A34A | 成功メッセージ、正の変化 |
| Error | #DC2626 | エラー、負の変化 |
| Warning | #F59E0B | 警告、注意 |
| Info | #0EA5E9 | 情報、ニュートラルな通知 |

### 背景・テキスト
| 名称 | HEX (Light) | HEX (Dark) | 用途 |
|------|------------|------------|------|
| Background | #FFFFFF | #0F172A | ページ背景 |
| Surface | #F8FAFC | #1E293B | カード背景 |
| Border | #E2E8F0 | #334155 | ボーダー |
| Text Primary | #0F172A | #F8FAFC | 見出し・本文 |
| Text Secondary | #64748B | #94A3B8 | 補助テキスト |
| Text Muted | #94A3B8 | #64748B | 非活性テキスト |

## フォント

| 種別 | フォント | サイズ | 行高 | ウェイト |
|------|---------|--------|------|---------|
| H1 | Inter / Noto Sans JP | 30px | 36px | 700 (Bold) |
| H2 | Inter / Noto Sans JP | 24px | 32px | 600 (SemiBold) |
| H3 | Inter / Noto Sans JP | 20px | 28px | 600 (SemiBold) |
| Body | Inter / Noto Sans JP | 14px | 20px | 400 (Regular) |
| Body Small | Inter / Noto Sans JP | 12px | 16px | 400 (Regular) |
| Caption | Inter / Noto Sans JP | 11px | 14px | 400 (Regular) |
| KPI Value | Inter | 36px | 40px | 700 (Bold) |

## 余白ルール（8pxグリッド）

| トークン | 値 | 用途 |
|---------|---|------|
| space-1 | 4px | インライン要素間 |
| space-2 | 8px | コンポーネント内パディング（小） |
| space-3 | 12px | アイコンとテキスト間 |
| space-4 | 16px | コンポーネント内パディング（標準） |
| space-5 | 20px | カード内パディング |
| space-6 | 24px | セクション間（小） |
| space-8 | 32px | セクション間（標準） |
| space-10 | 40px | セクション間（大） |
| space-12 | 48px | ページ上下余白 |

## 角丸 (border-radius)

| トークン | 値 | 用途 |
|---------|---|------|
| rounded-sm | 4px | バッジ、タグ |
| rounded-md | 6px | ボタン、入力フィールド |
| rounded-lg | 8px | カード |
| rounded-xl | 12px | モーダル、ダイアログ |
| rounded-full | 9999px | アバター、丸ボタン |

## シャドウ (box-shadow)

| トークン | 値 | 用途 |
|---------|---|------|
| shadow-sm | 0 1px 2px rgba(0,0,0,0.05) | カード（通常） |
| shadow-md | 0 4px 6px rgba(0,0,0,0.07) | カード（ホバー） |
| shadow-lg | 0 10px 15px rgba(0,0,0,0.1) | ドロップダウン、モーダル |

## アイコンセット

- ライブラリ: **Lucide React**
- サイズ: 16px (インライン), 20px (ボタン内), 24px (ナビゲーション)
- ストロークウィドス: 2px

## Tailwind CSS カスタムテーマ

```typescript
// tailwind.config.ts に反映
{
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#2563EB', dark: '#1D4ED8', light: '#DBEAFE' },
        secondary: '#64748B',
        success: '#16A34A',
        error: '#DC2626',
        warning: '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans JP', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '6px',
      },
    },
  },
}
```
