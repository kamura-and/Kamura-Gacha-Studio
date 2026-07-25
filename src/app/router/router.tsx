import {
  createHashRouter,
  Navigate,
} from "react-router-dom";

import { AppLayout } from "@/app/layout/AppLayout";

import { DashboardPage } from "@/features/dashboard/DashboardPage";

import { EffectEditorPage } from "@/features/effects/pages/EffectEditorPage";
import { EffectListPage } from "@/features/effects/pages/EffectListPage";

import { PluginManagerPage } from "@/features/plugins";

import { QueuePage } from "@/features/queue/pages/QueuePage";

export const router = createHashRouter([
  {
    element: <AppLayout />,

    children: [
      {
        index: true,

        element: (
          <Navigate
            to="/home"
            replace
          />
        ),
      },

      {
        path: "home",

        element: <DashboardPage />,
      },

      {
        path: "effects",

        element: <EffectListPage />,
      },

      {
        path: "effects/new",

        element: <EffectEditorPage />,
      },

      {
        path: "effects/:effectId",

        element: <EffectEditorPage />,
      },

      {
        path: "queue",

        element: <QueuePage />,
      },

      {
        path: "plugins",

        element: <PluginManagerPage />,
      },

      {
        path: "*",

        element: (
          <Navigate
            to="/home"
            replace
          />
        ),
      },
    ],
  },
]);