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

export function MobileNavigation() {
  return (
    <nav
      aria-label="モバイルナビゲーション"
      className="overflow-x-auto border-b border-zinc-200/70 bg-white/70 px-4 py-3 backdrop-blur lg:hidden"
    >
      <div className="flex min-w-max gap-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                [
                  "flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-violet-600 text-white"
                    : "bg-white text-zinc-500 shadow-sm hover:text-violet-700",
                ].join(" ")
              }
            >
              <Icon aria-hidden="true" size={16} />
              {item.label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}