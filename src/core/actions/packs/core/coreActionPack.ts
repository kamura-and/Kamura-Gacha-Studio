import type { ActionDefinition } from "@/core/actions";

import { legacyCommandAction } from "./actions/legacyCommandAction";
import { waitAction } from "./actions/waitAction";


export const coreActionPack: ActionDefinition[] = [
  legacyCommandAction,
  waitAction,
];