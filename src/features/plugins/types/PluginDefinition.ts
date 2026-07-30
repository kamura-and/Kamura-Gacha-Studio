export type PluginId =
  | "tiktok-live"
  | "minecraft"
  | "overlay"
  | "fake";

export type PluginType =
  | "tiktok"
  | "minecraft"
  | "overlay";

export type PluginCapability =
  | "trigger-source"
  | "command-executor"
  | "overlay-output";

export type PluginDefinition = {
  id: PluginId;
  name: string;
  type: PluginType;
  version: string;
  author: string;
  description: string;
  capabilities: PluginCapability[];
};