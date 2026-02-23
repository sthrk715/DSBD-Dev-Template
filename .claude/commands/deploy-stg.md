ステージングデプロイ手順:
1. npm run lint で全リント警告がゼロであることを確認
2. npm run typecheck で型チェックがパスすることを確認
3. npm run test で全テスト通過を確認
4. npm run build でビルド成功を確認
5. gcloud builds submit --config=cloudbuild.yaml --substitutions=_ENV=staging
6. ステージングURLにアクセスして動作確認
7. 結果を報告
