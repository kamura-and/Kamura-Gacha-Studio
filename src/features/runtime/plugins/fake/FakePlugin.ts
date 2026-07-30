import type {
  PluginId,
} from "../../../plugins/types/plugin";

import type {
  PublishRuntimeEvent,
  RuntimePlugin,
} from "../../pluginRuntime/RuntimePlugin";

import type {
  RuntimeEvent,
} from "../../types/RuntimeEvent";

export type FakeGiftInput = {
  giftId: string;

  giftName?: string;

  userId: string;

  userName?: string;

  repeatCount?: number;

  diamondCount?: number;
};

/**
 * 開発・テスト用のRuntimePlugin。
 *
 * 外部サービスへ接続せず、
 * 任意のRuntimeEventをRuntimeへ発行できる。
 */
export class FakePlugin
  implements RuntimePlugin {
  public readonly id:
    PluginId =
    "fake";

  private publish:
    PublishRuntimeEvent | undefined;

  private eventSequence =
    0;

  /**
   * PluginRuntimeからイベント発行関数を受け取り、
   * FakePluginを開始状態にする。
   */
  public start(
    publish: PublishRuntimeEvent,
  ): void {
    this.publish =
      publish;
  }

  /**
   * FakePluginを停止する。
   *
   * 停止後はemit系メソッドを使用できない。
   */
  public stop(): void {
    this.publish =
      undefined;
  }

  /**
   * 任意のRuntimeEventを発行する。
   */
  public emit(
    event: RuntimeEvent,
  ): void {
    this.requirePublish()(
      event,
    );
  }

  /**
   * TikTokギフトを模したRuntimeEventを発行する。
   */
  public emitGift(
    input: FakeGiftInput,
  ): RuntimeEvent {
    const event:
      RuntimeEvent = {
      id:
        this.createEventId(),

      category:
        "gift",

      type:
        "gift.received",

      source: {
        kind:
          "plugin",

        pluginId:
          this.id,
      },

      payload: {
        giftId:
          input.giftId,

        giftName:
          input.giftName ??
          input.giftId,

        userId:
          input.userId,

        userName:
          input.userName ??
          input.userId,

        repeatCount:
          input.repeatCount ??
          1,

        diamondCount:
          input.diamondCount ??
          0,
      },

      occurredAt:
        Date.now(),

      metadata: {
        tags: [
          "simulated",
          "fake-plugin",
        ],
      },
    };

    this.emit(
      event,
    );

    return event;
  }

  /**
   * 現在FakePluginが開始状態か返す。
   */
  public isStarted(): boolean {
    return (
      this.publish !==
      undefined
    );
  }

  private requirePublish():
    PublishRuntimeEvent {
    if (
      this.publish ===
      undefined
    ) {
      throw new Error(
        'Plugin "fake-plugin" has not been started.',
      );
    }

    return this.publish;
  }

  private createEventId():
    string {
    this.eventSequence +=
      1;

    return [
      this.id,
      Date.now(),
      this.eventSequence,
    ].join(
      "-",
    );
  }
}