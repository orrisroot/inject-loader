# 💉📦 inject-loader

A Webpack loader for injecting code into modules via their dependencies

[![npm](https://img.shields.io/npm/v/@orrisroot/inject-loader.svg)](https://www.npmjs.com/package/@orrisroot/inject-loader)
[![Downloads](https://img.shields.io/npm/dw/@orrisroot/inject-loader.svg)](https://www.npmjs.com/package/@orrisroot/inject-loader)

***

## Why

This is particularly useful for writing tests where mocking things inside your module-under-test is sometimes necessary before execution.

`inject-loader` was inspired by, and builds upon ideas introduced in [jauco/webpack-injectable](https://github.com/jauco/webpack-injectable).

This library has been forked from [inject-loader](https://github.com/plasticine/inject-loader) and renamed to [@orrisroot/inject-loader](https://github.com/orrisroot/react-html-parser) for continued maintenance.

## Usage

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

Use the inject loader by adding the `@orrisroot/inject-loader!` [inline loader](https://webpack.js.org/concepts/loaders/#inline) when you use `require`, this will return a function that can used in test code to modify the injected module.

By default all `require` statements in an injected module will be altered to be replaced with an injector, though if a replacement it not specified the default values will be used.

## Examples

Given some code in a module like this:

```javascript
// MyStore.js

var Dispatcher = require('lib/dispatcher');
var EventEmitter = require('events').EventEmitter;
var handleAction = require('lib/handle_action');

Dispatcher.register(handleAction, 'MyStore');
```

You can manipulate it’s dependencies when you come to write tests as follows:

```javascript
// If no flags are provided when using the loader then
// all require statements will be wrapped in an injector
MyModuleInjector = require('@orrisroot/inject-loader!MyStore')
MyModule = MyModuleInjector({
  'lib/dispatcher': DispatcherMock,
  'events': EventsMock,
  'lib/handle_action': HandleActionMock
})
```

There are a few examples of complete test setups for Webpack 5 in the [`example`](./example) folder.

## License

The source code is licensed MIT. see [`LICENSE`](./LICENSE).
