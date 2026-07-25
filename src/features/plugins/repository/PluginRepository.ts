import type {
  PluginConnectionStatus,
  PluginDefinition,
  PluginId,
  PluginType,
} from "../types/plugin";

const STORAGE_KEY =
  "kamura.plugins";

type PersistedPluginDefinition = {
  id: PluginId;
  name: string;
  type: PluginType;
  enabled: boolean;
  connectionStatus: PluginConnectionStatus;
  connectionDetail?: string;
  errorMessage?: string;
  lastConnectedAt?: number;
  lastHeartbeatAt?: number;
  updatedAt: number;
};

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null
  );
}

function isPluginId(
  value: unknown,
): value is PluginId {
  return (
    value === "tiktok-live" ||
    value === "minecraft" ||
    value === "overlay"
  );
}

function isPluginType(
  value: unknown,
): value is PluginType {
  return (
    value === "tiktok" ||
    value === "minecraft" ||
    value === "overlay"
  );
}

function isConnectionStatus(
  value: unknown,
): value is PluginConnectionStatus {
  return (
    value === "disconnected" ||
    value === "connecting" ||
    value === "connected" ||
    value === "error"
  );
}

function getOptionalString(
  value: unknown,
): string | undefined {
  return typeof value === "string"
    ? value
    : undefined;
}

function getOptionalNumber(
  value: unknown,
): number | undefined {
  return typeof value === "number"
    ? value
    : undefined;
}

function serializePlugin(
  plugin: PluginDefinition,
): PersistedPluginDefinition {
  return {
    id: plugin.id,
    name: plugin.name,
    type: plugin.type,
    enabled: plugin.enabled,
    connectionStatus:
      plugin.connectionStatus,
    connectionDetail:
      plugin.connectionDetail,
    errorMessage:
      plugin.errorMessage,
    lastConnectedAt:
      plugin.lastConnectedAt,
    lastHeartbeatAt:
      plugin.lastHeartbeatAt,
    updatedAt: plugin.updatedAt,
  };
}

function deserializePlugin(
  value: unknown,
): PluginDefinition | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  if (
    !isPluginId(value.id) ||
    typeof value.name !== "string" ||
    !isPluginType(value.type) ||
    typeof value.enabled !== "boolean" ||
    !isConnectionStatus(
      value.connectionStatus,
    )
  ) {
    return undefined;
  }

  return {
    id: value.id,
    name: value.name,
    type: value.type,
    enabled: value.enabled,
    connectionStatus:
      value.connectionStatus,
    connectionDetail:
      getOptionalString(
        value.connectionDetail,
      ),
    errorMessage:
      getOptionalString(
        value.errorMessage,
      ),
    lastConnectedAt:
      getOptionalNumber(
        value.lastConnectedAt,
      ),
    lastHeartbeatAt:
      getOptionalNumber(
        value.lastHeartbeatAt,
      ),
    updatedAt:
      typeof value.updatedAt ===
      "number"
        ? value.updatedAt
        : Date.now(),
  };
}

function canUseLocalStorage(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.localStorage !==
      "undefined"
  );
}

export class PluginRepository {
  loadAll(): PluginDefinition[] {
    if (!canUseLocalStorage()) {
      return [];
    }

    const raw =
      window.localStorage.getItem(
        STORAGE_KEY,
      );

    if (!raw) {
      return [];
    }

    try {
      const parsed: unknown =
        JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .map(deserializePlugin)
        .filter(
          (
            plugin,
          ): plugin is PluginDefinition =>
            plugin !== undefined,
        );
    } catch {
      return [];
    }
  }

  load(
    id: PluginId,
  ): PluginDefinition | undefined {
    return this.loadAll().find(
      (plugin) => plugin.id === id,
    );
  }

  saveAll(
    plugins: PluginDefinition[],
  ): void {
    if (!canUseLocalStorage()) {
      return;
    }

    const persistedPlugins =
      plugins.map(serializePlugin);

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        persistedPlugins,
      ),
    );
  }

  save(
    plugin: PluginDefinition,
  ): void {
    const plugins = this.loadAll();

    const index =
      plugins.findIndex(
        (item) =>
          item.id === plugin.id,
      );

    if (index === -1) {
      plugins.push(plugin);
    } else {
      plugins[index] = plugin;
    }

    this.saveAll(plugins);
  }

  delete(id: PluginId): void {
    this.saveAll(
      this.loadAll().filter(
        (plugin) =>
          plugin.id !== id,
      ),
    );
  }

  clear(): void {
    if (!canUseLocalStorage()) {
      return;
    }

    window.localStorage.removeItem(
      STORAGE_KEY,
    );
  }
}

export const pluginRepository =
  new PluginRepository();