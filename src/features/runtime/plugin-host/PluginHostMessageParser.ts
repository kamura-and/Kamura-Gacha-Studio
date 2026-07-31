import type {
  PluginHostMessage,
} from "./types";

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object"
    && value !== null
    && !Array.isArray(value)
  );
}

export function parsePluginHostMessage(
  line: string,
): PluginHostMessage {
  const parsed: unknown =
    JSON.parse(line);

  if (!isRecord(parsed)) {
    throw new Error(
      "Plugin Host message must be a JSON object.",
    );
  }

  if (
    typeof parsed.type !== "string"
    || parsed.type.length === 0
  ) {
    throw new Error(
      'Plugin Host message requires a non-empty "type".',
    );
  }

  if (!isRecord(parsed.payload)) {
    throw new Error(
      'Plugin Host message requires an object "payload".',
    );
  }

  if (
    typeof parsed.occurredAt !== "number"
    || !Number.isFinite(parsed.occurredAt)
  ) {
    throw new Error(
      'Plugin Host message requires a numeric "occurredAt".',
    );
  }

  return {
    type:
      parsed.type,

    payload:
      parsed.payload,

    occurredAt:
      parsed.occurredAt,
  };
}