import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "@/app/layout/AppLayout";

import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { GachaPage } from "@/features/gacha/pages/GachaPage";
import { PluginManagerPage } from "@/features/plugins";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },

      {
        path: "gacha",
        element: <GachaPage />,
      },

      {
        path: "plugins",
        element: <PluginManagerPage />,
      },
    ],
  },
]);