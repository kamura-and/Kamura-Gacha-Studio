/**
 * TikFinityのコンボギフトについて、
 * 前回までに処理済みのrepeatCountを保持する。
 *
 * TikFinityの実payloadでは、
 *
 * repeatCount: 1
 * repeatCount: 2
 * repeatCount: 3
 * repeatCount: 3 / repeatEnd: true
 *
 * のように累積値が送られる。
 *
 * そのため各イベントのrepeatCountを
 * そのまま発動回数として扱うと、
 * 1 + 2 + 3 = 6回発動してしまう。
 *
 * このTrackerでは前回値との差分だけを返す。
 */
export class TikFinityGiftComboTracker {
    private readonly states =
        new Map<
            string,
            number
        >();


    /**
     * 今回のgiftイベントで
     * 新しく追加されたギフト数を返す。
     */
    public consume(
        key: string,
        repeatCount: number,
        repeatEnd: boolean,
    ): number {
        const normalizedRepeatCount =
            Math.max(
                1,
                Math.floor(
                    repeatCount,
                ),
            );


        const previousRepeatCount =
            this.states.get(
                key,
            ) ?? 0;


        const delta =
            Math.max(
                0,
                normalizedRepeatCount -
                    previousRepeatCount,
            );


        if (repeatEnd) {
            /*
             * repeatEnd:trueはコンボ終了通知。
             *
             * 最終通知では直前と同じrepeatCountが
             * 再送されるケースがあるため、
             * delta計算後に状態を破棄する。
             */
            this.states.delete(
                key,
            );
        } else {
            this.states.set(
                key,
                Math.max(
                    previousRepeatCount,
                    normalizedRepeatCount,
                ),
            );
        }


        return delta;
    }


    /**
     * セッション終了等で全状態を破棄する場合に使用する。
     */
    public reset(): void {
        this.states.clear();
    }
}


export const tikFinityGiftComboTracker =
    new TikFinityGiftComboTracker();