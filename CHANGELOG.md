# Change log

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](http://semver.org/).

## `5.0.0`

- This package has been forked from [inject-loader](https://www.npmjs.com/package/inject-loader) npm package.
  - The new package name is [@orrisroot/inject-loader](https://www.npmjs.com/package/@orrisroot/inject-loader)

### Updates

- Rewrote library in typescript.
- Updated the build and test environment.
- Updated the peer depending `webpack` version to 5 only.
- Updated the depending `babel-core` library to `@babel/core@^7`.
  - Imported upstream pull request [#74](https://github.com/plasticine/inject-loader/pull/74).

## `4.0.1`

- Better error messages when module injections are invalid.

## `4.0.0`

- Support Webpack 4.X

## `3.0.0`

- [feature] Huge refactor & cleanup converting underlying implementation to use Babel Core. [#36](https://github.com/plasticine/inject-loader/pull/36)
  - This should fix a huge number of really annoying edge-cases that were present in the previous implementation, e.g [#32](https://github.com/plasticine/inject-loader/issues/32)
  - Support Source maps! [#10](https://github.com/plasticine/inject-loader/issues/10)
  - Massive thanks to @vladimir-tikhonov for his stellar efforts! 🚀👏

## `2.0.1`

- [fixed] — Injection of Babel generated module code. [#11](https://github.com/plasticine/inject-loader/pull/11)

## `2.0.0`

- [added] — Support for falling back to base module definition if an alternate is not defined; made this this default behavior. [#7](https://github.com/plasticine/inject-loader/pull/11)

## `1.0.0`

- Initial release.
