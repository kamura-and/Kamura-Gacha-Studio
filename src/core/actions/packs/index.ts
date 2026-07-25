import { ActionRegistry } from "@/core/actions";

import { coreActionPack } from "@/core/actions/packs/core/coreActionPack";
import { bedrockBoxActionPack } from "@/core/actions/packs/minecraft/bedrockBox/bedrockBoxActionPack";

export const actionRegistry = new ActionRegistry();

actionRegistry.registerMany([
  ...coreActionPack,
  ...bedrockBoxActionPack,
]);