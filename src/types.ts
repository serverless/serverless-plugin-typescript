export interface ServerlessInstance {
  cli: {
    log(str: string)
  }
  config: {
    servicePath: string
  }
  service: {
    functions: { [key: string]: ServerlessFunction }
    package: ServerlessPackage
    getFunction: (name: string) => any
    custom?: any
  }
}

export interface ServerlessOptions {
  function?: string
  extraServicePath?: string
}

export interface ServerlessFunction {
  handler: string
  package: ServerlessPackage
}

export interface ServerlessPackage {
  include: string[]
  exclude: string[]
  artifact?: string
}
