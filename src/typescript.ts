import * as ts from 'typescript'
import * as fs from 'fs-extra'
import * as _ from 'lodash'
import * as path from 'path'
import {log} from '@serverless/utils/log'

export function makeDefaultTypescriptConfig() {
  const defaultTypescriptConfig: ts.CompilerOptions = {
    preserveConstEnums: true,
    strictNullChecks: true,
    sourceMap: true,
    allowJs: true,
    target: ts.ScriptTarget.ES5,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    lib: ['lib.es2015.d.ts'],
    rootDir: './',
  }

  return defaultTypescriptConfig
}

export function extractFileNames(cwd: string, provider: string, functions?: { [key: string]: Serverless.Function }): string[] {
  // The Google provider will use the entrypoint not from the definition of the
  // handler function, but instead from the package.json:main field, or via a
  // index.js file. This check reads the current package.json in the same way
  // that we already read the tsconfig.json file, by inspecting the current
  // working directory. If the packageFile does not contain a valid main, then
  // it instead selects the index.js file.
  if (provider === 'google') {
    const packageFilePath = path.join(cwd, 'package.json')
    if (fs.existsSync(packageFilePath)) {

      // Load in the package.json file.
      const packageFile = JSON.parse(fs.readFileSync(packageFilePath).toString())

      // Either grab the package.json:main field, or use the index.ts file.
      // (This will be transpiled to index.js).
      const main = packageFile.main ? packageFile.main.replace(/\.js$/, '.ts') : 'index.ts'

      // Check that the file indeed exists.
      if (!fs.existsSync(path.join(cwd, main))) {
        throw new Error(`Typescript compilation failed: Cannot locate entrypoint, ${main} not found`)
      }

      return [main]
    }
  }

  return _.values(functions)
    .map(fn => fn.handler)
    .map(h => {
      const fnName = _.last(h.split('.'))
      const fnNameLastAppearanceIndex = h.lastIndexOf(fnName)
      // replace only last instance to allow the same name for file and handler
      const fileName = h.substring(0, fnNameLastAppearanceIndex)

      // Check if the .ts files exists. If so return that to watch
      if (fs.existsSync(path.join(cwd, fileName + 'ts'))) {
        return fileName + 'ts'
      }

      // Check if the .js files exists. If so return that to watch
      if (fs.existsSync(path.join(cwd, fileName + 'js'))) {
        return fileName + 'js'
      }

      // Can't find the files. Watch will have an exception anyway. So throw one with error.
      throw new Error(`Typescript compilation failed. Please ensure handlers exists with ext .ts or .js.\nCannot locate handler: ${fileName} not found.`)
    })
}

export async function run(fileNames: string[], options: ts.CompilerOptions): Promise<string[]> {
  options.listEmittedFiles = true
  const program = ts.createProgram(fileNames, options)

  const emitResult = program.emit()

  const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)

  allDiagnostics.forEach(diagnostic => {
    if (!diagnostic.file) {
      log.verbose(JSON.stringify(diagnostic))
    }
    const {line, character} = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
    log.verbose(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`)
  })

  if (emitResult.emitSkipped) {
    throw new Error('TypeScript compilation failed')
  }

  return emitResult.emittedFiles.filter(filename => filename.endsWith('.js'))
}

/*
 * based on rootFileNames returns list of all related (e.g. imported) source files
 */
export function getSourceFiles(
  rootFileNames: string[],
  options: ts.CompilerOptions
): string[] {
  const program = ts.createProgram(rootFileNames, options)
  const programmFiles = program.getSourceFiles()
    .map(file => file.fileName)
    .filter(file => {
      return file.split(path.sep).indexOf('node_modules') < 0
    })
  return programmFiles
}

export function getTypescriptConfig(
  cwd: string,
  tsConfigFileLocation: string = 'tsconfig.json',
  shouldLog?: boolean
): ts.CompilerOptions {
  const configFilePath = path.join(cwd, tsConfigFileLocation)

  if (fs.existsSync(configFilePath)) {
    const configFileText = fs.readFileSync(configFilePath).toString()
    const result = ts.parseConfigFileTextToJson(configFilePath, configFileText)
    if (result.error) {
      try {
        throw new Error(JSON.stringify(result.error))
      } catch (err) {
        throw new Error('Invalid TSConfig file - is this file JSON format?')
      }
    }

    const configParseResult = ts.parseJsonConfigFileContent(result.config, ts.sys, path.dirname(configFilePath))
    if (configParseResult.errors.length > 0) {
      throw new Error(JSON.stringify(configParseResult.errors))
    }

    if (shouldLog) {
      log.verbose(`Using local tsconfig.json - ${tsConfigFileLocation}`)
    }

    // disallow overrriding rootDir
    if (configParseResult.options.rootDir && path.resolve(configParseResult.options.rootDir) !== path.resolve(cwd) && log) {
      log.warning('Typescript: "rootDir" from local tsconfig.json is overridden')
    }
    configParseResult.options.rootDir = cwd

    return configParseResult.options
  }

  return makeDefaultTypescriptConfig()
}
