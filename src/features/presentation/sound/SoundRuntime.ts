export type PlaySoundOptions = {
  volume?: number;

  loop?: boolean;
};

export class SoundRuntime {
  private readonly activeSounds =
    new Set<HTMLAudioElement>();

  public async play(
    source: string,
    options:
      PlaySoundOptions = {},
  ): Promise<void> {
    const normalizedSource =
      source.trim();

    if (!normalizedSource) {
      return;
    }

    const audio =
      new Audio(
        normalizedSource,
      );

    audio.volume =
      this.normalizeVolume(
        options.volume,
      );

    audio.loop =
      options.loop ?? false;

    this.activeSounds.add(
      audio,
    );

    const cleanup = (): void => {
      this.activeSounds.delete(
        audio,
      );

      audio.removeEventListener(
        "ended",
        cleanup,
      );

      audio.removeEventListener(
        "error",
        cleanup,
      );
    };

    audio.addEventListener(
      "ended",
      cleanup,
    );

    audio.addEventListener(
      "error",
      cleanup,
    );

    try {
      await audio.play();
    } catch (error) {
      cleanup();

      console.error(
        "[SoundRuntime]",
        "SEの再生に失敗しました。",
        {
          source:
            normalizedSource,

          error,
        },
      );

      throw error;
    }
  }

  public stopAll(): void {
    for (
      const audio of
      this.activeSounds
    ) {
      audio.pause();

      audio.currentTime =
        0;
    }

    this.activeSounds.clear();
  }

  private normalizeVolume(
    volume:
      number | undefined,
  ): number {
    if (
      volume === undefined ||
      !Number.isFinite(volume)
    ) {
      return 1;
    }

    return Math.min(
      1,
      Math.max(
        0,
        volume,
      ),
    );
  }
}

export const soundRuntime =
  new SoundRuntime();