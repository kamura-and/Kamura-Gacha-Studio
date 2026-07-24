import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

type SidebarItemProps = {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
};

export function SidebarItem({
  to,
  label,
  icon: Icon,
  end = false,
}: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          "group relative flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5",
          "text-sm font-bold transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-violet-400 focus-visible:ring-offset-2",
          isActive
            ? "bg-violet-50 text-violet-700"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          <span
            aria-hidden="true"
            className={[
              "absolute inset-y-2 left-0 w-1 rounded-r-full",
              "transition-opacity duration-150",
              isActive
                ? "bg-violet-600 opacity-100"
                : "opacity-0",
            ].join(" ")}
          />

          <Icon
            size={19}
            strokeWidth={2.2}
            aria-hidden="true"
            className={[
              "shrink-0 transition-colors duration-150",
              isActive
                ? "text-violet-600"
                : "text-slate-400 group-hover:text-slate-700",
            ].join(" ")}
          />

          <span className="truncate">{label}</span>
        </>
      )}
    </NavLink>
  );
}