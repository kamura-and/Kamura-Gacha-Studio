import {
  useMemo,
  useState,
} from "react";

import {
  Check,
  ClipboardCopy,
  Code2,
  TriangleAlert,
} from "lucide-react";

import type {
  ActionInstance,
  GeneratedActionCommand,
} from "@/core/actions";

type CommandPreviewProps = {
  items: ActionInstance[];
};

type GeneratedCommandGroup = {
  instanceId: string;
  actionName: string;
  actionIcon?: string;
  commands: GeneratedActionCommand[];
  errorMessage: string | null;
};

function getOutputTargetLabel(
  target: GeneratedActionCommand["type"],
): string {
  switch (target) {
    case "minecraft":
      return "Minecraft";

    case "obs":
      return "OBS";

    case "sound":
      return "サウンド";

    case "overlay":
      return "オーバーレイ";

    default:
      return String(target);
  }
}

function getDelayLabel(
  delay: number | undefined,
): string {
  if (!delay || delay <= 0) {
    return "遅延なし";
  }

  return `遅延：${delay}ms`;
}

export function CommandPreview({
  items,
}: CommandPreviewProps) {
  const [copied, setCopied] = useState(false);

  const commandGroups = useMemo<
    GeneratedCommandGroup[]
  >(
    () =>
      items.map((item) => {
        try {
          const commands =
            item.definition.buildCommands(
              item.values,
            );

          return {
            instanceId: item.id,
            actionName: item.definition.name,
            actionIcon: item.definition.icon,
            commands,
            errorMessage: null,
          };
        } catch (error) {
          return {
            instanceId: item.id,
            actionName: item.definition.name,
            actionIcon: item.definition.icon,
            commands: [],
            errorMessage:
              error instanceof Error
                ? error.message
                : "コマンドの生成中に不明なエラーが発生しました。",
          };
        }
      }),
    [items],
  );

  const commandCount = useMemo(
    () =>
      commandGroups.reduce(
        (total, group) =>
          total + group.commands.length,
        0,
      ),
    [commandGroups],
  );

  const errorCount = useMemo(
    () =>
      commandGroups.filter(
        (group) => group.errorMessage !== null,
      ).length,
    [commandGroups],
  );

  const copyText = useMemo(
    () =>
      commandGroups
        .flatMap((group) =>
          group.commands
            .filter(
              (command) =>
                command.enabled !== false,
            )
            .map((command) => command.value),
        )
        .join("\n"),
    [commandGroups],
  );

  const handleCopyAll = async () => {
    if (!copyText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        copyText,
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1600);
    } catch (error) {
      console.error(
        "コマンドのコピーに失敗しました。",
        error,
      );
    }
  };

  if (items.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-slate-200 px-4 py-10 text-center">
        <Code2
          size={28}
          className="mx-auto text-slate-300"
        />

        <p className="mt-3 text-sm font-medium text-slate-500">
          生成されたコマンドはありません
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-400">
          タイムラインへアクションを追加すると、
          ここに実行コマンドが表示されます。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {commandCount}件
          </span>

          {errorCount > 0 && (
            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600">
              エラー {errorCount}件
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopyAll}
          disabled={!copyText}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {copied ? (
            <>
              <Check size={14} />
              コピーしました
            </>
          ) : (
            <>
              <ClipboardCopy size={14} />
              すべてコピー
            </>
          )}
        </button>
      </div>

      <div className="space-y-4">
        {commandGroups.map(
          (
            {
              instanceId,
              actionName,
              actionIcon,
              commands,
              errorMessage,
            },
            actionIndex,
          ) => (
            <section
              key={instanceId}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-lg">
                  {actionIcon ?? "⚡"}
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-slate-400">
                    アクション {actionIndex + 1}
                  </p>

                  <h4 className="truncate text-sm font-semibold text-slate-800">
                    {actionName}
                  </h4>
                </div>
              </div>

              {errorMessage ? (
                <div className="p-4">
                  <div className="rounded-lg border border-rose-200 bg-rose-50 p-3">
                    <div className="flex items-start gap-2">
                      <TriangleAlert
                        size={16}
                        className="mt-0.5 shrink-0 text-rose-600"
                      />

                      <div>
                        <p className="text-xs font-semibold text-rose-700">
                          コマンド生成エラー
                        </p>

                        <p className="mt-1 break-words text-xs leading-5 text-rose-600">
                          {errorMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : commands.length === 0 ? (
                <div className="px-4 py-6 text-center">
                  <p className="text-xs text-slate-400">
                    このアクションから生成された
                    コマンドはありません。
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {commands.map(
                    (command, commandIndex) => {
                      const enabled =
                        command.enabled !== false;

                      return (
                        <div
                          key={`${instanceId}-${commandIndex}`}
                          className={
                            enabled
                              ? "p-4"
                              : "bg-slate-50 p-4 opacity-60"
                          }
                        >
                          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-semibold text-slate-500">
                                コマンド{" "}
                                {commandIndex + 1}
                              </span>

                              <span className="rounded-md bg-sky-50 px-2 py-1 text-[10px] font-semibold text-sky-700">
                                {getOutputTargetLabel(
                                  command.type,
                                )}
                              </span>

                              {!enabled && (
                                <span className="rounded-md bg-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-500">
                                  無効
                                </span>
                              )}
                            </div>

                            <span className="text-[10px] font-medium text-slate-400">
                              {getDelayLabel(
                                command.delay,
                              )}
                            </span>
                          </div>

                          <pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-lg bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-100">
                            <code>
                              {command.type === "wait"
                                ? `${command.delay ?? 0}ms 待機`
                                : command.value}
                            </code>
                          </pre>
                        </div>
                      );
                    },
                  )}
                </div>
              )}
            </section>
          ),
        )}
      </div>
    </div>
  );
}