import { Entities } from '@app/data'

export const TerraformPlan = {
  fromJsonStr(jsonStr: string): Entities.TerraformPlan {
    const planJson = JSON.parse(jsonStr)
    return TerraformPlan.fromJson(planJson)
  },

  fromJson(planJson: { [key: string]: any }): Entities.TerraformPlan {
    const plan: Entities.TerraformPlan = { resource_changes: [] }

    for (const resource_change of planJson.resource_changes) {
      const resourceChange: Entities.TerraformPlanResourceChange = {
        address: resource_change.address,
        module_address: resource_change.module_address,
        type: resource_change.type,
        name: resource_change.name,
        change: {
          actions: resource_change.change.actions,
          before: resource_change.change.before,
          after: resource_change.change.after,
          after_unknown: resource_change.change.after_unknown,
        },
      }

      plan.resource_changes.push(resourceChange)
    }

    return plan
  },
}

export const TerraformPlanResourceChangeChange = {
  getActionAlias(
    change: Entities.TerraformPlanResourceChangeChange,
  ): Entities.TerraformPlanResourceChangeChangeActionAlias {
    if (change.actions[0] === Entities.TerraformPlanResourceChangeChangeAction.Noop) {
      return Entities.TerraformPlanResourceChangeChangeActionAlias.Noop
    }

    if (change.actions[0] === Entities.TerraformPlanResourceChangeChangeAction.Create) {
      if (change.actions[1] === Entities.TerraformPlanResourceChangeChangeAction.Delete) {
        return Entities.TerraformPlanResourceChangeChangeActionAlias.CreateDelete
      } else {
        return Entities.TerraformPlanResourceChangeChangeActionAlias.Create
      }
    }

    if (change.actions[0] === Entities.TerraformPlanResourceChangeChangeAction.Update) {
      return Entities.TerraformPlanResourceChangeChangeActionAlias.Update
    }

    if (change.actions[0] === Entities.TerraformPlanResourceChangeChangeAction.Delete) {
      if (change.actions[1] === Entities.TerraformPlanResourceChangeChangeAction.Create) {
        return Entities.TerraformPlanResourceChangeChangeActionAlias.DeleteCreate
      } else {
        return Entities.TerraformPlanResourceChangeChangeActionAlias.Delete
      }
    }

    return Entities.TerraformPlanResourceChangeChangeActionAlias.Unknown
  },

  getDiff(
    change: Entities.TerraformPlanResourceChangeChange,
  ): Entities.TerraformPlanResourceChangeChangeDiff {
    const diff: Entities.TerraformPlanResourceChangeChangeDiff = {}

    if (change.before) {
      for (const field of Object.keys(change.before)) {
        if (!diff[field]) {
          diff[field] = []
        }

        const beofreChange = change.before[field]
        if (typeof beofreChange === 'string') {
          diff[field].push(beofreChange)
        } else {
          diff[field].push(JSON.stringify(change.before[field]))
        }
      }
    }

    for (const field of Object.keys(change.after_unknown)) {
      if (!diff[field]) {
        diff[field] = []
      }

      diff[field].push('(known after apply)')
    }

    if (change.after) {
      for (const field of Object.keys(change.after)) {
        if (!diff[field]) {
          diff[field] = []
        }

        const afterChange = change.after[field]
        if (typeof afterChange === 'string') {
          diff[field].push(afterChange)
        } else {
          diff[field].push(JSON.stringify(change.after[field]))
        }
      }
    }

    return diff
  },
}
