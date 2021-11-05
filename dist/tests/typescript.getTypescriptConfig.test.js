"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_1 = require("../src/typescript");
const path = require("path");
describe('getTypescriptConfig', () => {
    it(`returns default typescript configuration if the one provided doesn't exist`, () => {
        expect(typescript_1.getTypescriptConfig('/ciaone/my-folder')).toEqual(typescript_1.makeDefaultTypescriptConfig());
    });
    it(`returns default typescript configuration if the one provided doesn't exist when tsConfigFileLocation provided`, () => {
        expect(typescript_1.getTypescriptConfig(process.cwd(), './tests/assets/tsconfigs/tsconfig.nonexistent.json')).toEqual(typescript_1.makeDefaultTypescriptConfig());
    });
    it(`returns custom typescript configuration if tsConfigFileLocation provided`, () => {
        const tsconfigDir = path.join(process.cwd(), './tests/assets/tsconfigs/');
        expect(typescript_1.getTypescriptConfig(tsconfigDir, 'tsconfig.default.json')).toEqual({
            allowJs: true,
            configFilePath: undefined,
            lib: ["lib.es2015.d.ts"],
            moduleResolution: 2,
            outDir: path.join(tsconfigDir, '.build'),
            preserveConstEnums: true,
            rootDir: tsconfigDir,
            sourceMap: true,
            strictNullChecks: true,
            target: 1
        });
    });
    it(`throws error if configuration from tsConfigFileLocation is invalid`, () => {
        expect.assertions(1);
        try {
            typescript_1.getTypescriptConfig(process.cwd(), './tests/assets/tsconfigs/tsconfig.invalid.json');
        }
        catch (e) {
            expect(e.message).toBe('Invalid TSConfig file - is this file JSON format?');
        }
    });
});
//# sourceMappingURL=typescript.getTypescriptConfig.test.js.map