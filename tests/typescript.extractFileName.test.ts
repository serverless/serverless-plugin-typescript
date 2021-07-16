import {extractFileNames} from '../src/typescript'
import * as path from 'path'

const functions: { [key: string]: Serverless.Function } = {
    hello: {
        handler: 'tests/assets/hello.handler',
        package: {
            include: [],
            exclude: [],
            patterns: []
        }
    },
    world: {
        handler: 'tests/assets/world.handler',
        package: {
            include: [],
            exclude: [],
            patterns: []
        }
    },
    js: {
        handler: 'tests/assets/jsfile.create',
        package: {
            include: [],
            exclude: [],
            patterns: []
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
