declare namespace Serverless {
  interface Instance {
    cli: {
      log(str: string): void
    }

    config: {
      servicePath: string
    }

    service: {
      provider: {
        name: string
        runtime?: string
      }
      functions: {
        [key: string]: Serverless.Function
      }
      layers: { [key: string]: Serverless.Layer }
      package: Serverless.Package
      getAllFunctions(): string[]
      getAllLayers(): string[]
      custom?: {
        serverlessPluginTypescript?: {
          tsConfigFileLocation: string
        }
      }
    }

    pluginManager: PluginManager
  }

  interface Options {
    function?: string
    watch?: boolean
    extraServicePath?: string
  }

  interface Function {
    handler?: string
    package: Serverless.Package
    runtime?: string
    image?: Serverless.Image
  }

  interface Image {
    name: string
  }
  interface Layer {
    handler: string
    package: Serverless.Package
  }

  interface Package {
    include: string[]
    exclude: string[]
    patterns: string[]
    artifact?: string
    individually?: boolean
  }

  type CommandsDefinition = Record<
      string,
      {
        lifecycleEvents?: string[]
        commands?: CommandsDefinition
        usage?: string
        options?: {
          [name: string]: {
            type: string
            usage: string
            required?: boolean
            shortcut?: string
          }
        }
      }
      >

  interface PluginManager {
    spawn(command: string): Promise<void>
  }
}
