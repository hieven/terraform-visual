import {
  LinkCreator,
  PullRequestCommenter,
  PullRequestFinder,
  TerraformReader,
} from '@app/components'
import * as Config from '@app/config'
import { BlobStore } from '@app/data'
import { Http } from '@app/transports'

async function main(): Promise<void> {
  const configManager = new Config.Manager()
  const config = configManager.load()

  // data
  const blobStoreManager = await BlobStore.getManager(config.data.blobStore)

  // components
  const linkCreator = new LinkCreator.Manager(config.components.linkCreator)
  const terraformReader = new TerraformReader.Manager()
  const pullRequestFinder = await PullRequestFinder.getManager(config.components.pullRequestFinder)
  const pullRequestCommenter = await PullRequestCommenter.getManager(
    config.components.pullRequestCommenter,
    {
      linkCreator,
      terraformReader,
    },
  )

  // transports
  const httpServer = new Http.Server(config.transports.http, {
    linkCreator,
    pullRequestFinder,
    pullRequestCommenter,
    blobStoreManager,
  })

  await httpServer.start(() => {
    console.log(`Listening on ${config.transports.http.port}`)
  })
}

main()
