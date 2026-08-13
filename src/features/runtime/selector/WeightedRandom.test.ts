import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  PoolEntry,
} from "@/features/pools/types/pool";

import {
  selectWeightedEntry,
} from "./WeightedRandom";

const entries: PoolEntry[] = [
  {
    id: "entry-1",
    effectId: "common",
    weight: 70,
  },
  {
    id: "entry-2",
    effectId: "rare",
    weight: 25,
  },
  {
    id: "entry-3",
    effectId: "legendary",
    weight: 5,
  },
];

describe(
  "WeightedRandom",
  () => {
    it(
      "returns null when entries are empty",
      () => {
        expect(
          selectWeightedEntry(
            [],
          ),
        ).toBeNull();
      },
    );

    it(
      "selects the first entry",
      () => {
        const result =
          selectWeightedEntry(
            entries,
            () => 0.0,
          );

        expect(
          result?.effectId,
        ).toBe(
          "common",
        );
      },
    );

    it(
      "selects the second entry",
      () => {
        const result =
          selectWeightedEntry(
            entries,
            () => 0.8,
          );

        expect(
          result?.effectId,
        ).toBe(
          "rare",
        );
      },
    );

    it(
      "selects the third entry",
      () => {
        const result =
          selectWeightedEntry(
            entries,
            () => 0.99,
          );

        expect(
          result?.effectId,
        ).toBe(
          "legendary",
        );
      },
    );

    it(
      "ignores entries whose weight is zero",
      () => {
        const result =
          selectWeightedEntry(
            [
              {
                id: "entry-1",
                effectId:
                  "disabled",
                weight: 0,
              },
              {
                id: "entry-2",
                effectId:
                  "enabled",
                weight: 100,
              },
            ],
            () => 0,
          );

        expect(
          result?.effectId,
        ).toBe(
          "enabled",
        );
      },
    );

    it(
      "returns the last entry when random returns exactly 1",
      () => {
        const result =
          selectWeightedEntry(
            entries,
            () => 1,
          );

        expect(
          result?.effectId,
        ).toBe(
          "legendary",
        );
      },
    );
  },
);