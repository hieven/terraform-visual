import { TerraformReader } from '@app/components'

export class Manager implements TerraformReader.Types.Manager {
  async getStats(
    req: TerraformReader.Types.GetStatsRequest,
  ): Promise<TerraformReader.Types.GetStatsResponse> {
    const planJson = JSON.parse(req.file.toString()) as Plan

    const stats: TerraformReader.Types.GetStatsResponse = {
      add: 0,
      change: 0,
      destroy: 0,
    }

    for (const resource of planJson.resource_changes) {
      for (const action of resource.change.actions) {
        switch (action) {
          case ChangeAction.Create: {
            stats.add++
            break
          }
          case ChangeAction.Update: {
            stats.change++
            break
          }
          case ChangeAction.Delete: {
            stats.destroy++
            break
          }
        }
      }
    }

    return stats
  }
}

// TODO: Terraform types can be shared with client
interface Plan {
  resource_changes: {
    change: {
      actions: string[]
    }
  }[]
}

enum ChangeAction {
  Noop = 'no-op',
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}
