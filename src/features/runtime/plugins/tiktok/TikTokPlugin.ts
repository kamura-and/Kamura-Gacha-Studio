import type {
  PluginId,
} from "@/features/plugins/types/plugin";

import type {
  PublishRuntimeEvent,
  RuntimePlugin,
} from "../../pluginRuntime/RuntimePlugin";

/**
 * TikTok LIVE RuntimePlugin。
 *
 * 現時点ではRuntimePluginとしての
 * ライフサイクルのみを提供する。
 *
 * TikTokとの通信はTikTokClientへ、
 * RuntimeEventへの変換は
 * TikTokEventMapperへ委譲する予定。
 */
export class TikTokPlugin
  implements RuntimePlugin {

  public readonly id: PluginId =
    "tiktok-live";

  private publish:
    PublishRuntimeEvent | undefined;

  /**
   * Pluginを開始する。
   */
  public start(
    publish: PublishRuntimeEvent,
  ): void {
    this.publish =
      publish;
  }

  /**
   * Pluginを停止する。
   */
  public stop(): void {
    this.publish =
      undefined;
  }

  /**
   * Pluginが開始済みか返す。
   */
  public isStarted(): boolean {
    return (
      this.publish !==
      undefined
    );
  }

  /**
   * RuntimeEventを発行する。
   *
   * 現在はMapperからのみ
   * 呼ばれる想定。
   */
  protected publishRuntimeEvent(
    event: Parameters<
      PublishRuntimeEvent
    >[0],
  ): void {
    this.requirePublish()(
      event,
    );
  }

  private requirePublish():
    PublishRuntimeEvent {

    if (
      this.publish ===
      undefined
    ) {
      throw new Error(
        'Plugin "tiktok-live" has not been started.',
      );
    }

    return this.publish;
  }
}