import { Route, Routes } from "react-router";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { GachaPage } from "@/features/gacha/GachaPage";
import { GiftsPage } from "@/features/gifts/GiftsPage";
import { OverlayPage } from "@/features/overlay/OverlayPage";
import { SettingsPage } from "@/features/settings/SettingsPage";
import { StatisticsPage } from "@/features/statistics/StatisticsPage";
import { NotFoundPage } from "@/features/system/NotFoundPage";
import { AppLayout } from "@/layouts/AppLayout";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="gacha" element={<GachaPage />} />
        <Route path="gifts" element={<GiftsPage />} />
        <Route path="statistics" element={<StatisticsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="/overlay" element={<OverlayPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}