import { Bell, ExternalLink, Play, Settings2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/gacha": "Gacha",
  "/gifts": "Gifts",
  "/statistics": "Statistics",
  "/settings": "Settings",
};

export function AppHeader() {
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] ?? "Kamura Gacha Studio";

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200/70 bg-white/75 backdrop-blur-xl">
      <div className="flex min-h-20 items-center justify-between gap-4 px-5 md:px-8">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-violet-600 lg:hidden">
            Kamura Gacha Studio
          </p>

          <h1 className="truncate text-xl font-bold tracking-tight text-zinc-900">
            {pageTitle}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/overlay"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 sm:flex"
          >
            <ExternalLink aria-hidden="true" size={17} />
            Overlay
          </Link>

          <button
            type="button"
            aria-label="通知"
            className="flex size-10 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-500 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
          >
            <Bell aria-hidden="true" size={18} />
          </button>

          <Link
            to="/settings"
            aria-label="設定を開く"
            className="flex size-10 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-500 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
          >
            <Settings2 aria-hidden="true" size={18} />
          </Link>

          <button
            type="button"
            className="flex items-center gap-2 rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-600/20 transition hover:bg-violet-500 active:scale-[0.98]"
          >
            <Play aria-hidden="true" size={16} fill="currentColor" />
            <span className="hidden sm:inline">プレイ</span>
          </button>
        </div>
      </div>
    </header>
  );
}