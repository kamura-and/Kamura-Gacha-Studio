import type {
  PresentationPreset,
} from "../types/Presentation";

export const chestPreset:
  PresentationPreset = {
    id:
      "chest",

    name:
      "宝箱",

    description:
      "宝箱が登場し、開封後に景品を表示する演出です。",

    async play(
      context,
    ): Promise<void> {
      context.setPhase(
        "starting",
      );

      await context.wait(
        250,
      );

      context.setPhase(
        "drawing",
      );

      await context.wait(
        700,
      );

      context.setPhase(
        "revealing",
      );

      await context.wait(
        500,
      );

      context.setPhase(
        "result",
      );

      await context.wait(
        3500,
      );

      context.setPhase(
        "finishing",
      );

      await context.wait(
        350,
      );
    },
  };