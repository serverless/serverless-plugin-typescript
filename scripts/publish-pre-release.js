#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const packageJsonPath = path.resolve(__dirname, '../package.json');

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const originalVersion = packageJson.version;
process.chdir(path.resolve(__dirname, '..'));
const lastCommitSha = String(childProcess.spawnSync('git', ['rev-parse', 'HEAD']).stdout).trim();

packageJson.version = `${originalVersion}.${lastCommitSha.slice(0, 8)}`;

fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

try {
	childProcess.spawnSync('npm', ['publish', '--tag', 'pre-3'], { stdio: 'inherit' });
} finally {
	packageJson.version = originalVersion;
	fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
}
