import type {
  ExecutionHistoryEntry,
} from "../types/ExecutionHistory";

const STORAGE_KEY =
  "kamura.execution-history";

const MAX_HISTORY_COUNT = 500;

function isExecutionHistoryEntry(
  value: unknown,
): value is ExecutionHistoryEntry {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const candidate =
    value as Partial<ExecutionHistoryEntry>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.gachaPoolId ===
      "string" &&
    typeof candidate.poolEntryId ===
      "string" &&
    typeof candidate.gachaItemId ===
      "string" &&
    typeof candidate.gachaItemName ===
      "string" &&
    (
      candidate.mode === "effect" ||
      candidate.mode ===
        "legacy-commands" ||
      candidate.mode === "none"
    ) &&
    typeof candidate.commandCount ===
      "number" &&
    Number.isFinite(
      candidate.commandCount,
    ) &&
    typeof candidate.drawnAt ===
      "number" &&
    Number.isFinite(candidate.drawnAt) &&
    typeof candidate.executedAt ===
      "number" &&
    Number.isFinite(
      candidate.executedAt,
    ) &&
    (
      candidate.status === "success" ||
      candidate.status === "failed"
    )
  );
}

function normalizeEntries(
  value: unknown,
): ExecutionHistoryEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    isExecutionHistoryEntry,
  );
}

export class ExecutionHistoryRepository {
  public load(): ExecutionHistoryEntry[] {
    try {
      const stored =
        window.localStorage.getItem(
          STORAGE_KEY,
        );

      if (!stored) {
        return [];
      }

      const parsed: unknown =
        JSON.parse(stored);

      return normalizeEntries(parsed)
        .sort(
          (left, right) =>
            right.executedAt -
            left.executedAt,
        )
        .slice(0, MAX_HISTORY_COUNT);
    } catch (error) {
      console.error(
        "[ExecutionHistoryRepository]",
        "Failed to load execution history",
        error,
      );

      return [];
    }
  }

  public save(
    entries: ExecutionHistoryEntry[],
  ): void {
    try {
      const normalized =
        normalizeEntries(entries)
          .sort(
            (left, right) =>
              right.executedAt -
              left.executedAt,
          )
          .slice(
            0,
            MAX_HISTORY_COUNT,
          );

      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(normalized),
      );
    } catch (error) {
      console.error(
        "[ExecutionHistoryRepository]",
        "Failed to save execution history",
        error,
      );

      throw error;
    }
  }

  public add(
    entry: ExecutionHistoryEntry,
  ): void {
    const currentEntries =
      this.load();

    this.save([
      entry,
      ...currentEntries.filter(
        (currentEntry) =>
          currentEntry.id !== entry.id,
      ),
    ]);
  }

  public findById(
    id: string,
  ): ExecutionHistoryEntry | undefined {
    return this.load().find(
      (entry) => entry.id === id,
    );
  }

  public getLatest(
    limit: number,
  ): ExecutionHistoryEntry[] {
    if (
      !Number.isFinite(limit) ||
      limit <= 0
    ) {
      return [];
    }

    return this.load().slice(
      0,
      Math.floor(limit),
    );
  }

  public remove(
    id: string,
  ): void {
    const nextEntries =
      this.load().filter(
        (entry) => entry.id !== id,
      );

    this.save(nextEntries);
  }

  public clear(): void {
    try {
      window.localStorage.removeItem(
        STORAGE_KEY,
      );
    } catch (error) {
      console.error(
        "[ExecutionHistoryRepository]",
        "Failed to clear execution history",
        error,
      );

      throw error;
    }
  }

  public count(): number {
    return this.load().length;
  }
}

export const executionHistoryRepository =
  new ExecutionHistoryRepository();