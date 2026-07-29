import { describe, expect, it } from "vitest";

import { executePool } from "./PoolExecutor";

import { createGachaItem } from "@/test/fixtures/createGachaItem";
import { createGachaPool } from "@/test/fixtures/createGachaPool";

describe("PoolExecutor", () => {
  it("returns a gacha item", () => {
    const item = createGachaItem();

    const pool = createGachaPool({
      itemId: item.id,
    });

    const result = executePool(
      pool,
      (id) => (id === item.id ? item : undefined),
      () => 0,
    );

    expect(result).toEqual(item);
  });

  it("returns null when pool is disabled", () => {
    const item = createGachaItem();

    const pool = createGachaPool({
      enabled: false,
      itemId: item.id,
    });

    const result = executePool(
      pool,
      () => item,
      () => 0,
    );

    expect(result).toBeNull();
  });

  it("returns null when item does not exist", () => {
    const pool = createGachaPool();

    const result = executePool(
      pool,
      () => undefined,
      () => 0,
    );

    expect(result).toBeNull();
  });

  it("returns null when item is disabled", () => {
    const item = createGachaItem({
      enabled: false,
    });

    const pool = createGachaPool({
      itemId: item.id,
    });

    const result = executePool(
      pool,
      () => item,
      () => 0,
    );

    expect(result).toBeNull();
  });

  it("returns null when pool has no entries", () => {
    const pool = {
      ...createGachaPool(),
      entries: [],
    };

    const result = executePool(
      pool,
      () => undefined,
      () => 0,
    );

    expect(result).toBeNull();
  });
});