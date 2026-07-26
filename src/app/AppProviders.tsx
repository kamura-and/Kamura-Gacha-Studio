import {
  useEffect,
  type ReactNode,
} from "react";

import {
  runtimeBootstrap,
} from "@/features/runtime/bootstrap/RuntimeBootstrap";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({
  children,
}: AppProvidersProps) {
  useEffect(() => {
    runtimeBootstrap.start();

    return () => {
      void runtimeBootstrap
        .stop()
        .catch((error: unknown) => {
          console.error(
            "[AppProviders] Runtimeの終了処理に失敗しました。",
            error,
          );
        });
    };
  }, []);

  return <>{children}</>;
}