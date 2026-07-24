import {
  createHashRouter,
  Navigate,
} from "react-router-dom";

import { AppLayout } from "@/app/layout/AppLayout";
import { CurrentWorkspacePage } from "@/app/router/CurrentWorkspacePage";
import { QueuePage } from "@/features/queue/pages/QueuePage";

export const router = createHashRouter([
  {
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: (
          <Navigate
            to="/effects"
            replace
          />
        ),
      },
      {
        path: "effects",
        element: <CurrentWorkspacePage />,
      },
      {
        path: "queue",
        element: <QueuePage />,
      },
      {
        path: "*",
        element: (
          <Navigate
            to="/effects"
            replace
          />
        ),
      },
    ],
  },
]);