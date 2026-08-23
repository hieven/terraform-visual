// This file is not going through babel transformation.
// So, we write it in vanilla JS
// (But you could use ES2015 features supported by your Node.js version)

const debug = process.env.NODE_ENV !== 'production'
const basePath = debug ? '' : '/terraform-visual'

module.exports = {
  output: 'export',
  basePath,
  assetPrefix: debug ? '' : `${basePath}/`,
  outputFileTracingRoot: __dirname,
}
