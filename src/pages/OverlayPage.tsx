export function OverlayPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-transparent p-8">
      <div className="rounded-3xl border border-violet-200 bg-white/90 px-10 py-8 text-center shadow-xl backdrop-blur">
        <p className="text-sm font-semibold text-violet-600">
          Kamura Gacha Studio
        </p>

        <h1 className="mt-2 text-3xl font-bold text-zinc-900">
          Overlay Preview
        </h1>

        <p className="mt-3 text-sm text-zinc-500">
          この画面は今後、配信用オーバーレイになります。
        </p>
      </div>
    </main>
  );
}