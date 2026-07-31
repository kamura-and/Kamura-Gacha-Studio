export type ParticleType =
  | "sparkle"
  | "star"
  | "confetti"
  | "lightning"
  | "heart"
  | "fire";

export type PlayParticleInput = {
  type:
    ParticleType;

  durationMs?:
    number;

  intensity?:
    number;
};

export class ParticleRuntime {
  public play(
    input: PlayParticleInput,
  ): void {
    console.info(
      "[ParticleRuntime]",
      "Particle requested",
      {
        type:
          input.type,

        durationMs:
          input.durationMs ??
          1500,

        intensity:
          input.intensity ??
          1,
      },
    );
  }

  public stopAll(): void {
    console.info(
      "[ParticleRuntime]",
      "All particles stopped",
    );
  }
}

export const particleRuntime =
  new ParticleRuntime();