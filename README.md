# serverless-plugin-typescript

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com) [![npm version](https://badge.fury.io/js/serverless-plugin-typescript.svg)](https://badge.fury.io/js/serverless-plugin-typescript) [![CircleCI](https://circleci.com/gh/graphcool/serverless-plugin-typescript.svg?style=svg)](https://circleci.com/gh/graphcool/serverless-plugin-typescript)

Serverless plugin for zero-config Typescript support

## Features

* Zero-config: Works out of the box without the need to install any other compiler or plugins
* Supports ES2015 syntax + features (`export`, `import`, `async`, `await`, `Promise`, ...)

## Install

```sh
yarn add --dev serverless-plugin-typescript
```

Add the following plugin to your `serverless.yml`:

```yaml
plugins:
  - serverless-plugin-typescript
```

## Example

See [example folder](example) for a minimal example.

## `tsconfig.json`

The default `tsconfig.json` file used by the plugin looks like this:

```json
{
  "preserveConstEnums": true,
  "strictNullChecks": true,
  "sourceMap": true,
  "target": "es5",
  "outDir": ".build",
  "moduleResolution": "node",
  "lib": ["es2015"],
}
```

> Note: Don't confuse the [`tsconfig.json`](tsconfig.json) in this repository with the one mentioned above.

## Including extra files

All files from `package/include` will be included in the final build file. See [Exclude/Include](https://serverless.com/framework/docs/providers/aws/guide/packaging#exclude--include)

## Help & Community [![Slack Status](https://slack.graph.cool/badge.svg)](https://slack.graph.cool)

Join our [Slack community](http://slack.graph.cool/) if you run into issues or have questions. We love talking to you!

![](http://i.imgur.com/5RHR6Ku.png)
