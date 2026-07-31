import type {
  PluginHostCommand,
  PluginHostState,
} from "./types";

export class PluginHostService {
  private state: PluginHostState =
    "stopped";

  getState(): PluginHostState {
    return this.state;
  }

  isRunning(): boolean {
    return this.state === "running";
  }

  async start(): Promise<void> {
    if (this.state !== "stopped") {
      return;
    }

    this.state = "starting";

    //
    // 次のSprintで
    // Tauri Sidecar起動
    //

    this.state = "running";
  }

  async stop(): Promise<void> {
    if (this.state !== "running") {
      return;
    }

    this.state = "stopping";

    //
    // 次のSprintで
    // plugin-host.stop送信
    //

    this.state = "stopped";
  }

  async sendCommand(
    command: PluginHostCommand,
  ): Promise<void> {
    if (!this.isRunning()) {
      throw new Error(
        "Plugin Host is not running.",
      );
    }

    console.log(
      "[PluginHost]",
      command,
    );

    //
    // 次のSprintでstdin送信
    //
  }
}