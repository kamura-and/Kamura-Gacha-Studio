import { createBrowserRouter } from "react-router-dom";

import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { AppLayout } from "@/layouts/AppLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
    ],
  },
]);