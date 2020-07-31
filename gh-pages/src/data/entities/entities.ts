export interface TerraformPlan {
  resourceChanges: TerraformPlanResourceChange[]
}

export interface TerraformPlanResourceChange {
  address: string
  moduleAddress?: string
  type: string
  name: string
  change: TerraformPlanResourceChangeChange
}

export interface TerraformPlanResourceChangeChange {
  actions: string[]
  before: { [key: string]: unknown } | null
  after: { [key: string]: unknown } | null
  afterUnknown: { [key: string]: unknown }
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
