export type TriggerConditionOperator =
  | "equals"
  | "notEquals"
  | "greaterThan"
  | "greaterThanOrEqual"
  | "lessThan"
  | "lessThanOrEqual"
  | "contains"
  | "notContains"
  | "startsWith"
  | "endsWith"
  | "in"
  | "notIn"
  | "exists"
  | "notExists";

export type TriggerConditionPrimitive =
  | string
  | number
  | boolean
  | null;

export type TriggerConditionValue =
  | TriggerConditionPrimitive
  | TriggerConditionPrimitive[];

export type TriggerCondition = {
  id: string;
  field: string;
  operator: TriggerConditionOperator;
  value?: TriggerConditionValue;
};

export type TriggerConditionInput = {
  id?: string;
  field: string;
  operator: TriggerConditionOperator;
  value?: TriggerConditionValue;
};