import {TypeScriptPlugin} from '../src/typeScriptPlugin'

describe('TypeScriptPlugin', () => {
    it('rootFileNames includes only node runtimes', () => {
        const slsInstance: Serverless.Instance = {
            cli: {
              log: jest.fn()
            },
            config: {
              servicePath: 'servicePath'
            },
            service: {
              provider: {
                name: 'aws',
                runtime: 'nodejs99'
              },
              package: {
                individually: true,
                include: [],
                exclude: [] 
              },
              functions: {
                func1: {
                    handler: 'java-fn',
                    runtime: 'java8',
                    package: {
                        include: [],
                        exclude: []
                    }
                },
                func2: {
                    handler: 'node-fn',
                    runtime: 'nodejs99',
                    package: {
                        include: [],
                        exclude: []
                    }
                }
              },
              
              getAllFunctions: jest.fn()
            },
            pluginManager: {
                spawn: jest.fn()
            }
          }

        const plugin = new TypeScriptPlugin(slsInstance, {})

        expect(
            Object.keys(plugin.nodeFunctions)
        ).toEqual(
            [
                'func2'
            ],
        )
    })
})
