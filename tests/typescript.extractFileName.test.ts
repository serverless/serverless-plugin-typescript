import {extractFileNames} from '../src/typescript'
import * as path from 'path'

const functions: { [key: string]: Serverless.Function } = {
    hello: {
        handler: 'tests/assets/hello.handler',
        runtime: 'nodejs10.1',
        package: {
            include: [],
            exclude: []
        }
    },
    world: {
        handler: 'tests/assets/world.handler',
        runtime: 'nodejs10.1',
        package: {
            include: [],
            exclude: []
        }
    },
    js: {
        handler: 'tests/assets/jsfile.create',
        runtime: 'nodejs10.1',
        package: {
            include: [],
            exclude: []
        }
    },
}

describe('extractFileName', () => {
    it('get function filenames from serverless service for a non-google provider', () => {
        expect(
            extractFileNames(process.cwd(), 'aws', functions),
        ).toEqual(
            [
                'tests/assets/hello.ts',
                'tests/assets/world.ts',
                'tests/assets/jsfile.js',
            ],
        )
    })

    it('get function filename from serverless service for a google provider', () => {
        expect(
            extractFileNames(path.join(process.cwd(), 'example'), 'google')
        ).toEqual(
            [
                'handler.ts'
            ]
        )
    })
})
