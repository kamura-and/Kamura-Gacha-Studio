import {
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  CheckCircle2,
  CircleAlert,
  LoaderCircle,
  Send,
  Terminal,
} from "lucide-react";

import {
  sendMinecraftCommand,
} from "@/features/minecraft/services/minecraftConnector";

type CommandResult = {
  command: string;
  response: string;
};

const DEFAULT_TEST_COMMAND =
  "say Kamura Gacha Studio Test";

export function MinecraftCommandTester() {
  const [
    command,
    setCommand,
  ] = useState(
    DEFAULT_TEST_COMMAND,
  );

  const [
    result,
    setResult,
  ] = useState<CommandResult | null>(
    null,
  );

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(
    null,
  );

  const [
    isSending,
    setIsSending,
  ] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isSending) {
      return;
    }

    const normalizedCommand =
      command.trim();

    if (!normalizedCommand) {
      setResult(null);
      setErrorMessage(
        "送信するMinecraftコマンドを入力してください。",
      );

      return;
    }

    setIsSending(true);
    setResult(null);
    setErrorMessage(null);

    try {
      const response =
        await sendMinecraftCommand(
          normalizedCommand,
        );

      setResult({
        command:
          response.command,
        response:
          response.response ||
          "レスポンスなし",
      });
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error),
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="border-t border-slate-100 bg-white px-6 py-5">
      <div className="rounded-2xl border border-violet-100 bg-violet-50/40 p-4">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <Terminal
              aria-hidden="true"
              size={17}
            />
          </div>

          <div>
            <h4 className="text-sm font-black text-slate-900">
              Minecraftコマンドテスト
            </h4>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              RCON経由でMinecraftサーバーへコマンドを直接送信します。
            </p>
          </div>
        </div>

        <form
          className="mt-4"
          onSubmit={
            handleSubmit
          }
        >
          <label
            htmlFor="minecraft-command-tester"
            className="text-xs font-black text-slate-600"
          >
            コマンド
          </label>

          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              id="minecraft-command-tester"
              type="text"
              value={command}
              onChange={(event) => {
                setCommand(
                  event.target.value,
                );
              }}
              disabled={isSending}
              autoComplete="off"
              spellCheck={false}
              placeholder="say Kamura Gacha Studio Test"
              className="min-h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-wait disabled:bg-slate-100"
            />

            <button
              type="submit"
              disabled={
                isSending ||
                !command.trim()
              }
              className={[
                "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-sm font-black transition",
                isSending ||
                !command.trim()
                  ? "cursor-not-allowed bg-slate-200 text-slate-400"
                  : "bg-violet-600 text-white shadow-sm shadow-violet-200 hover:bg-violet-700",
              ].join(" ")}
            >
              {isSending ? (
                <LoaderCircle
                  aria-hidden="true"
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Send
                  aria-hidden="true"
                  size={17}
                />
              )}

              {isSending
                ? "送信中"
                : "テスト送信"}
            </button>
          </div>
        </form>

        {result ? (
          <div
            role="status"
            className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3"
          >
            <div className="flex items-start gap-2">
              <CheckCircle2
                aria-hidden="true"
                size={17}
                className="mt-0.5 shrink-0 text-emerald-600"
              />

              <div className="min-w-0">
                <p className="text-xs font-black text-emerald-800">
                  コマンドを実行しました
                </p>

                <dl className="mt-2 space-y-1 text-xs leading-5 text-emerald-900">
                  <div className="flex min-w-0 gap-2">
                    <dt className="shrink-0 font-black">
                      コマンド:
                    </dt>

                    <dd className="min-w-0 break-all font-mono">
                      {result.command}
                    </dd>
                  </div>

                  <div className="flex min-w-0 gap-2">
                    <dt className="shrink-0 font-black">
                      応答:
                    </dt>

                    <dd className="min-w-0 break-words">
                      {result.response}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        ) : null}

        {errorMessage ? (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3"
          >
            <div className="flex items-start gap-2">
              <CircleAlert
                aria-hidden="true"
                size={17}
                className="mt-0.5 shrink-0 text-rose-600"
              />

              <div>
                <p className="text-xs font-black text-rose-800">
                  コマンドの送信に失敗しました
                </p>

                <p className="mt-1 break-words text-xs leading-5 text-rose-700">
                  {errorMessage}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <p className="mt-3 text-[11px] leading-5 text-slate-400">
          先頭の「/」は付けても付けなくても実行できます。
        </p>
      </div>
    </div>
  );
}

function getErrorMessage(
  error: unknown,
): string {
  if (
    error instanceof Error
  ) {
    return error.message;
  }

  if (
    typeof error === "string"
  ) {
    return error;
  }

  try {
    return JSON.stringify(
      error,
    );
  } catch {
    return String(error);
  }
}