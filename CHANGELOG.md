# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.1.3](https://github.com/serverless/serverless-plugin-typescript/compare/v2.1.2...v2.1.3) (2022-10-03)

### Bug Fixes

* Do not attempt to process non nodejs functions ([#277](https://github.com/serverless/serverless-plugin-typescript/issues/277)) ([ba2754b](https://github.com/serverless/serverless-plugin-typescript/commit/ba2754bfb704dc66aba3effb9e838821c4c7b1b8)) ([Spencer von der Ohe](https://github.com/sazzy4o))

### [2.1.2](https://github.com/serverless/serverless-plugin-typescript/compare/v2.1.1...v2.1.2) (2022-04-04)

### Bug Fixes

* Fix lambda layers support ([#267](https://github.com/serverless/serverless-plugin-typescript/issues/267)) ([a4407c9](https://github.com/serverless/serverless-plugin-typescript/commit/a4407c9062ddc9aeb8dd298b4c28f3730bccf5f5)) ([mmeyers-xomly](https://github.com/mmeyers-xomly))

### [2.1.1](https://github.com/serverless/serverless-plugin-typescript/compare/v2.1.0...v2.1.1) (2022-01-28)

### Bug Fixes

* Fix resolution of `invoke local`  related lifecycle hook ([#258](https://github.com/serverless/serverless-plugin-typescript/pull/258)) ([378f3be](https://github.com/serverless/serverless-plugin-typescript/commit/378f3be96f61b98513b6c704047a64caad56d512)) ([Mariusz Nowak](https://github.com/medikoo))
* Declare explicitly the `--watch` option on `invoke` ([#257](https://github.com/serverless/serverless-plugin-typescript/pull/257)) ([4a9e3dd](https://github.com/serverless/serverless-plugin-typescript/commit/4a9e3dddb1a0228538fa9d8ac88d4addd4f6840a)) ([Matthieu Napoli](https://github.com/mnapoli))

### Maintanace Improvements

* Mark as Serverless Framework v3 compatible ([#264](https://github.com/serverless/serverless-plugin-typescript/pull/264)) ([d32b657](https://github.com/serverless/serverless-plugin-typescript/commit/d32b6573305a107dc1a8a82afe0014492dbb096c)) ([Mariusz Nowak](https://github.com/medikoo))

## [2.1.0](https://github.com/serverless/serverless-plugin-typescript/compare/v2.0.0...v2.1.0) (2021-09-23)


### Features

* Support user defined tsconfig paths ([#205](https://github.com/serverless/serverless-plugin-typescript/issues/205)) ([a367dcd](https://github.com/serverless/serverless-plugin-typescript/commit/a367dcdcb1e7efb72e68ef6e0630d50db15cb856)) ([Jack Scotson](https://github.com/Scotsoo))

## [2.0.0](https://github.com/prisma/serverless-plugin-typescript/compare/v1.2.0...v2.0.0) (2021-09-01)

### ⚠ BREAKING CHANGES

* Serverless Framework v2 or later is required (dropped support for v1)
* Node.js version 10 or later is required (dropped support for v6 and v8)

### Maintanace Improvements

* Drop support for Node.js v8 ([#248](https://github.com/serverless/serverless-plugin-typescript/pull/248)) ([3d190a2](https://github.com/serverless/serverless-plugin-typescript/commit/3d190a221ee6937538a71c57c3da9c7d50f67a6c))([Mariusz Nowak](https://github.com/medikoo))
* Drop support for v1 version of `serverless` ([#248](https://github.com/serverless/serverless-plugin-typescript/pull/248)) ([a98974d](https://github.com/serverless/serverless-plugin-typescript/commit/a98974d048d835f1c515c0887bd147543dda020b))([Mariusz Nowak](https://github.com/medikoo))
* Upgrade `globby` to v10 ([#248](https://github.com/serverless/serverless-plugin-typescript/pull/248)) ([31394f7](https://github.com/serverless/serverless-plugin-typescript/commit/31394f74ef84a9adb4e4fc86924652c799cf04e7)) ([Mariusz Nowak](https://github.com/medikoo))

## [1.2.0](https://github.com/prisma/serverless-plugin-typescript/compare/v1.1.9...v0.0.0) (2021-08-23)

### Features

* Recognize `package.patterns` ([#243](https://github.com/serverless/serverless-plugin-typescript/pull/243)) ([378c4f6](https://github.com/prisma/serverless-plugin-typescript/commit/378c4f6ce0711b6bdd5f4aae7eb571669f8e31a9)) ([Mariusz Nowak](https://github.com/medikoo))
