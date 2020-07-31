import { Command } from 'commander'
import fs from 'fs-extra'
import path from 'path'

const TEMPLATE_DIR = path.resolve(__dirname, '../template')
const TEMPLATE_DIST_PATH = path.resolve(TEMPLATE_DIR, 'dist')

interface InputOpts {
  out: string
  plan: string
}

async function main() {
  const callerPath = process.cwd()

  const program = new Command()

  program.option('--out <path>', 'set the output dir', callerPath)
  program.requiredOption('--plan <path>', 'set the relative path to Terraform plan')
  program.parse(process.argv)

  // TODO: validation
  const inputOpts = program.opts() as InputOpts
  const outDirPath = path.resolve(callerPath, inputOpts.out, 'terraform-visual-report')
  const planFilePath = path.resolve(callerPath, inputOpts.plan)

  console.log(`outDirPath:   ${outDirPath}`)
  console.log(`planFilePath: ${planFilePath}`)

  await fs.copy(TEMPLATE_DIST_PATH, outDirPath)

  const tfBuffer = await fs.readFile(planFilePath)
  const tfContent = tfBuffer.toString()
  await fs.writeFile(path.resolve(outDirPath, 'plan.js'), `window.TF_PLAN = ${tfContent}`)

  const indexFilePath = path.resolve(outDirPath, 'index.html')
  console.log('')
  console.log('\x1b[32m%s\x1b[0m', 'Report generated successfully!')
  console.log('\x1b[32m%s\x1b[0m', `Please run "open ${path.relative(callerPath, indexFilePath)}"`)
}

try {
  main()
} catch (err) {
  console.log('Unhandled error', err)
}
