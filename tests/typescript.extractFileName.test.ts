import {extractFileNames} from '../src/typescript'
import * as path from 'path'

const functions: { [key: string]: Serverless.Function } = {
    hello: {
        handler: 'tests/assets/hello.handler',
        package: {
            include: [],
            exclude: []
        }
    },
    world: {
        handler: 'tests/assets/world.handler',
        package: {
            include: [],
            exclude: []
        },
        runtime: 'nodejs12.x'
    },
    js: {
        handler: 'tests/assets/jsfile.create',
        package: {
            include: [],
            exclude: []
        }
    },
    notActuallyTypescript: {
        handler: 'tests/assets/jsfile.create',
        package: {
            include: [],
            exclude: []
        },
        runtime: 'go1.x'
    },
}

describe('extractFileName', () => {
    describe('when the provider runtime is Node', () => {
        it('can get function filenames from serverless service for a non-google provider', () => {
            expect(
                extractFileNames(process.cwd(), 'aws', 'nodejs10.x', functions),
            ).toEqual(
                [
                    'tests/assets/hello.ts',
                    'tests/assets/world.ts',
                    'tests/assets/jsfile.js',
                ],
            )
        })

        it('can get function filename from serverless service for a google provider', () => {
            expect(
                extractFileNames(path.join(process.cwd(), 'example'), 'google', 'nodejs')
            ).toEqual(
                [
                    'handler.ts'
                ]
            )
        })
    })
    describe('when the provider runtime is not node', () => {
        it('can get function filenames from serverless service for a non-google provider', () => {
            expect(
                extractFileNames(process.cwd(), 'aws', 'python2.7', functions),
            ).toEqual(
                [
                    'tests/assets/world.ts',
                ],
            )
        })

        it('can get function filename from serverless service for a google provider', () => {
            expect(
                extractFileNames(path.join(process.cwd(), 'example'), 'google', 'python37')
            ).toEqual(
                [
                    'handler.ts'
                ]
            )
        })
    })
    describe('when the provider runtime is undefined', () => {
        it('can get function filenames from serverless service for a non-google provider', () => {
            expect(
                extractFileNames(process.cwd(), 'aws', undefined, functions),
            ).toEqual(
                [
                    'tests/assets/hello.ts',
                    'tests/assets/world.ts',
                    'tests/assets/jsfile.js',
                ],
            )
        })

        it('can get function filename from serverless service for a google provider', () => {
            expect(
                extractFileNames(path.join(process.cwd(), 'example'), 'google', undefined)
            ).toEqual(
                [
                    'handler.ts'
                ]
            )
        })
    })
})
