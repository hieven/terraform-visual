import { entities } from '@app/data/entities'

export const TerraformPlan = {
  fromJsonStr(jsonStr: string): entities.TerraformPlan {
    const planJson = JSON.parse(jsonStr)
    return TerraformPlan.fromJson(planJson)
  },

  fromJson(planJson: { [key: string]: any }): entities.TerraformPlan {
    const plan: entities.TerraformPlan = { resourceChanges: [] }

    for (const resource_change of planJson.resource_changes) {
      const resourceChange: entities.TerraformPlanResourceChange = {
        address: resource_change.address,
        moduleAddress: resource_change.module_address,
        type: resource_change.type,
        name: resource_change.name,
        change: {
          actions: resource_change.change.actions,
          before: resource_change.change.before,
          after: resource_change.change.after,
          afterUnknown: resource_change.change.after_unknown,
        },
      }

      plan.resourceChanges.push(resourceChange)
    }

    return plan
  },
}

export const TerraformPlanResourceChangeChange = {
  getActionAlias(
    change: entities.TerraformPlanResourceChangeChange
  ): entities.TerraformPlanResourceChangeChangeActionAlias {
    if (
      change.actions[0] ===
      entities.TerraformPlanResourceChangeChangeAction.Noop
    ) {
      return entities.TerraformPlanResourceChangeChangeActionAlias.Noop
    }

    if (
      change.actions[0] ===
      entities.TerraformPlanResourceChangeChangeAction.Create
    ) {
      if (
        change.actions[1] ===
        entities.TerraformPlanResourceChangeChangeAction.Delete
      ) {
        return entities.TerraformPlanResourceChangeChangeActionAlias
          .CreateDelete
      } else {
        return entities.TerraformPlanResourceChangeChangeActionAlias.Create
      }
    }

    if (
      change.actions[0] ===
      entities.TerraformPlanResourceChangeChangeAction.Update
    ) {
      return entities.TerraformPlanResourceChangeChangeActionAlias.Update
    }

    if (
      change.actions[0] ===
      entities.TerraformPlanResourceChangeChangeAction.Delete
    ) {
      if (
        change.actions[1] ===
        entities.TerraformPlanResourceChangeChangeAction.Create
      ) {
        return entities.TerraformPlanResourceChangeChangeActionAlias
          .DeleteCreate
      } else {
        return entities.TerraformPlanResourceChangeChangeActionAlias.Delete
      }
    }

    return entities.TerraformPlanResourceChangeChangeActionAlias.Unknown
  },

  getDiff(
    change: entities.TerraformPlanResourceChangeChange
  ): entities.TerraformPlanResourceChangeChangeDiff {
    const diff: entities.TerraformPlanResourceChangeChangeDiff = {}

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

    for (const field of Object.keys(change.afterUnknown)) {
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
