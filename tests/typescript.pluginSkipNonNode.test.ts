import * as TypeScriptPlugin from '../src/index'

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
              functions: {
                func1: {
                    handler: 'java-fn',
                    runtime: 'python3.9',
                    package:{
                        exclude: [],
                        include: [],
                        patterns: []
                    }
                },
                func2: {
                    handler: 'node-fn',
                    runtime: 'nodejs16',
                    package:{
                        exclude: [],
                        include: [],
                        patterns: []
                    }
                }
              },
              package: {
                exclude: [],
                include: [],
                patterns: []
              },
              layers: {},
              getAllLayers: jest.fn(),
              getAllFunctions: jest.fn()
            },
            pluginManager: {
                spawn: jest.fn()
            }
          }

        const plugin = new (TypeScriptPlugin as any)(slsInstance, {})

        expect(
            Object.keys(plugin.functions)
        ).toEqual(
            [
                'func2'
            ],
        )
    })
})