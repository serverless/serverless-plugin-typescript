import * as path from 'path'
import * as fs from 'fs-extra'
import * as _ from 'lodash'
import * as globby from 'globby'

import * as typescript from './typescript'
import { watchFiles } from './watchFiles'

const SERVERLESS_FOLDER = '.serverless'
const BUILD_FOLDER = '.build'

export class TypeScriptPlugin {
  private originalServicePath: string
  private isWatching: boolean

  serverless: Serverless.Instance
  options: Serverless.Options
  hooks: { [key: string]: Function }

  constructor(serverless: Serverless.Instance, options: Serverless.Options) {
    this.serverless = serverless
    this.options = options

    this.hooks = {
      'before:run:run': async () => {
        await this.compileTs()
      },
      'before:offline:start': async () => {
        await this.compileTs()
        this.watchAll()
      },
      'before:offline:start:init': async () => {
        await this.compileTs()
        this.watchAll()
      },
      'before:package:createDeploymentArtifacts': this.compileTs.bind(this),
      'after:package:createDeploymentArtifacts': this.cleanup.bind(this),
      'before:deploy:function:packageFunction': this.compileTs.bind(this),
      'after:deploy:function:packageFunction': this.cleanup.bind(this),
      'before:invoke:local:invoke': async () => {
        const emitedFiles = await this.compileTs()
        if (this.isWatching) {
          emitedFiles.forEach(filename => {
            const module = require.resolve(path.resolve(this.originalServicePath, filename))
            delete require.cache[module]
          })
        }
      },
      'after:invoke:local:invoke': () => {
        if (this.options.watch) {
          this.watchFunction()
          this.serverless.cli.log('Waiting for changes...')
        }
      }
    }
  }

  get functions() {
    const { options } = this
    const { service } = this.serverless

    if (options.function) {
      return {
        [options.function]: service.functions[this.options.function]
      }
    }

    return service.functions
  }

  get rootFileNames() {
    return typescript.extractFileNames(
      this.originalServicePath,
      this.serverless.service.provider.name,
      this.functions
    )
  }

  prepare() {
    // exclude serverless-plugin-typescript
    for (const fnName in this.functions) {
      const fn = this.functions[fnName]
      fn.package = fn.package || {
        exclude: [],
        include: [],
      }

      // Add plugin to excluded packages or an empty array if exclude is undefined
      fn.package.exclude = _.uniq([...fn.package.exclude || [], 'node_modules/serverless-plugin-typescript'])
    }
  }

  async watchFunction(): Promise<void> {
    if (this.isWatching) {
      return
    }

    this.serverless.cli.log(`Watch function ${this.options.function}...`)

    this.isWatching = true
    watchFiles(this.rootFileNames, this.originalServicePath, () => {
      this.serverless.pluginManager.spawn('invoke:local')
    })
  }

  async watchAll(): Promise<void> {
    if (this.isWatching) {
      return
    }

    this.serverless.cli.log(`Watching typescript files...`)

    this.isWatching = true
    watchFiles(this.rootFileNames, this.originalServicePath, this.compileTs)
  }

  async compileTs(): Promise<string[]> {
    this.prepare()
    this.serverless.cli.log('Compiling with Typescript...')

    if (!this.originalServicePath) {
      // Save original service path and functions
      this.originalServicePath = this.serverless.config.servicePath
      // Fake service path so that serverless will know what to zip
      this.serverless.config.servicePath = path.join(this.originalServicePath, BUILD_FOLDER)
    }

    const tsconfig = typescript.getTypescriptConfig(
      this.originalServicePath,
      this.isWatching ? null : this.serverless.cli
    )

    tsconfig.outDir = BUILD_FOLDER

    const emitedFiles = await typescript.run(this.rootFileNames, tsconfig)
    await this.copyExtras()
    this.serverless.cli.log('Typescript compiled.')
    return emitedFiles
  }

  /** Link or copy extras such as node_modules or package.include definitions */
  async copyExtras() {
    const outPkgPath = path.resolve(path.join(BUILD_FOLDER, 'package.json'))
    const outModulesPath = path.resolve(path.join(BUILD_FOLDER, 'node_modules'))

    // Link or copy node_modules and package.json to .build so Serverless can
    // exlcude devDeps during packaging
    if (!fs.existsSync(outModulesPath)) {
      await this.linkOrCopy(path.resolve('node_modules'), outModulesPath, 'junction')
    }

    if (!fs.existsSync(outPkgPath)) {
      await this.linkOrCopy(path.resolve('package.json'), outPkgPath, 'file')
    }

    // include any "extras" from the "include" section
    if (this.serverless.service.package.include && this.serverless.service.package.include.length > 0) {
      const files = await globby(this.serverless.service.package.include)

      for (const filename of files) {
        const destFileName = path.resolve(path.join(BUILD_FOLDER, filename))
        const dirname = path.dirname(destFileName)

        if (!fs.existsSync(dirname)) {
          fs.mkdirpSync(dirname)
        }

        if (!fs.existsSync(destFileName)) {
          fs.copySync(path.resolve(filename), path.resolve(path.join(BUILD_FOLDER, filename)))
        }
      }
    }
  }

  /**
   * Move built code to the serverless folder, taking into account individual
   * packaging preferences.
   */
  async moveArtifacts(): Promise<void> {
    const { service } = this.serverless

    await fs.copy(
      path.join(this.originalServicePath, BUILD_FOLDER, SERVERLESS_FOLDER),
      path.join(this.originalServicePath, SERVERLESS_FOLDER)
    )

    if (this.options.function) {
      const fn = service.functions[this.options.function]
      fn.package.artifact = path.join(
        this.originalServicePath,
        SERVERLESS_FOLDER,
        path.basename(fn.package.artifact)
      )
      return
    }

    if (service.package.individually) {
      const functionNames = service.getAllFunctions()
      functionNames.forEach(name => {
        service.functions[name].package.artifact = path.join(
          this.originalServicePath,
          SERVERLESS_FOLDER,
          path.basename(service.functions[name].package.artifact)
        )
      })
      return
    }

    service.package.artifact = path.join(
      this.originalServicePath,
      SERVERLESS_FOLDER,
      path.basename(service.package.artifact)
    )
  }

  async cleanup(): Promise<void> {
    await this.moveArtifacts()
    // Restore service path
    this.serverless.config.servicePath = this.originalServicePath
    // Remove temp build folder
    fs.removeSync(path.join(this.originalServicePath, BUILD_FOLDER))
  }

  /**
   * Attempt to symlink a given path or directory and copy if it fails with an
   * `EPERM` error.
   */
  private async linkOrCopy(srcPath: string, dstPath: string, type?: fs.FsSymlinkType): Promise<void> {
    return fs.symlink(srcPath, dstPath, type)
      .catch(error => {
        if (error.code === 'EPERM' && error.errno === -4048) {
          return fs.copy(srcPath, dstPath)
        }
        throw error
      })
  }
}

module.exports = TypeScriptPlugin
