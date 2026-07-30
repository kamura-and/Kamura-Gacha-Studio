import type {
  RuntimeEvent,
  RuntimeEventListener,
} from "../types/RuntimeEvent";

export type RuntimeEventUnsubscribe =
  () => void;

/**
 * RuntimeEventを登録済みListenerへ通知する。
 *
 * 責務：
 *
 * - Listenerの登録
 * - RuntimeEventの配信
 * - Listenerの解除
 *
 * Trigger判定やRuntime処理は行わない。
 */
export class RuntimeEventBus {
  private readonly listeners =
    new Set<RuntimeEventListener>();

  /**
   * RuntimeEventListenerを登録する。
   *
   * 戻り値の関数を呼ぶと、
   * 登録したListenerを解除できる。
   */
  public subscribe(
    listener: RuntimeEventListener,
  ): RuntimeEventUnsubscribe {
    this.listeners.add(
      listener,
    );

    let subscribed = true;

    return () => {
      if (!subscribed) {
        return;
      }

      subscribed = false;

      this.listeners.delete(
        listener,
      );
    };
  }

  /**
   * 登録されているすべてのListenerへ
   * RuntimeEventを通知する。
   *
   * 配信開始時点のListener一覧を複製してから
   * 順番に実行する。
   *
   * そのため、通知中にsubscribeやunsubscribeが
   * 呼ばれても、現在の配信処理には影響しない。
   */
  public publish(
    event: RuntimeEvent,
  ): void {
    const listeners =
      Array.from(
        this.listeners,
      );

    listeners.forEach(
      (listener) => {
        listener(event);
      },
    );
  }

  /**
   * すべてのListenerを解除する。
   */
  public clear(): void {
    this.listeners.clear();
  }

  /**
   * 現在登録されているListener数を返す。
   */
  public listenerCount(): number {
    return this.listeners.size;
  }
}

export const runtimeEventBus =
  new RuntimeEventBus();