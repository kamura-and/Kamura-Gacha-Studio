import {
  createRuntimeEventId,
} from "./createRuntimeEventId";

import type {
  RuntimeEvent,
  RuntimeEventInput,
  RuntimeEventListener,
  RuntimeEventSubscriptionOptions,
} from "./RuntimeEvent";

type Subscription = {
  listener: RuntimeEventListener;
  options: RuntimeEventSubscriptionOptions;
};

export class RuntimeEventDispatcher {
  private readonly subscriptions =
    new Set<Subscription>();

  public publish<TPayload>(
    input: RuntimeEventInput<TPayload>,
  ): RuntimeEvent<TPayload> {
    const event: RuntimeEvent<TPayload> = {
      id: createRuntimeEventId(),
      category: input.category,
      type: input.type,
      source: input.source,
      payload: input.payload,
      occurredAt:
        input.occurredAt ??
        Date.now(),
      metadata: {
        ...input.metadata,
        tags:
          input.metadata?.tags !==
          undefined
            ? [
                ...input.metadata
                  .tags,
              ]
            : undefined,
      },
    };

    this.dispatch(event);

    return event;
  }

  public publishEvent<TPayload>(
    event: RuntimeEvent<TPayload>,
  ): RuntimeEvent<TPayload> {
    this.dispatch(event);

    return event;
  }

  public subscribe(
    listener: RuntimeEventListener,
    options: RuntimeEventSubscriptionOptions = {},
  ): () => void {
    const subscription: Subscription = {
      listener,
      options,
    };

    this.subscriptions.add(
      subscription,
    );

    return () => {
      this.subscriptions.delete(
        subscription,
      );
    };
  }

  public clear(): void {
    this.subscriptions.clear();
  }

  public getSubscriptionCount(): number {
    return this.subscriptions.size;
  }

  private dispatch(
    event: RuntimeEvent,
  ): void {
    const subscriptions =
      Array.from(this.subscriptions);

    subscriptions.forEach(
      (subscription) => {
        const {
          listener,
          options,
        } = subscription;

        try {
          if (
            options.predicate &&
            !options.predicate(event)
          ) {
            return;
          }

          listener(event);
        } catch (error) {
          console.error(
            [
              "[RuntimeEventDispatcher]",
              "イベント購読処理でエラーが発生しました。",
              `eventId=${event.id}`,
              `type=${event.type}`,
            ].join(" "),
            error,
          );
        }
      },
    );
  }
}

export const runtimeEventDispatcher =
  new RuntimeEventDispatcher();