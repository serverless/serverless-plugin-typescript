import {getTypescriptConfig, makeDefaultTypescriptConfig} from '../src/typescript'

describe('getTypescriptConfig', () => {
    it(`returns default typescript configuration if the one provided doesn't exist`, () => {
        expect(
            getTypescriptConfig('/ciaone/my-folder'),
        ).toEqual(
            makeDefaultTypescriptConfig()
        )
    })
})