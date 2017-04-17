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
  }
}

export interface ServerlessOptions {

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
