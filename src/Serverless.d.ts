declare namespace Serverless {

  interface Instance {
    cli: {
      log(str: string): void
    }

    config: {
      servicePath: string
    }

    service: Service
    pluginManager: PluginManager
  }

  interface Options {
    function?: string
    watch?: boolean
    extraServicePath?: string
  }

  interface Function {
    handler: string
    package: Serverless.Package
    runtime?: string
  }

  interface Package {
    include: string[]
    exclude: string[]
    artifact?: string
    individually?: boolean
  }

  type FunctionMap = Record<string, Serverless.Function>

  interface Service {
    provider: {
      name: string
      runtime?: string
    }
    functions: FunctionMap
    package: Serverless.Package
    getAllFunctions(): string[]
  }

  interface PluginManager {
    spawn(command: string): Promise<void>
  }
}