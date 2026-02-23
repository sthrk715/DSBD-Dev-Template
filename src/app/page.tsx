import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="mb-8 text-4xl font-bold">[TODO: プロジェクト名] Dashboard</h1>
      <p className="mb-8 text-lg text-gray-600">
        AI駆動開発テンプレートから作成されたダッシュボードアプリケーション
      </p>
      <Link
        href="/dashboard"
        className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
      >
        ダッシュボードへ
      </Link>
    </main>
  )
}
