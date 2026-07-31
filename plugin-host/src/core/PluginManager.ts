import type {
  Plugin,
  PluginContext,
  PluginStatus,
} from "./Plugin.js";

export class PluginManager {
  private readonly plugins =
    new Map<string, Plugin>();

  register(plugin: Plugin): void {
    if (this.plugins.has(plugin.id)) {
      throw new Error(
        `Plugin "${plugin.id}" is already registered.`,
      );
    }

    this.plugins.set(
      plugin.id,
      plugin,
    );
  }

  async start(
    pluginId: string,
    context: PluginContext,
  ): Promise<void> {
    const plugin =
      this.getPlugin(pluginId);

    if (plugin.isStarted()) {
      return;
    }

    await plugin.start(context);
  }

  async stop(
    pluginId: string,
  ): Promise<void> {
    const plugin =
      this.getPlugin(pluginId);

    if (!plugin.isStarted()) {
      return;
    }

    await plugin.stop();
  }

  async startAll(
    context: PluginContext,
  ): Promise<void> {
    for (
      const plugin
      of this.plugins.values()
    ) {
      if (plugin.isStarted()) {
        continue;
      }

      await plugin.start(context);
    }
  }

  async stopAll(): Promise<void> {
    const plugins =
      Array.from(
        this.plugins.values(),
      ).reverse();

    for (const plugin of plugins) {
      if (!plugin.isStarted()) {
        continue;
      }

      await plugin.stop();
    }
  }

  getStatuses(): PluginStatus[] {
    return Array.from(
      this.plugins.values(),
      (plugin) => ({
        id: plugin.id,
        started:
          plugin.isStarted(),
      }),
    );
  }

  private getPlugin(
    pluginId: string,
  ): Plugin {
    const plugin =
      this.plugins.get(pluginId);

    if (plugin === undefined) {
      throw new Error(
        `Plugin "${pluginId}" was not found.`,
      );
    }

    return plugin;
  }
}