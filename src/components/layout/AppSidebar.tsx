import {
  BarChart3,
  Gift,
  LayoutDashboard,
  Settings,
  Sparkles,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navigationItems = [
  {
    label: "ダッシュボード",
    path: "/",
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
    <aside className="flex min-h-screen w-56 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-20 items-center border-b border-slate-200 px-5">
        <div>
          <p className="text-sm font-bold text-slate-900">
            Kamura Gacha
          </p>
          <p className="text-xs text-slate-500">Studio</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-3">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition",
                  isActive
                    ? "bg-violet-600 text-white"
                    : "text-slate-600 hover:bg-violet-50 hover:text-violet-700",
                ].join(" ")
              }
            >
              <Icon aria-hidden="true" size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <p className="text-xs font-semibold text-slate-700">
          Kamura Gacha Studio
        </p>
        <p className="mt-1 text-xs text-slate-400">v0.1.0</p>
      </div>
    </aside>
  );
}