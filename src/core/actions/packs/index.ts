import { ActionRegistry } from "@/core/actions";

import { coreActionPack } from "./core/coreActionPack";
import { minecraftActionPack } from "./minecraft/minecraftActionPack";

export const actionRegistry = new ActionRegistry();

actionRegistry.registerMany([
  ...coreActionPack,
  ...minecraftActionPack,
]);