import {extractFileNames} from '../src/typescript'
import {ServerlessFunction} from '../src/types'

const functions: { [key: string]: ServerlessFunction } = {
    hello: {
        handler: 'my-folder/hello.handler',
        package: {
            include: [],
            exclude: []
        }
    },
    world: {
        handler: 'my-folder/my-subfolder/world.handler',
        package: {
            include: [],
            exclude: []
        }
    },
    create: {
        handler: 'create.create',
        package: {
            include: [],
            exclude: []
        }
    },
}

describe('extractFileName', () => {
    it('get function filenames from serverless service', () => {
        expect(
            extractFileNames(functions),
        ).toEqual(
            [
                'my-folder/hello.ts',
                'my-folder/my-subfolder/world.ts',
                'create.ts',
            ],
        )
    })
})

