import { BrowserRouter, Route, Routes } from "react-router";
import { AppLayout } from "./layouts/AppLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { GachaPage } from "./pages/GachaPage";
import { GiftsPage } from "./pages/GiftsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { OverlayPage } from "./pages/OverlayPage";
import { SettingsPage } from "./pages/SettingsPage";
import { StatisticsPage } from "./pages/StatisticsPage";

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;