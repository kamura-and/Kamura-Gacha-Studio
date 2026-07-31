export type PluginStatus = {
  id: string;
  started: boolean;
};

export type PluginContext = {
  emit: (
    type: string,
    payload?: Record<string, unknown>,
  ) => void;

  log: (message: string) => void;
};

export interface Plugin {
  readonly id: string;

  start(
    context: PluginContext,
  ): Promise<void> | void;

  stop(): Promise<void> | void;

  isStarted(): boolean;
}