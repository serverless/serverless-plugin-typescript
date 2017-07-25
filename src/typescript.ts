import * as ts from 'typescript'
import * as fs from 'fs-p'
import * as _ from 'lodash'
import { ServerlessFunction } from './types'
import * as path from 'path'

export function makeDefaultTypescriptConfig() {
  const defaultTypescriptConfig: ts.CompilerOptions = {
    preserveConstEnums: true,
    strictNullChecks: true,
    sourceMap: true,
    target: ts.ScriptTarget.ES5,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    lib: ['lib.es2015.d.ts'],
    rootDir: './',
  }

  return defaultTypescriptConfig
}

export function extractFileNames(functions: { [key: string]: ServerlessFunction }): string[] {
  return _.values(functions)
    .map(fn => fn.handler)
    .map(h => {
      const fnName = _.last(h.split('.'))
      const fnNameLastAppearanceIndex = h.lastIndexOf(fnName)
      // replace only last instance to allow the same name for file and handler
      return h.substring(0, fnNameLastAppearanceIndex) + 'ts'
    })
}

export async function run(fileNames: string[], options: ts.CompilerOptions): Promise<string[]> {
  options.listEmittedFiles = true
  const program = ts.createProgram(fileNames, options)

  const emitResult = program.emit()

  const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)

  allDiagnostics.forEach(diagnostic => {
    if (!diagnostic.file) {
      console.log(diagnostic)
    }
    const {line, character} = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
    console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`)
  })

  if (emitResult.emitSkipped) {
    throw new Error('Typescript compilation failed')
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
  logger?: { log: (str: string) => void }
): ts.CompilerOptions {
  const configFilePath = path.join(cwd, 'tsconfig.json')

  if (fs.existsSync(configFilePath)) {

    const configFileText = fs.readFileSync(configFilePath).toString()
    const result = ts.parseConfigFileTextToJson(configFilePath, configFileText)
    if (result.error) {
      throw new Error(JSON.stringify(result.error))
    }

    const configParseResult = ts.parseJsonConfigFileContent(result.config, ts.sys, path.dirname(configFilePath))
    if (configParseResult.errors.length > 0) {
      throw new Error(JSON.stringify(configParseResult.errors))
    }

    if (logger) {
      logger.log(`Using local tsconfig.json`)
    }

    // disallow overrriding rootDir
    if (path.resolve(configParseResult.options.rootDir) !== path.resolve(cwd) && logger) {
      logger.log('Warning: "rootDir" from local tsconfig.json is overriden')
    }
    configParseResult.options.rootDir = cwd

    return configParseResult.options
  }

  return makeDefaultTypescriptConfig()
}
