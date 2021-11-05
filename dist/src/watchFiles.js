"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchFiles = void 0;
const typescript = require("./typescript");
const fs_1 = require("fs");
function watchFiles(rootFileNames, originalServicePath, cb) {
    const tsConfig = typescript.getTypescriptConfig(originalServicePath);
    let watchedFiles = typescript.getSourceFiles(rootFileNames, tsConfig);
    watchedFiles.forEach(fileName => {
        fs_1.watchFile(fileName, { persistent: true, interval: 250 }, watchCallback);
    });
    function watchCallback(curr, prev) {
        // Check timestamp
        if (+curr.mtime <= +prev.mtime) {
            return;
        }
        cb();
        // use can reference not watched yet file or remove reference to already watched
        const newWatchFiles = typescript.getSourceFiles(rootFileNames, tsConfig);
        watchedFiles.forEach(fileName => {
            if (newWatchFiles.indexOf(fileName) < 0) {
                fs_1.unwatchFile(fileName, watchCallback);
            }
        });
        newWatchFiles.forEach(fileName => {
            if (watchedFiles.indexOf(fileName) < 0) {
                fs_1.watchFile(fileName, { persistent: true, interval: 250 }, watchCallback);
            }
        });
        watchedFiles = newWatchFiles;
    }
}
exports.watchFiles = watchFiles;
//# sourceMappingURL=watchFiles.js.map