import type {
  Plugin,
  PluginContext,
} from "../core/Plugin.js";

export class FakePlugin
implements Plugin {
  readonly id =
    "fake-plugin";

  private started =
    false;

  private context:
    PluginContext | undefined;

  start(
    context: PluginContext,
  ): void {
    if (this.started) {
      return;
    }

    this.context =
      context;

    this.started =
      true;

    context.log(
      `${this.id} started.`,
    );

    context.emit(
      "plugin.started",
      {
        pluginId:
          this.id,
      },
    );
  }

  stop(): void {
    if (!this.started) {
      return;
    }

    this.context?.log(
      `${this.id} stopped.`,
    );

    this.context?.emit(
      "plugin.stopped",
      {
        pluginId:
          this.id,
      },
    );

    this.context =
      undefined;

    this.started =
      false;
  }

  isStarted(): boolean {
    return this.started;
  }
}