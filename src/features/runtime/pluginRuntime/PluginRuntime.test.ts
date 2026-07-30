import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  RuntimeEventBus,
} from "../eventBus/RuntimeEventBus";

import {
  PluginRuntime,
} from "./PluginRuntime";

import type {
  PublishRuntimeEvent,
  RuntimePlugin,
} from "./RuntimePlugin";

import type {
  RuntimeEvent,
} from "../types/RuntimeEvent";

describe(
  "PluginRuntime",
  () => {
    it(
      "registers a plugin",
      () => {
        const runtime =
          createRuntime();

        const plugin =
          createPlugin();

        runtime.register(
          plugin,
        );

        expect(
          runtime.has(
            plugin.id,
          ),
        ).toBe(
          true,
        );

        expect(
          runtime.count(),
        ).toBe(
          1,
        );
      },
    );

    it(
      "throws when registering the same plugin id twice",
      () => {
        const runtime =
          createRuntime();

        runtime.register(
          createPlugin(),
        );

        expect(
          () => {
            runtime.register(
              createPlugin(),
            );
          },
        ).toThrow(
          'Plugin "plugin-1" is already registered.',
        );
      },
    );

    it(
      "starts a registered plugin",
      () => {
        const runtime =
          createRuntime();

        const plugin =
          createPlugin();

        runtime.register(
          plugin,
        );

        runtime.start(
          plugin.id,
        );

        expect(
          plugin.start,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );

    it(
      "stops a registered plugin",
      () => {
        const runtime =
          createRuntime();

        const plugin =
          createPlugin();

        runtime.register(
          plugin,
        );

        runtime.stop(
          plugin.id,
        );

        expect(
          plugin.stop,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );

    it(
      "publishes plugin events to RuntimeEventBus",
      () => {
        const bus =
          new RuntimeEventBus();

        const runtime =
          new PluginRuntime(
            bus,
          );

        const listener =
          vi.fn();

        bus.subscribe(
          listener,
        );

        const plugin =
          createPlugin();

        runtime.register(
          plugin,
        );

        runtime.start(
          plugin.id,
        );

        const event =
          createEvent();

        plugin.emit(
          event,
        );

        expect(
          listener,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          listener,
        ).toHaveBeenCalledWith(
          event,
        );
      },
    );

    it(
      "unregisters a plugin",
      () => {
        const runtime =
          createRuntime();

        const plugin =
          createPlugin();

        runtime.register(
          plugin,
        );

        runtime.unregister(
          plugin.id,
        );

        expect(
          runtime.has(
            plugin.id,
          ),
        ).toBe(
          false,
        );

        expect(
          runtime.count(),
        ).toBe(
          0,
        );
      },
    );

    it(
      "throws when starting an unregistered plugin",
      () => {
        const runtime =
          createRuntime();

        expect(
          () => {
            runtime.start(
              "missing-plugin",
            );
          },
        ).toThrow(
          'Plugin "missing-plugin" is not registered.',
        );
      },
    );

    it(
      "throws when stopping an unregistered plugin",
      () => {
        const runtime =
          createRuntime();

        expect(
          () => {
            runtime.stop(
              "missing-plugin",
            );
          },
        ).toThrow(
          'Plugin "missing-plugin" is not registered.',
        );
      },
    );
  },
);

function createRuntime():
  PluginRuntime {
  return new PluginRuntime(
    new RuntimeEventBus(),
  );
}

function createPlugin() {
  let publish:
    PublishRuntimeEvent | undefined;

  const start =
    vi.fn(
      (
        nextPublish:
          PublishRuntimeEvent,
      ) => {
        publish =
          nextPublish;
      },
    );

  const stop =
    vi.fn();

  const plugin:
    RuntimePlugin & {
      start:
        typeof start;

      stop:
        typeof stop;

      emit(
        event: RuntimeEvent,
      ): void;
    } = {
    id:
      "plugin-1",

    start,

    stop,

    emit(
      event: RuntimeEvent,
    ): void {
      if (
        publish === undefined
      ) {
        throw new Error(
          "Plugin has not been started.",
        );
      }

      publish(
        event,
      );
    },
  };

  return plugin;
}

function createEvent():
  RuntimeEvent {
  return {
    id:
      "event-1",

    category:
      "system",

    type:
      "system.test",

    source: {
      kind:
        "runtime",

      module:
        "PluginRuntime.test",
    },

    payload: {},

    occurredAt:
      Date.now(),

    metadata: {},
  };
}