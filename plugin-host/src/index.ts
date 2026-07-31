import {
  createInterface,
  type Interface as ReadlineInterface,
} from "node:readline";

import {
  PluginManager,
} from "./core/PluginManager.js";

import type {
  PluginContext,
} from "./core/Plugin.js";

import {
  FakePlugin,
} from "./plugins/FakePlugin.js";

import {
  TikTokPlugin,
} from "./plugins/TikTokPlugin.js";

type PluginHostMessage = {
  type: string;

  payload: Record<
    string,
    unknown
  >;

  occurredAt: number;
};

type PluginHostCommandType =
  | "plugin.list"
  | "plugin.start"
  | "plugin.stop"
  | "tiktok.connect"
  | "tiktok.disconnect"
  | "tiktok.status"
  | "plugin-host.stop";

type PluginHostCommand = {
  requestId: string;

  type:
    PluginHostCommandType;

  payload: Record<
    string,
    unknown
  >;
};

const validCommandTypes =
  new Set<PluginHostCommandType>([
    "plugin.list",
    "plugin.start",
    "plugin.stop",
    "tiktok.connect",
    "tiktok.disconnect",
    "tiktok.status",
    "plugin-host.stop",
  ]);

function writeMessage(
  type: string,
  payload: Record<
    string,
    unknown
  > = {},
): void {
  const message:
    PluginHostMessage = {
      type,
      payload,
      occurredAt:
        Date.now(),
    };

  process.stdout.write(
    `${JSON.stringify(message)}\n`,
  );
}

function writeLog(
  message: string,
): void {
  process.stderr.write(
    `[PluginHost] ${message}\n`,
  );
}

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object"
    && value !== null
    && !Array.isArray(value)
  );
}

function isPluginHostCommandType(
  value: unknown,
): value is PluginHostCommandType {
  return (
    typeof value === "string"
    && validCommandTypes.has(
      value as PluginHostCommandType,
    )
  );
}

function parseCommand(
  line: string,
): PluginHostCommand {
  const parsed: unknown =
    JSON.parse(line);

  if (!isRecord(parsed)) {
    throw new Error(
      "Command must be a JSON object.",
    );
  }

  if (
    typeof parsed.requestId
    !== "string"
    || parsed.requestId.length === 0
  ) {
    throw new Error(
      'Command requires a non-empty "requestId".',
    );
  }

  if (
    !isPluginHostCommandType(
      parsed.type,
    )
  ) {
    throw new Error(
      `Unknown command type: ${String(
        parsed.type,
      )}`,
    );
  }

  const payload =
    parsed.payload === undefined
      ? {}
      : parsed.payload;

  if (!isRecord(payload)) {
    throw new Error(
      'Command "payload" must be a JSON object.',
    );
  }

  return {
    requestId:
      parsed.requestId,

    type:
      parsed.type,

    payload,
  };
}

function getPluginId(
  command: PluginHostCommand,
): string {
  const pluginId =
    command.payload.pluginId;

  if (
    typeof pluginId !== "string"
    || pluginId.trim().length === 0
  ) {
    throw new Error(
      'Command payload requires a non-empty "pluginId".',
    );
  }

  return pluginId.trim();
}

function getTikTokUniqueId(
  command: PluginHostCommand,
): string {
  const uniqueId =
    command.payload.uniqueId;

  if (
    typeof uniqueId !== "string"
    || uniqueId.trim().length === 0
  ) {
    throw new Error(
      'Command payload requires a non-empty "uniqueId".',
    );
  }

  return uniqueId
    .trim()
    .replace(/^@/, "");
}

const pluginManager =
  new PluginManager();

const tikTokPlugin =
  new TikTokPlugin();

const pluginContext:
  PluginContext = {
    emit:
      writeMessage,

    log:
      writeLog,
  };

let heartbeatTimer:
  NodeJS.Timeout | undefined;

let commandReader:
  ReadlineInterface | undefined;

let isStopping =
  false;

let commandChain:
  Promise<void> =
  Promise.resolve();

function writeCommandSucceeded(
  command: PluginHostCommand,
  result: Record<
    string,
    unknown
  > = {},
): void {
  writeMessage(
    "command.succeeded",
    {
      requestId:
        command.requestId,

      commandType:
        command.type,

      result,
    },
  );
}

function writeCommandFailed(
  requestId: string | undefined,
  error: unknown,
): void {
  writeMessage(
    "command.failed",
    {
      requestId:
        requestId ?? null,

      message:
        error instanceof Error
          ? error.message
          : String(error),
    },
  );
}

