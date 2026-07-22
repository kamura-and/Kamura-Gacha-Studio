import {
  BarChart3,
  Boxes,
  Gift,
  LayoutDashboard,
  Settings,
  Sparkles,
} from "lucide-react";
import { NavLink } from "react-router";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Gacha",
    path: "/gacha",
    icon: Sparkles,
  },
  {
    label: "Gifts",
    path: "/gifts",
    icon: Gift,
  },
  {
    label: "Statistics",
    path: "/statistics",
    icon: BarChart3,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-zinc-200/70 bg-white/80 backdrop-blur-xl lg:flex lg:flex-col">
      <div className="flex h-20 items-center gap-3 border-b border-zinc-200/70 px-6">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/20">
          <Boxes aria-hidden="true" size={21} />
        </div>

        <div>
          <p className="text-sm font-bold tracking-tight text-zinc-900">
            Kamura Gacha
          </p>

          <p className="text-xs text-zinc-500">Studio</p>
        </div>
      </div>

      <nav
        aria-label="メインナビゲーション"
        className="flex-1 space-y-1.5 px-4 py-6"
      >
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                [
                  "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                    : "text-zinc-500 hover:bg-violet-50 hover:text-violet-700",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    aria-hidden="true"
                    size={19}
                    strokeWidth={isActive ? 2.3 : 2}
                  />

                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4">
        <div className="rounded-3xl border border-violet-100 bg-violet-50/80 p-4">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-amber-400" />

            <p className="text-xs font-semibold text-zinc-700">
              TikTok LIVE
            </p>
          </div>

          <p className="mt-2 text-xs leading-5 text-zinc-500">
            現在は未接続です。接続機能は今後のリリースで追加します。
          </p>
        </div>
      </div>
    </aside>
  );
}