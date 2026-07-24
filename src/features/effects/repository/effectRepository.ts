import type { EffectDefinition } from "../types/effectDefinition";

const STORAGE_KEY = "kamura.effects";

export class EffectRepository {
  loadAll(): EffectDefinition[] {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  load(
    id: string,
  ): EffectDefinition | undefined {
    return this.loadAll().find(
      (effect) => effect.id === id,
    );
  }

  saveAll(
    effects: EffectDefinition[],
  ) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(effects),
    );
  }

  save(
    effect: EffectDefinition,
  ) {
    const effects = this.loadAll();

    effects.push(effect);

    this.saveAll(effects);
  }

  update(
    effect: EffectDefinition,
  ) {
    const effects = this.loadAll();

    const index = effects.findIndex(
      (item) => item.id === effect.id,
    );

    if (index === -1) {
      return;
    }

    effects[index] = effect;

    this.saveAll(effects);
  }

  delete(id: string) {
    this.saveAll(
      this.loadAll().filter(
        (item) => item.id !== id,
      ),
    );
  }
}

export const effectRepository =
  new EffectRepository();