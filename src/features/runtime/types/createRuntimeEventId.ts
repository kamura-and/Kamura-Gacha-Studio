let fallbackSequence = 0;

export function createRuntimeEventId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    return `evt_${crypto.randomUUID()}`;
  }

  fallbackSequence += 1;

  const timestamp =
    Date.now().toString(36);

  const sequence =
    fallbackSequence.toString(36);

  const random = Math.random()
    .toString(36)
    .slice(2, 10);

  return [
    "evt",
    timestamp,
    sequence,
    random,
  ].join("_");
}