import type {
  PluginId,
} from "../../plugins/types/plugin";

export type RuntimeEventCategory =
  | "connection"
  | "gift"
  | "comment"
  | "like"
  | "share"
  | "follow"
  | "join"
  | "trigger"
  | "gacha"
  | "effect"
  | "queue"
  | "system";

export type RuntimeEventSource =
  | {
      kind: "plugin";
      pluginId: PluginId;
    }
  | {
      kind: "runtime";
      module: string;
    };

export type RuntimeEventMetadata = {
  correlationId?: string;
  causationId?: string;
  tags?: string[];
};

export type RuntimeEvent<
  TPayload = unknown,
> = {
  id: string;
  category: RuntimeEventCategory;
  type: string;
  source: RuntimeEventSource;
  payload: TPayload;
  occurredAt: number;
  metadata: RuntimeEventMetadata;
};

export type RuntimeEventInput<
  TPayload = unknown,
> = {
  category: RuntimeEventCategory;
  type: string;
  source: RuntimeEventSource;
  payload: TPayload;
  occurredAt?: number;
  metadata?: RuntimeEventMetadata;
};

export type RuntimeEventListener = (
  event: RuntimeEvent,
) => void;

export type RuntimeEventPredicate = (
  event: RuntimeEvent,
) => boolean;

export type RuntimeEventSubscriptionOptions = {
  predicate?: RuntimeEventPredicate;
};