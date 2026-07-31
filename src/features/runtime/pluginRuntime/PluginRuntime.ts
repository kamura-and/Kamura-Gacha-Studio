import {
  RuntimeEventBus,
} from "../eventBus/RuntimeEventBus";

import type {
  RuntimePlugin,
} from "./RuntimePlugin";

/**
 * RuntimePluginのライフサイクルを管理する。
 *
 * 責務
 *
 * - Plugin登録
 * - Plugin取得
 * - Plugin開始
 * - Plugin停止
 * - RuntimeEventBusとの接続
 */
export class PluginRuntime {
  private readonly plugins =
    new Map<string, RuntimePlugin>();

  private readonly eventBus:
    RuntimeEventBus;

  public constructor(
    eventBus: RuntimeEventBus,
  ) {
    this.eventBus =
      eventBus;
  }

  /**
   * Pluginを登録する。
   */
  public register(
    plugin: RuntimePlugin,
  ): void {
    if (
      this.plugins.has(
        plugin.id,
      )
    ) {
      throw new Error(
        `Plugin "${plugin.id}" is already registered.`,
      );
    }

    this.plugins.set(
      plugin.id,
      plugin,
    );
  }

  /**
   * Plugin登録を解除する。
   */
  public unregister(
    pluginId: string,
  ): void {
    this.plugins.delete(
      pluginId,
    );
  }

  /**
   * 登録済みPluginを取得する。
   *
   * 未登録の場合はundefinedを返す。
   */
  public get(
    pluginId: string,
  ): RuntimePlugin | undefined {
    return this.plugins.get(
      pluginId,
    );
  }

  /**
   * Pluginを開始する。
   */
  public start(
    pluginId: string,
  ): void {
    const plugin =
      this.requirePlugin(
        pluginId,
      );

    plugin.start(
      (event) => {
        this.eventBus.publish(
          event,
        );
      },
    );
  }

  /**
   * Pluginを停止する。
   */
  public stop(
    pluginId: string,
  ): void {
    const plugin =
      this.requirePlugin(
        pluginId,
      );

    plugin.stop();
  }

  /**
   * Pluginが登録済みか返す。
   */
  public has(
    pluginId: string,
  ): boolean {
    return this.plugins.has(
      pluginId,
    );
  }

  /**
   * 登録済みPlugin数を返す。
   */
  public count(): number {
    return this.plugins.size;
  }

  /**
   * 登録済みPluginを取得する。
   *
   * 未登録の場合は例外を投げる。
   */
  private requirePlugin(
    pluginId: string,
  ): RuntimePlugin {
    const plugin =
      this.plugins.get(
        pluginId,
      );

    if (
      plugin === undefined
    ) {
      throw new Error(
        `Plugin "${pluginId}" is not registered.`,
      );
    }

    return plugin;
  }
}