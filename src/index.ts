import * as path from 'path'
import * as fs from 'fs-p'
import * as _ from 'lodash'
import * as globby from 'globby'

import { ServerlessOptions, ServerlessInstance } from './types'
import * as typescript from './typescript'

// Folders
const serverlessFolder = '.serverless'
const buildFolder = '.build'

class ServerlessPlugin {

  private originalServicePath: string

  serverless: ServerlessInstance
  options: ServerlessOptions
  commands:{ [key: string]: any }
  hooks: { [key: string]: Function }

  constructor(serverless: ServerlessInstance, options: ServerlessOptions) {
    this.serverless = serverless
    this.options = options

    this.hooks = {
      'before:deploy:createDeploymentArtifacts': this.beforeCreateDeploymentArtifacts.bind(this),
      'after:deploy:createDeploymentArtifacts': this.afterCreateDeploymentArtifacts.bind(this),
      'before:invoke:local:invoke': this.beforeCreateDeploymentArtifacts.bind(this),
      'after:invoke:local:invoke': this.cleanup.bind(this),
    }
    this.commands = {
      ts: {
        commands: {
          invoke: {
            usage: 'Run a function locally from the tsc output bundle',
            lifecycleEvents: [
              'invoke',
            ],
            options: {
              function: {
                usage: 'Name of the function',
                shortcut: 'f',
                required: true,
              },
              path: {
                usage: 'Path to JSON file holding input data',
                shortcut: 'p',
              },
            },
          },
        },
      },
    }
  }

  async beforeCreateDeploymentArtifacts(): Promise<void> {
    this.serverless.cli.log('Compiling with Typescript...')

    // Save original service path and functions
    this.originalServicePath = this.serverless.config.servicePath

    // Fake service path so that serverless will know what to zip
    this.serverless.config.servicePath = path.join(this.originalServicePath, buildFolder)

    const tsFileNames = typescript.extractFileNames(this.serverless.service.functions)
    const tsconfig = typescript.getTypescriptConfig(this.originalServicePath)

    for (const fnName in this.serverless.service.functions) {
      const fn = this.serverless.service.functions[fnName]
      fn.package = fn.package || {
          exclude: [],
          include: [],
        }
      fn.package.exclude = _.uniq([...fn.package.exclude, 'node_modules/serverless-plugin-typescript'])
    }

    tsconfig.outDir = buildFolder

    await typescript.run(tsFileNames, tsconfig)

    // include node_modules into build
    if (!fs.existsSync(path.resolve(path.join(buildFolder, 'node_modules')))) {
      fs.symlinkSync(path.resolve('node_modules'), path.resolve(path.join(buildFolder, 'node_modules')))
    }
    
    // include any "extras" from the "include" section
    if (this.serverless.service.package.include && this.serverless.service.package.include.length > 0){
      const files = await globby(this.serverless.service.package.include)
      
      for (const filename of files) {
        const destFileName = path.resolve(path.join(buildFolder, filename))
        const dirname = path.dirname(destFileName)
        
        if (!fs.existsSync(dirname)) {
          fs.mkdirpSync(dirname)
        }
        
        if (!fs.existsSync(destFileName)) {
          fs.copySync(path.resolve(filename), path.resolve(path.join(buildFolder, filename)))
        }
      }
    }
  }

  async afterCreateDeploymentArtifacts(): Promise<void> {
    // Restore service path
    this.serverless.config.servicePath = this.originalServicePath

    // Copy .build to .serverless
    await fs.copy(
      path.join(this.originalServicePath, buildFolder, serverlessFolder),
      path.join(this.originalServicePath, serverlessFolder)
    )

    this.serverless.service.package.artifact = path.join(this.originalServicePath, serverlessFolder, path.basename(this.serverless.service.package.artifact))

    // Remove temp build folder
    fs.removeSync(path.join(this.originalServicePath, buildFolder))
  }

  async cleanup(): Promise<void> {
    // Restore service path
    this.serverless.config.servicePath = this.originalServicePath
    // Remove temp build folder
    fs.removeSync(path.join(this.originalServicePath, buildFolder))
  }

}

module.exports = ServerlessPlugin
