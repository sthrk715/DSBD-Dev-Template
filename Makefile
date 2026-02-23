# Claude Code Ops - 統一操作エントリポイント
.PHONY: help setup dev build test lint typecheck check \
	claude-ops-check eval onboarding metrics-report \
	mcp-check version-check token-check \
	deploy-stg security-audit

# デフォルトターゲット
help: ## ヘルプを表示
	@echo "=== Claude Code Ops Makefile ==="
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# === 開発コマンド ===

setup: ## 環境セットアップ
	npm install
	cp -n .env.example .env.local 2>/dev/null || true
	docker compose up -d
	npx prisma migrate dev
	@echo "Setup complete. Run 'make dev' to start."

dev: ## 開発サーバー起動
	npm run dev

build: ## プロダクションビルド
	npm run build

test: ## 全テスト実行
	npm run test

test-e2e: ## E2Eテスト実行
	npm run test:e2e

test-coverage: ## テストカバレッジ
	npm run test:coverage

lint: ## リントチェック
	npm run lint

typecheck: ## 型チェック
	npm run typecheck

format: ## コードフォーマット
	npm run format

check: lint typecheck test ## リント + 型チェック + テスト

# === Claude Code Ops コマンド ===

claude-ops-check: version-check token-check mcp-check ## Claude Code Ops全体チェック
	@echo ""
	@echo "=== All checks completed ==="

version-check: ## Claude Code CLIバージョン確認
	@bash .claudeops/scripts/manage-cli-version.sh check

token-check: ## CLAUDE.mdのトークン効率分析
	@bash .claudeops/scripts/token-optimizer-check.sh

mcp-check: ## MCPサーバー更新確認
	@bash .claudeops/scripts/check-mcp-updates.sh

eval: ## Golden Tests実行
	@bash .claudeops/evals/run-golden-test.sh

onboarding: ## 新メンバーオンボーディング
	@bash .claudeops/scripts/onboarding.sh

metrics-report: ## 週次メトリクスレポート生成
	@python3 .claudeops/scripts/generate-metrics-report.py

# === デプロイコマンド ===

deploy-stg: check ## ステージングデプロイ（テスト通過後）
	@echo "Deploying to staging..."
	gcloud builds submit --config=cloudbuild.yaml --substitutions=_ENV=staging

# === セキュリティコマンド ===

security-audit: ## セキュリティ監査（Claude Code使用）
	claude -p "OWASP Top 10の観点でsrc/配下のセキュリティ監査を実施" \
		--output-format json --max-turns 8 \
		--allowedTools "Read,Grep,Glob"
