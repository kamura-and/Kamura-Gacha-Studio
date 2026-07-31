import {
  chestPreset,
} from "../presets/ChestPreset";

import type {
  PlayPresentationInput,
  PresentationPhase,
  PresentationPreset,
  PresentationPresetId,
  PresentationRuntimeState,
} from "../types/Presentation";

export type PresentationStateListener = (
  state:
    PresentationRuntimeState,
) => void;

const presets:
  Record<
    PresentationPresetId,
    PresentationPreset
  > = {
    simple: {
      id:
        "simple",

      name:
        "シンプル",

      description:
        "景品結果をすぐに表示する基本演出です。",

      async play(
        context,
      ): Promise<void> {
        context.setPhase(
          "result",
        );

        await context.wait(
          3500,
        );

        context.setPhase(
          "finishing",
        );
      },
    },

    chest:
      chestPreset,
  };

export class PresentationRuntime {
  private state:
    PresentationRuntimeState = {
      isPlaying:
        false,

      phase:
        "idle",

      presetId:
        null,

      item:
        null,
    };

  private readonly listeners =
    new Set<PresentationStateListener>();

  private playToken =
    0;

  public getState():
    PresentationRuntimeState {
    return {
      ...this.state,
    };
  }

  public subscribe(
    listener:
      PresentationStateListener,
  ): () => void {
    this.listeners.add(
      listener,
    );

    listener(
      this.getState(),
    );

    return () => {
      this.listeners.delete(
        listener,
      );
    };
  }

  public async play(
    input:
      PlayPresentationInput,
  ): Promise<void> {
    const preset =
      presets[
        input.presetId
      ];

    if (!preset) {
      throw new Error(
        `Presentation preset "${input.presetId}" was not found.`,
      );
    }

    const currentToken =
      ++this.playToken;

    this.updateState({
      isPlaying:
        true,

      phase:
        "starting",

      presetId:
        preset.id,

      item:
        input.item,
    });

    console.info(
      "[PresentationRuntime]",
      "Presentation started",
      {
        presetId:
          preset.id,

        itemId:
          input.item.id,

        itemName:
          input.item.name,
      },
    );

    try {
      await preset.play({
        item:
          input.item,

        setPhase:
          (
            phase:
              PresentationPhase,
          ) => {
            if (
              currentToken !==
              this.playToken
            ) {
              return;
            }

            this.updateState({
              phase,
            });
          },

        wait:
          async (
            durationMs:
              number,
          ): Promise<void> => {
            await this.wait(
              durationMs,
            );

            if (
              currentToken !==
              this.playToken
            ) {
              throw new Error(
                "Presentation was cancelled.",
              );
            }
          },
      });
    } finally {
      if (
        currentToken ===
        this.playToken
      ) {
        this.updateState({
          isPlaying:
            false,

          phase:
            "idle",

          presetId:
            null,

          item:
            null,
        });
      }
    }
  }

  public stop(): void {
    this.playToken += 1;

    this.updateState({
      isPlaying:
        false,

      phase:
        "idle",

      presetId:
        null,

      item:
        null,
    });

    console.info(
      "[PresentationRuntime]",
      "Presentation stopped",
    );
  }

  public getPresets():
    PresentationPreset[] {
    return Object.values(
      presets,
    );
  }

  private updateState(
    patch:
      Partial<PresentationRuntimeState>,
  ): void {
    this.state = {
      ...this.state,
      ...patch,
    };

    const snapshot =
      this.getState();

    for (
      const listener of
      this.listeners
    ) {
      try {
        listener(
          snapshot,
        );
      } catch (error) {
        console.error(
          "[PresentationRuntime]",
          "State listener failed.",
          error,
        );
      }
    }
  }

  private wait(
    durationMs:
      number,
  ): Promise<void> {
    const normalizedDuration =
      Number.isFinite(
        durationMs,
      )
        ? Math.max(
            0,
            durationMs,
          )
        : 0;

    return new Promise(
      (resolve) => {
        window.setTimeout(
          resolve,
          normalizedDuration,
        );
      },
    );
  }
}

export const presentationRuntime =
  new PresentationRuntime();