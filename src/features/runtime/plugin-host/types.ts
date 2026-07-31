export type PluginHostState =
  | "stopped"
  | "starting"
  | "running"
  | "stopping";

export interface PluginHostCommand {
  requestId: string;
  type: string;
  payload: Record<string, unknown>;
}

export interface PluginHostMessage {
  type: string;
  payload: Record<string, unknown>;
  occurredAt: number;
}