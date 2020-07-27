import * as Config from '@app/config'
import dotenv from 'dotenv'
import * as path from 'path'

export class Manager implements Config.Types.Manager {
  load(): Config.Types.Config {
    if (process.env.ENV === 'local') {
      dotenv.config({ path: path.resolve(__dirname, '.env.local') })
    }

    const config: Config.Types.Config = {
      env: process.env.NODE_ENV || '',

      components: {
        linkCreator: {
          baseUrl: process.env.COMPONENTS_LINK_CREATOR_BASE_URL || '',
        },
        pullRequestCommenter: {
          type: process.env.COMPONENTS_PULL_REQUEST_COMMENTER_TYPE || '',
          github: {
            githubToken: process.env.COMMON_GITHUB_TOKEN || '',
            botUserId: +(process.env.COMPONENTS_PULL_REQUEST_COMMENTER_GITHUB_BOT_USER_ID || -1),
          },
        },
        pullRequestFinder: {
          type: process.env.COMPONENTS_PULL_REQUEST_FINDER_TYPE || '',
          github: {
            githubToken: process.env.COMMON_GITHUB_TOKEN || '',
          },
        },
      },

      data: {
        blobStore: {
          type: process.env.DATA_BLOB_STORE_TYPE || '',
          awsS3: {
            bucket: process.env.DATA_BLOB_STORE_AWS_S3_BUCKET || '',
          },
        },
      },

      transports: {
        http: {
          port: +(process.env.TRANSPORTS_HTTP_PORT || -1),

          apis: {
            createBuild: {
              disallowedCommentBranchNames: (
                process.env.TRANSPORTS_HTTP_APIS_CREATE_BUILD_DISALLOWED_COMMENT_BRANCH_NAMES || ''
              ).split(','),
            },
            web: {
              clientDir: path.resolve(__dirname, '../../..', 'client'),
              isDevelopment: process.env.NODE_ENV === 'development',
            },
          },
        },
      },
    }

    return config
  }
}
