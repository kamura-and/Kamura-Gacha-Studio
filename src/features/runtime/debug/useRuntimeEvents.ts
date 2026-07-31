import {
  useEffect,
  useState,
} from "react";

import {
  debugRuntime,
} from "./DebugRuntime";

import type {
  RuntimeEvent,
} from "../types/RuntimeEvent";

const DEFAULT_MAX_EVENT_COUNT =
  50;

/**
 * DebugRuntimeが保持している
 * RuntimeEvent履歴を表示するためのHook。
 *
 * ページを開いたときは保存済みの履歴を取得し、
 * 表示中はRuntimeEventBusを購読して
 * 新しい履歴へ更新する。
 */
export function useRuntimeEvents(
  maxEventCount:
    number =
    DEFAULT_MAX_EVENT_COUNT,
) {
  const [
    events,
    setEvents,
  ] = useState<
    RuntimeEvent[]
  >(() =>
    debugRuntime
      .getEventHistory()
      .slice(
        0,
        maxEventCount,
      ),
  );

  useEffect(
    () => {
      /**
       * ページを開く前に発生したイベントも
       * 表示できるよう、保存済み履歴を同期する。
       */
      const syncEvents =
        () => {
          setEvents(
            debugRuntime
              .getEventHistory()
              .slice(
                0,
                maxEventCount,
              ),
          );
        };

      syncEvents();

      const unsubscribe =
        debugRuntime.eventBus.subscribe(
          () => {
            /**
             * イベントそのものをReact Stateへ
             * 直接追加するのではなく、
             * DebugRuntimeの履歴を正として再取得する。
             */
            syncEvents();
          },
        );

      return unsubscribe;
    },
    [
      maxEventCount,
    ],
  );

  const clearEvents =
    () => {
      debugRuntime
        .clearEventHistory();

      setEvents(
        [],
      );
    };

  return {
    events,
    clearEvents,
  };
}