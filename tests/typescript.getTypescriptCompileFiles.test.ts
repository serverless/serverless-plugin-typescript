import {getTypescriptCompileFiles} from '../src/typescript'
import * as path from 'path'
describe('getTypescriptCompileFiles', () => {
    it(`returns all typescript compile files including the tsconfig.json include`, () => {
        expect(
          getTypescriptCompileFiles(path.resolve(__dirname, '../'))
        ).toEqual(
            ['src/Serverless.d.ts', 'src/index.ts', 'src/typescript.ts', 'src/watchFiles.ts']
        )
    })
})