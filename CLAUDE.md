# CLAUDE.md

## 1. プロジェクト概要
GCPベースのWebダッシュボードサービス。Cloud Run上にデプロイ。
BigQueryの分析データを可視化するダッシュボードを提供する。

## 2. ドキュメント参照ルール
- 新しいタスクに着手する前に必ず docs/ 配下の関連ドキュメントを読むこと
- 要件の不明点はIssueにコメントして確認を求めること（勝手に判断しない）
- UI実装前に必ず docs/02_design/ui/ の該当画像・仕様を確認すること

## 3. 技術スタック
- フロントエンド: Next.js (App Router) + TypeScript
- UIライブラリ: shadcn/ui + Tailwind CSS
- チャート: Recharts
- バックエンド: Next.js API Routes
- DB: BigQuery（分析データ）+ Cloud SQL PostgreSQL（アプリデータ）
- ORM: Prisma
- 認証: NextAuth.js (Google OAuth)
- 状態管理: Zustand
- バリデーション: Zod
- インフラ: Terraform管理、Cloud Run デプロイ
- テスト: Vitest（unit/integration）+ Playwright（E2E）

## 4. コマンド
- ビルド: `npm run build`
- 開発サーバー: `npm run dev`
- テスト全体: `npm run test`
- 単一テスト: `npx vitest run --testPathPattern="[name]"`
- E2Eテスト: `npm run test:e2e`
- カバレッジ: `npm run test:coverage`
- リント: `npm run lint`
- 型チェック: `npm run typecheck`
- フォーマット: `npm run format`

## 5. コーディング規約
- TypeScript strict mode必須
- any型の使用禁止（unknown + 型ガードを使用）
- 関数30行以内、ネスト3段以内
- 循環的複雑度10以下
- ファイル300行以下
- 1ファイル1コンポーネント
- ESLint / Prettierの設定に従うこと

## 6. セキュリティルール（必須遵守）
### 禁止事項
- APIキー/トークン/パスワードのハードコード
- eval() の使用
- innerHTML への直接代入
- SQL文字列結合（パラメタライズドクエリ必須）
- .envファイルのコミット（Secret Manager経由）
- console.logでのシークレット出力
- BigQueryへの直接書き込み（読み取り専用）

### 必須事項
- ユーザー入力のバリデーション（zodスキーマ推奨）
- 認証必須APIには認証ミドルウェアを適用
- エラーメッセージに内部情報を含めない
- CSP/CORSヘッダーを明示設定
- BigQueryクエリはパラメータ化クエリを使用（SQLインジェクション防止）
- API Routeは必ずエラーハンドリングを実装

## 7. Git操作ルール
- コミットメッセージはConventional Commits形式
- mainへの直接push禁止
- force push禁止
- ファイルは個別にstage（git add -A 禁止）
- .env, credentials含むファイルのコミット禁止
- PRには変更内容の説明とテスト結果を含めること
- Closes #XX でIssueと紐づけること

## 8. UI実装ルール
- 新しい画面を実装する前に必ず docs/02_design/ui/wireframes/ の該当画像を確認すること
- デザインの色・フォント・余白は docs/02_design/ui/design-system.md に従うこと
- コンポーネントは docs/02_design/ui/components/ の画像を参照して実装すること
- 動的な挙動は docs/02_design/ui/interactions/ の仕様に従うこと
- 画面の各状態（通常・ローディング・データ0件・エラー）全てを実装すること
- デザインに記載がない場合は勝手に判断せずIssueで確認を求めること

## 9. テストルール
- 新規機能には必ずユニットテストを付けること
- API Routeには結合テストを書くこと
- TDDサイクル遵守（Red→Green→Refactor→Verify）
- カバレッジ80%以上維持
- モック/スタブは必要最小限
- テスト名は「〜の場合、〜となること」形式

## 10. パッケージ管理
- package.jsonへの新規パッケージ追加は事前にIssueで承認を取ること

## 11. AI生成コード記録
- コミットメッセージにAI利用を記録
- Co-Authored-By: Claude Code <noreply@anthropic.com>
