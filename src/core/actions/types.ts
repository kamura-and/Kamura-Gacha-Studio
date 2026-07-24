export type ActionIntent =
  | "sabotage"
  | "support"
  | "presentation"
  | "system";

export type ActionOutputTarget =
  | "minecraft"
  | "overlay"
  | "sound"
  | "discord"
  | "obs"
  | "wait";

export type ActionParameterValue =
  | string
  | number
  | boolean
  | null;

export type ActionParameterValues = Record<
  string,
  ActionParameterValue
>;

export type ActionParameterOption = {
  label: string;
  value: string | number;
};

type BaseActionParameterDefinition = {
  key: string;
  label: string;
  description?: string;
  required?: boolean;
};

export type NumberActionParameterDefinition =
  BaseActionParameterDefinition & {
    type: "number";
    defaultValue: number;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
  };

export type StringActionParameterDefinition =
  BaseActionParameterDefinition & {
    type: "string";
    defaultValue: string;
    placeholder?: string;
  };

export type BooleanActionParameterDefinition =
  BaseActionParameterDefinition & {
    type: "boolean";
    defaultValue: boolean;
  };

export type SelectActionParameterDefinition =
  BaseActionParameterDefinition & {
    type: "select";
    defaultValue: string | number;
    options: ActionParameterOption[];
  };

export type ActionParameterDefinition =
  | NumberActionParameterDefinition
  | StringActionParameterDefinition
  | BooleanActionParameterDefinition
  | SelectActionParameterDefinition;

export type GeneratedActionCommand = {
  type: ActionOutputTarget;
  value: string;
  delay?: number;
  enabled?: boolean;
};

export type ActionDefinition = {
  id: string;
  pluginId: string;

  name: string;
  description: string;

  icon?: string;

  intent: ActionIntent;
  category: string;

  tags?: string[];
  capabilities?: string[];
  outputTargets?: ActionOutputTarget[];

  impact?: number;

  parameters?: ActionParameterDefinition[];

  buildCommands: (
    values: ActionParameterValues,
  ) => GeneratedActionCommand[];
};

export type ActionSearchSort =
  | "relevance"
  | "name-asc"
  | "name-desc"
  | "impact-desc"
  | "impact-asc";

export type ActionSearchQuery = {
  query?: string;

  pluginIds?: string[];
  intents?: ActionIntent[];
  categories?: string[];
  capabilities?: string[];
  tags?: string[];
  outputTargets?: ActionOutputTarget[];

  sort?: ActionSearchSort;
};

export type ActionFacetItem = {
  value: string;
  count: number;
};

export type ActionSearchFacets = {
  pluginIds: ActionFacetItem[];
  intents: ActionFacetItem[];
  categories: ActionFacetItem[];
  capabilities: ActionFacetItem[];
  tags: ActionFacetItem[];
  outputTargets: ActionFacetItem[];
};

export type ActionSearchResult = {
  actions: ActionDefinition[];
  total: number;
  facets: ActionSearchFacets;
};