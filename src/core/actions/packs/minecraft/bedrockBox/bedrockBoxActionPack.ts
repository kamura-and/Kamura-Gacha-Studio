import type { ActionDefinition } from "@/core/actions";

import { blackHoleAction } from "./actions/blackHoleAction";
import { clearAction } from "./actions/clearAction";
import { cometsAction } from "./actions/cometsAction";
import { dragonResetAction } from "./actions/dragonResetAction";
import { endermanAction } from "./actions/endermanAction";
import { fillAction } from "./actions/fillAction";
import { fillBlockAction } from "./actions/fillBlockAction";
import { fillRowsAction } from "./actions/fillRowsAction";
import { glassPrisonAction } from "./actions/glassPrisonAction";
import { heightDownAction } from "./actions/heightDownAction";
import { heightUpAction } from "./actions/heightUpAction";
import { loseAction } from "./actions/loseAction";
import { meteorAction } from "./actions/meteorAction";
import { radiusDownAction } from "./actions/radiusDownAction";
import { radiusUpAction } from "./actions/radiusUpAction";
import { randomTntAction } from "./actions/randomTntAction";
import { resetAction } from "./actions/resetAction";
import { superTntAction } from "./actions/superTntAction";
import { tntAction } from "./actions/tntAction";
import { tntRingAction } from "./actions/tntRingAction";
import { winAction } from "./actions/winAction";
import { zeusTntAction } from "./actions/zeusTntAction";

export const bedrockBoxActionPack: ActionDefinition[] = [
  glassPrisonAction,

  tntAction,
  randomTntAction,
  superTntAction,
  meteorAction,
  cometsAction,
  zeusTntAction,
  tntRingAction,

  blackHoleAction,
  endermanAction,

  radiusUpAction,
  radiusDownAction,
  heightUpAction,
  heightDownAction,

  fillBlockAction,
  fillRowsAction,
  fillAction,
  clearAction,

  resetAction,
  dragonResetAction,
  winAction,
  loseAction,
];