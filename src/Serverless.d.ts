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
      }
      functions: {
        [key: string]: Serverless.Function
      }
      package: Serverless.Package
      getAllFunctions(): string[]
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

  interface Progress {
    update(message: string): void
    remove(): void
  }

  interface Utils {
    log: ((message: string) => void) & {
      verbose(message: string): void
    }
    progress: {
      create(opts?: { message?: string }): Progress;
    }
  }

  interface PluginManager {
    spawn(command: string): Promise<void>
  }
}
