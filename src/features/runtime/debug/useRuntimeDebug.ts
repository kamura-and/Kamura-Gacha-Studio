import {
  useCallback,
} from "react";

import {
  debugRuntime,
} from "./DebugRuntime";

import type {
  FakeGiftInput,
} from "../plugins/fake/FakePlugin";

/**
 * Debug用のFakePluginを操作するHook。
 *
 * Runtime Debug Panelなどから
 * 擬似RuntimeEventを送信するために使用する。
 */
export function useRuntimeDebug() {
  const emitGift =
    useCallback(
      (
        input: FakeGiftInput,
      ) => {
        return debugRuntime.fakePlugin.emitGift(
          input,
        );
      },
      [],
    );

  const isStarted =
    useCallback(
      () =>
        debugRuntime.fakePlugin.isStarted(),
      [],
    );

  return {
    emitGift,
    isStarted,
  };
}