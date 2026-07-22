import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="text-center">
        <p className="text-sm font-semibold text-violet-600">404</p>

        <h1 className="mt-2 text-3xl font-bold text-zinc-900">
          ページが見つかりません
        </h1>

        <p className="mt-3 text-sm text-zinc-500">
          URLが正しいか確認してください。
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex rounded-2xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-500"
        >
          Dashboardへ戻る
        </Link>
      </div>
    </main>
  );
}