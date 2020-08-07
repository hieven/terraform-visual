export interface TerraformPlan {
  resource_changes: TerraformPlanResourceChange[]
}

export interface TerraformPlanResourceChange {
  address: string
  module_address?: string
  type: string
  name: string
  change: TerraformPlanResourceChangeChange
}

export interface TerraformPlanResourceChangeChange {
  actions: string[]
  before: { [key: string]: unknown } | null
  after: { [key: string]: unknown } | null
  after_unknown: { [key: string]: unknown }
}

export enum TerraformPlanResourceChangeChangeAction {
  Noop = 'no-op',
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}

export enum TerraformPlanResourceChangeChangeActionAlias {
  Unknown,
  Noop,
  Create,
  Update,
  Delete,
  CreateDelete,
  DeleteCreate,
}

export interface TerraformPlanResourceChangeChangeDiff {
  [field: string]: string[]
}
