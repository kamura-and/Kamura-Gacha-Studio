export type MinecraftCommandCategory =
  | "all"
  | "debuff"
  | "buff"
  | "combat"
  | "movement"
  | "world"
  | "item"
  | "summon"
  | "special";

export type MinecraftCommandParameterType =
  | "text"
  | "number"
  | "select";

export type MinecraftCommandParameterOption = {
  label: string;
  value: string;
};

export type MinecraftCommandParameter = {
  key: string;
  label: string;
  type: MinecraftCommandParameterType;
  defaultValue: string;
  description?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: MinecraftCommandParameterOption[];
};

export type MinecraftCommandDefinition = {
  id: string;
  name: string;
  description: string;
  category: Exclude<MinecraftCommandCategory, "all">;
  icon: string;
  template: string;
  tags: string[];
  parameters: MinecraftCommandParameter[];
};

export type MinecraftCommandParameterValues = Record<
  string,
  string
>;

export type MinecraftCommandCategoryDefinition = {
  id: MinecraftCommandCategory;
  name: string;
  icon: string;
};