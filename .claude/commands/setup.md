環境セットアップ手順:
1. npm install で依存パッケージをインストール
2. .env.example をコピーして .env.local を作成
3. docker compose up -d でローカルDB（PostgreSQL + Redis）起動
4. npx prisma migrate dev でDBマイグレーション実行
5. npm run dev で開発サーバー起動
6. http://localhost:3000 でアクセス確認
