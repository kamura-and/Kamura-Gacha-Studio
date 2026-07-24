import type { ActionDefinition } from "@/core/actions";
import { waitAction } from "./actions/waitAction";

export const coreActionPack: ActionDefinition[] = [
  waitAction,
];