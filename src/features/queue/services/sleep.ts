export function sleep(milliseconds: number): Promise<void> {
  const safeMilliseconds = Number.isFinite(milliseconds)
    ? Math.max(0, milliseconds)
    : 0;

  return new Promise((resolve) => {
    window.setTimeout(resolve, safeMilliseconds);
  });
}