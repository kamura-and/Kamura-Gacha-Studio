import { Outlet } from "react-router-dom";

import { Sidebar } from "@/app/layout/Sidebar";

export function AppLayout() {
  return (
    <div className="h-screen min-h-0 overflow-hidden bg-slate-100 text-slate-950">
      <div className="grid h-full min-h-0 grid-cols-[240px_minmax(0,1fr)]">
        <Sidebar />

        <div className="min-h-0 min-w-0 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}