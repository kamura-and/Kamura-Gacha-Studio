import {
  Command,
  type Child,
} from "@tauri-apps/plugin-shell";

import {
  parsePluginHostMessage,
} from "./PluginHostMessageParser";

import type {
  PluginHostCommand,
  PluginHostMessage,
  PluginHostMessageListener,
  PluginHostState,
  PluginHostUnsubscribe,
} from "./types";

export class PluginHostService {
  private state: PluginHostState =
    "stopped";

  private child: Child | null =
    null;

  private readonly messageListeners =
    new Set<PluginHostMessageListener>();

  getState(): PluginHostState {
    return this.state;
  }

  isRunning(): boolean {
    return this.state === "running";
  }

  onMessage(
    listener: PluginHostMessageListener,
  ): PluginHostUnsubscribe {
    this.messageListeners.add(
      listener,
    );

    return () => {
      this.messageListeners.delete(
        listener,
      );
    };
  }

  async start(): Promise<void> {
    if (this.state !== "stopped") {
      return;
    }

    this.state = "starting";

    try {
      const command = Command.sidecar(
        "binaries/plugin-host",
      );

      command.stdout.on(
        "data",
        (line: string) => {
          this.handleStdoutLine(
            line,
          );
        },
      );

      command.stderr.on(
        "data",
        (line: string) => {
          console.info(
            "[PluginHost:stderr]",
            line,
          );
        },
      );

      command.on(
        "error",
        (error: string) => {
          console.error(
            "[PluginHost:error]",
            error,
          );
        },
      );

      command.on(
        "close",
        (data) => {
          console.log(
            "[PluginHost:close]",
            data,
          );

          this.child = null;
          this.state = "stopped";
        },
      );

      this.child =
        await command.spawn();

      this.state = "running";

      console.log(
        "[PluginHostService] Plugin Host spawned.",
        {
          pid: this.child.pid,
        },
      );
    } catch (error: unknown) {
      this.child = null;
      this.state = "stopped";

      console.error(
        "[PluginHostService] Failed to start Plugin Host.",
        error,
      );

      throw error;
    }
  }

  async stop(): Promise<void> {
    if (
      this.state !== "running"
      || this.child === null
    ) {
      return;
    }

    this.state = "stopping";

    try {
      await this.child.kill();

      this.child = null;
      this.state = "stopped";

      console.log(
        "[PluginHostService] Plugin Host stopped.",
      );
    } catch (error: unknown) {
      this.state = "running";

      console.error(
        "[PluginHostService] Failed to stop Plugin Host.",
        error,
      );

      throw error;
    }
  }

  async sendCommand(
    command: PluginHostCommand,
  ): Promise<void> {
    if (
      !this.isRunning()
      || this.child === null
    ) {
      throw new Error(
        "Plugin Host is not running.",
      );
    }

    const serializedCommand =
      `${JSON.stringify(command)}\n`;

    await this.child.write(
      serializedCommand,
    );

    console.log(
      "[PluginHostService] Command sent.",
      command,
    );
  }

  private handleStdoutLine(
    line: string,
  ): void {
    const trimmedLine =
      line.trim();

    if (trimmedLine.length === 0) {
      return;
    }

    try {
      const message =
        parsePluginHostMessage(
          trimmedLine,
        );

      console.log(
        "[PluginHost:message]",
        message,
      );

      this.emitMessage(
        message,
      );
    } catch (error: unknown) {
      console.warn(
        "[PluginHostService] Invalid stdout message.",
        {
          line:
            trimmedLine,

          error:
            error instanceof Error
              ? error.message
              : String(error),
        },
      );
    }
  }

  private emitMessage(
    message: PluginHostMessage,
  ): void {
    for (
      const listener
      of this.messageListeners
    ) {
      try {
        listener(
          message,
        );
      } catch (error: unknown) {
        console.error(
          "[PluginHostService] Message listener failed.",
          error,
        );
      }
    }
  }
}