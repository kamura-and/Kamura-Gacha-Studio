import type {
  RuntimeEvent,
} from "../types/RuntimeEvent";

export type PublishRuntimeEvent =
  (event: RuntimeEvent) => void;

/**
 * RuntimeへRuntimeEventを供給するPlugin。
 */
export interface RuntimePlugin {
  /**
   * Pluginを一意に識別するID。
   */
  readonly id: string;

  /**
   * Pluginを開始する。
   */
  start(
    publish: PublishRuntimeEvent,
  ): void;

  /**
   * Pluginを停止する。
   */
  stop(): void;
}