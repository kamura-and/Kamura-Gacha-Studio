import { Outlet } from "react-router";
import { AppHeader } from "../components/layout/AppHeader";
import { AppSidebar } from "../components/layout/AppSidebar";
import { MobileNavigation } from "../components/layout/MobileNavigation";

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-transparent">
      <AppSidebar />

      <div className="min-w-0 flex-1">
        <AppHeader />
        <MobileNavigation />

        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}