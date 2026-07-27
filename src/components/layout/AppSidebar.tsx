import {
  BarChart3,
  Blocks,
  Boxes,
  Gift,
  LayoutDashboard,
  Settings,
  Sparkles,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navigationItems = [
  {
    label: "ダッシュボード",
    path: "/home",
    icon: LayoutDashboard,
  },
  {
    label: "ガチャ設定",
    path: "/gacha",
    icon: Sparkles,
  },
  {
    label: "ギフト設定",
    path: "/gifts",
    icon: Gift,
  },
  {
    label: "プラグイン",
    path: "/plugins",
    icon: Blocks,
  },
  {
    label: "統計",
    path: "/statistics",
    icon: BarChart3,
  },
  {
    label: "設定",
    path: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <aside className="hidden min-h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
      {/* ロゴ */}
      <div className="flex h-20 items-center gap-3 border-b border-slate-200 px-5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 text-white shadow-lg shadow-violet-600/25">
          <Boxes
            aria-hidden="true"
            size={22}
          />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-bold tracking-tight text-slate-900">
            Kamura Gacha
          </p>

          <p className="text-xs font-medium text-slate-500">
            Studio
          </p>
        </div>
      </div>

      {/* メニュー */}
      <nav className="flex-1 space-y-1.5 px-3 py-5">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                [
                  "group flex min-h-12 items-center gap-3 rounded-2xl px-3 text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-md shadow-violet-600/20"
                    : "text-slate-600 hover:bg-violet-50 hover:text-violet-700",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={[
                      "flex size-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-white/15 text-white"
                        : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-violet-600",
                    ].join(" ")}
                  >
                    <Icon
                      aria-hidden="true"
                      size={18}
                    />
                  </span>

                  <span className="truncate">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ステータス */}
      <div className="p-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-violet-100">
              <span className="size-2.5 rounded-full bg-violet-600 shadow-[0_0_10px_rgba(124,58,237,0.55)]" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-slate-800">
                Kamura Gacha Studio
              </p>

              <p className="mt-0.5 text-xs text-slate-400">
                Version 0.1.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}