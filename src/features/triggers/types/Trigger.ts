import type {
  PluginId,
} from "../../plugins/types/plugin";

import type {
  RuntimeEventCategory,
} from "../../runtime/types";

import type {
  TriggerCondition,
  TriggerConditionInput,
} from "./TriggerCondition";

import type {
  TriggerMatchMode,
} from "./TriggerMatchMode";

export type TriggerId = string;

export type Trigger = {
  id: TriggerId;
  name: string;
  description?: string;

  enabled: boolean;

  pluginId?: PluginId;
  eventCategory?: RuntimeEventCategory;
  eventType?: string;

  conditions: TriggerCondition[];
  matchMode: TriggerMatchMode;

  gachaPoolId: string;

  createdAt: number;
  updatedAt: number;
};

export type CreateTriggerInput = {
  id?: TriggerId;
  name: string;
  description?: string;

  enabled?: boolean;

  pluginId?: PluginId;
  eventCategory?: RuntimeEventCategory;
  eventType?: string;

  conditions?: TriggerConditionInput[];
  matchMode?: TriggerMatchMode;

  gachaPoolId: string;

  createdAt?: number;
  updatedAt?: number;
};

export type UpdateTriggerInput = {
  name?: string;
  description?: string;

  enabled?: boolean;

  pluginId?: PluginId | null;
  eventCategory?:
    | RuntimeEventCategory
    | null;
  eventType?: string | null;

  conditions?: TriggerConditionInput[];
  matchMode?: TriggerMatchMode;

  gachaPoolId?: string;
};