async function handleCommand(
  command: PluginHostCommand,
): Promise<void> {
  switch (command.type) {
    case "plugin.list": {
      writeCommandSucceeded(
        command,
        {
          plugins:
            pluginManager
              .getStatuses(),

          tikTok:
            tikTokPlugin
              .getStatus(),
        },
      );

      return;
    }

    case "plugin.start": {
      const pluginId =
        getPluginId(command);

      await pluginManager.start(
        pluginId,
        pluginContext,
      );

      writeCommandSucceeded(
        command,
        {
          pluginId,

          plugins:
            pluginManager
              .getStatuses(),
        },
      );

      return;
    }

    case "plugin.stop": {
      const pluginId =
        getPluginId(command);

      await pluginManager.stop(
        pluginId,
      );

      writeCommandSucceeded(
        command,
        {
          pluginId,

          plugins:
            pluginManager
              .getStatuses(),
        },
      );

      return;
    }

    case "tiktok.connect": {
      const uniqueId =
        getTikTokUniqueId(
          command,
        );

      await tikTokPlugin.connect(
        uniqueId,
      );

      writeCommandSucceeded(
        command,
        {
          tikTok:
            tikTokPlugin
              .getStatus(),
        },
      );

      return;
    }

    case "tiktok.disconnect": {
      await tikTokPlugin.disconnect();

      writeCommandSucceeded(
        command,
        {
          tikTok:
            tikTokPlugin
              .getStatus(),
        },
      );

      return;
    }

    case "tiktok.status": {
      writeCommandSucceeded(
        command,
        {
          tikTok:
            tikTokPlugin
              .getStatus(),
        },
      );

      return;
    }

    case "plugin-host.stop": {
      writeCommandSucceeded(
        command,
      );

      await stopPluginHost(
        "command",
      );

      return;
    }
  }
}

async function handleCommandLine(
  line: string,
): Promise<void> {
  const trimmedLine =
    line.trim();

  if (trimmedLine.length === 0) {
    return;
  }

  let requestId:
    string | undefined;

  try {
    const command =
      parseCommand(trimmedLine);

    requestId =
      command.requestId;

    await handleCommand(
      command,
    );
  } catch (error: unknown) {
    writeCommandFailed(
      requestId,
      error,
    );
  }
}

function startCommandReader(): void {
  commandReader =
    createInterface({
      input:
        process.stdin,

      terminal:
        false,
    });

  commandReader.on(
    "line",
    (line: string) => {
      commandChain =
        commandChain
          .then(
            () =>
              handleCommandLine(
                line,
              ),
          )
          .catch(
            (error: unknown) => {
              writeLog(
                `Command chain failed: ${
                  error instanceof Error
                    ? error.message
                    : String(error)
                }`,
              );
            },
          );
    },
  );

  commandReader.on(
    "close",
    () => {
      writeLog(
        "Command input was closed.",
      );
    },
  );
}

async function startPluginHost():
Promise<void> {
  writeLog(
    "Plugin Host started.",
  );

  pluginManager.register(
    new FakePlugin(),
  );

  pluginManager.register(
    tikTokPlugin,
  );

  await pluginManager.startAll(
    pluginContext,
  );

  startCommandReader();

  writeMessage(
    "plugin-host.ready",
    {
      processId:
        process.pid,

      nodeVersion:
        process.version,

      plugins:
        pluginManager
          .getStatuses(),

      tikTok:
        tikTokPlugin
          .getStatus(),
    },
  );

  heartbeatTimer =
    setInterval(
      () => {
        writeMessage(
          "plugin-host.heartbeat",
          {
            processId:
              process.pid,

            plugins:
              pluginManager
                .getStatuses(),

            tikTok:
              tikTokPlugin
                .getStatus(),
          },
        );
      },
      5_000,
    );
}

async function stopPluginHost(
  signal: string,
): Promise<void> {
  if (isStopping) {
    return;
  }

  isStopping =
    true;

  writeLog(
    `${signal} received. Stopping Plugin Host.`,
  );

  if (
    heartbeatTimer
    !== undefined
  ) {
    clearInterval(
      heartbeatTimer,
    );

    heartbeatTimer =
      undefined;
  }

  commandReader?.close();

  commandReader =
    undefined;

  process.stdin.pause();

  await pluginManager.stopAll();

  writeMessage(
    "plugin-host.stopping",
    {
      signal,

      plugins:
        pluginManager
          .getStatuses(),

      tikTok:
        tikTokPlugin
          .getStatus(),
    },
  );

  process.exitCode =
    0;
}

process.on(
  "SIGINT",
  () => {
    void stopPluginHost(
      "SIGINT",
    );
  },
);

process.on(
  "SIGTERM",
  () => {
    void stopPluginHost(
      "SIGTERM",
    );
  },
);

process.on(
  "uncaughtException",
  (error: Error) => {
    writeLog(
      `Uncaught exception: ${
        error.stack
        ?? error.message
      }`,
    );

    process.exitCode =
      1;
  },
);

process.on(
  "unhandledRejection",
  (reason: unknown) => {
    writeLog(
      `Unhandled rejection: ${
        String(reason)
      }`,
    );

    process.exitCode =
      1;
  },
);

void startPluginHost().catch(
  (error: unknown) => {
    writeLog(
      `Failed to start Plugin Host: ${
        error instanceof Error
          ? error.stack
            ?? error.message
          : String(error)
      }`,
    );

    process.exitCode =
      1;
  },
);