import * as ts from 'typescript'
import * as fs from 'fs-p'
import * as _ from 'lodash'
import { ServerlessFunction } from './types'
import * as path from 'path'

export function extractFileNames(functions: { [key: string]: ServerlessFunction }): string[] {
  return _.values(functions)
    .map(fn => fn.handler)
    .map(h => {
      const fnName = _.last(h.split('.'))
      return h.replace(fnName, 'ts')
    })
}

export async function run(fileNames: string[], options: ts.CompilerOptions): Promise<string[]> {
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

  return fileNames.map(f => f.replace(/\.ts$/, '.js'))
}

export function getTypescriptConfig(cwd: string): ts.CompilerOptions {
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

    console.log(`Using local tsconfig.json`)

    return configParseResult.options
  }

  const defaultTypescriptConfig: ts.CompilerOptions = {
    preserveConstEnums: true,
    strictNullChecks: true,
    sourceMap: true,
    target: ts.ScriptTarget.ES5,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    lib: ['lib.es2015.d.ts'],
  }

  return defaultTypescriptConfig
}
