import {
  Blocks,
  Bug,
  CircleDotDashed,
  Gift,
  History,
  Home,
  ListTodo,
  PackageOpen,
  Settings,
  Zap,
  type LucideIcon,
} from "lucide-react";

import {
  SidebarItem,
} from "@/app/layout/SidebarItem";

type NavigationItem = {
  to: string;

  label: string;

  icon: LucideIcon;

  end?: boolean;
};

const mainNavigationItems:
  NavigationItem[] = [
  {
    to: "/home",

    label: "ホーム",

    icon: Home,
  },

  {
    to: "/effects",

    label: "景品",

    icon: Gift,
  },

  {
    to: "/pools",

    label: "ガチャ箱",

    icon: PackageOpen,
  },

  {
    to: "/triggers",

    label: "発動条件",

    icon: Zap,
  },
];

const operationNavigationItems:
  NavigationItem[] = [
  {
    to: "/queue",

    label: "実行キュー",

    icon: ListTodo,
  },

  {
    to: "/logs",

    label: "実行履歴",

    icon: History,
  },
];

const systemNavigationItems:
  NavigationItem[] = [
  {
    to: "/plugins",

    label: "プラグイン",

    icon: Blocks,
  },

  {
    to: "/runtime-debug",

    label: "デバッグ",

    icon: Bug,
  },

  {
    to: "/settings",

    label: "設定",

    icon: Settings,
  },
];

export function Sidebar() {
  return (
    <aside className="flex h-full min-h-0 w-full flex-col border-r border-slate-200 bg-white">
      <div className="flex h-20 shrink-0 items-center border-b border-slate-100 px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-sm shadow-violet-200">
            <CircleDotDashed
              size={21}
              strokeWidth={2.4}
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-black tracking-tight text-slate-950">
              Kamura
            </p>

            <p className="truncate text-xs font-bold text-slate-400">
              Gacha Studio
            </p>
          </div>
        </div>
      </div>

      <nav
        aria-label="メインナビゲーション"
        className="min-h-0 flex-1 overflow-y-auto px-3 py-5"
      >
        <NavigationGroup
          label="コンテンツ"
          items={
            mainNavigationItems
          }
        />

        <NavigationGroup
          label="運用"
          items={
            operationNavigationItems
          }
          className="mt-7"
        />

        <NavigationGroup
          label="システム"
          items={
            systemNavigationItems
          }
          className="mt-7"
        />
      </nav>

      <div className="shrink-0 border-t border-slate-100 p-4">
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          <p className="text-xs font-black text-slate-700">
            Kamura Gacha Studio
          </p>

          <p className="mt-1 text-[11px] font-medium text-slate-400">
            バージョン 0.0.0
          </p>
        </div>
      </div>
    </aside>
  );
}

type NavigationGroupProps = {
  label: string;

  items:
    NavigationItem[];

  className?: string;
};

function NavigationGroup({
  label,
  items,
  className = "",
}: NavigationGroupProps) {
  return (
    <section
      className={
        className
      }
    >
      <h2 className="mb-2 px-3 text-[11px] font-black tracking-[0.14em] text-slate-400">
        {label}
      </h2>

      <div className="space-y-1">
        {items.map(
          (item) => (
            <SidebarItem
              key={
                item.to
              }
              to={
                item.to
              }
              label={
                item.label
              }
              icon={
                item.icon
              }
              end={
                item.end
              }
            />
          ),
        )}
      </div>
    </section>
  );
}