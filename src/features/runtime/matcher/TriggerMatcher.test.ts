import { describe, expect, it } from "vitest";

import { matchTriggers } from "./TriggerMatcher";

import { createGiftEvent } from "@/test/fixtures/createGiftEvent";
import { createGiftTrigger } from "@/test/fixtures/createGiftTrigger";

describe("TriggerMatcher", () => {
  it("matches a gift trigger", () => {
    const event = createGiftEvent();

    const trigger =
      createGiftTrigger();

    const matched =
      matchTriggers(
        event,
        [trigger],
      );

    expect(matched).toHaveLength(1);
  });

  it("does not match a different gift", () => {
    const event =
      createGiftEvent({
        giftId: "rose",
      });

    const trigger =
      createGiftTrigger({
        giftId: "donut",
      });

    const matched =
      matchTriggers(
        event,
        [trigger],
      );

    expect(matched).toHaveLength(0);
  });

  it("does not match when repeat count is too low", () => {
    const event =
      createGiftEvent({
        repeatCount: 1,
      });

    const trigger =
      createGiftTrigger({
        repeatCount: 5,
      });

    const matched =
      matchTriggers(
        event,
        [trigger],
      );

    expect(matched).toHaveLength(0);
  });

  it("does not match a disabled trigger", () => {
    const event =
      createGiftEvent();

    const trigger =
      createGiftTrigger({
        enabled: false,
      });

    const matched =
      matchTriggers(
        event,
        [trigger],
      );

    expect(matched).toHaveLength(0);
  });
});