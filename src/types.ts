export interface ServerlessInstance {
  cli: {
    log(str: string)
  }
  config: {
    servicePath: string
  }
  service: {
    provider: {
      name: string
    }
    functions: { [key: string]: ServerlessFunction }
    layers: { [key: string]: ServerlessLayer }
    package: ServerlessPackage
    getAllFunctions: () => string[]
    getAllLayers: () => string[]
  }
  pluginManager: PluginManager
}

export interface ServerlessOptions {
  function?: string
  watch?: boolean
  extraServicePath?: string
}

export interface ServerlessLayer {
  handler: string
  package: ServerlessPackage
}

export interface ServerlessFunction {
  handler: string
  package: ServerlessPackage
}

export interface ServerlessPackage {
  include: string[]
  exclude: string[]
  artifact?: string
  individually?: boolean
}

export interface PluginManager {
  spawn(command: string): Promise<void>
}
