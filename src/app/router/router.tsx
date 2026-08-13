import {
  createHashRouter,
  Navigate,
} from "react-router-dom";

import { AppLayout } from "@/app/layout/AppLayout";

import { DashboardPage } from "@/features/dashboard/DashboardPage";

import { EffectEditorPage } from "@/features/effects/pages/EffectEditorPage";
import { EffectListPage } from "@/features/effects/pages/EffectListPage";

import { ExecutionHistoryPage } from "@/features/history/pages/ExecutionHistoryPage";

import { PoolPage } from "@/features/pools/pages/PoolPage";

import { PluginManagerPage } from "@/features/plugins";

import { QueuePage } from "@/features/queue/pages/QueuePage";

import { TriggerPage } from "@/features/triggers/pages/TriggerPage";

import {
  RuntimeDebugPage,
} from "@/features/runtime/debug/pages/RuntimeDebugPage";

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
        path: "pools",

        element: <PoolPage />,
      },

      {
        path: "triggers",

        element: <TriggerPage />,
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
        path: "logs",

        element: (
          <ExecutionHistoryPage />
        ),
      },

      {
        path: "plugins",

        element: <PluginManagerPage />,
      },

      {
        path: "runtime-debug",

        element: (
          <RuntimeDebugPage />
        ),
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