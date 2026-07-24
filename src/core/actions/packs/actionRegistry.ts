import { ActionRegistry } from "@/core/actions";
import { coreActionPack } from "./core/coreActionPack";

export const actionRegistry = new ActionRegistry();

actionRegistry.registerMany([
  ...coreActionPack,
]);