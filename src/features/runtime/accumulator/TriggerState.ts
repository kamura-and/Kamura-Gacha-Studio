export type TriggerCounterState = {
  /**
   * 現在の累計値。
   */
  totalCount: number;

  /**
   * このスコープで発動した回数。
   */
  activationCount: number;

  /**
   * once-thresholdが
   * すでに発動したか。
   */
  activated: boolean;
};

export type TriggerState = {
  triggerId: string;

  /**
   * globalまたはユーザーIDごとの状態。
   */
  counters: Record<
    string,
    TriggerCounterState
  >;
};

export function createTriggerCounterState():
  TriggerCounterState {
  return {
    totalCount: 0,
    activationCount: 0,
    activated: false,
  };
}

export function cloneTriggerState(
  state: TriggerState,
): TriggerState {
  return {
    triggerId: state.triggerId,

    counters: Object.fromEntries(
      Object.entries(
        state.counters,
      ).map(
        ([key, counter]) => [
          key,
          {
            ...counter,
          },
        ],
      ),
    ),
  };
}