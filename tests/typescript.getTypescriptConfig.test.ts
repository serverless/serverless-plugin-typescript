import {getTypeScriptConfig, makeDefaultTypeScriptConfig} from '../src/typescript'

describe('getTypeScriptConfig', () => {
    it(`returns default typescript configuration if the one provided doesn't exist`, () => {
        expect(
            getTypeScriptConfig('/ciaone/my-folder'),
        ).toEqual(
            makeDefaultTypeScriptConfig()
        )
    })
})