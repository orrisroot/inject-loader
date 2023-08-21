/* eslint-disable node/no-missing-require, mocha/no-setup-in-describe */
const assert = require('assert');

const MODULE_A_STUB = {
  a() {
    return 'a - stubbed';
  },
};

const MODULE_B_STUB = () => 'b - stubbed';

describe('inject-loader', function () {
  const injectors = [
    { moduleType: 'commonjs', moduleInjector: require('self!./fixtures/commonjs.js') },
    { moduleType: 'amd', moduleInjector: require('self!./fixtures/amd.js') },
    { moduleType: 'es6', moduleInjector: require('self!./fixtures/es6.js').default },
  ];

  injectors.forEach((injector) => {
    describe(`${injector.moduleType} modules`, function () {
      it('works when no injections were provided', function () {
        const module = injector.moduleInjector();

        assert.equal(module.getA(), 'a - original');
        assert.equal(module.getB(), 'b - original');
        assert.equal(module.getC(), 'c - original');
      });

      it('works when one injection was provided', function () {
        const module = injector.moduleInjector({
          './a.js': MODULE_A_STUB,
        });

        assert.equal(module.getA(), 'a - stubbed');
        assert.equal(module.getB(), 'b - original');
        assert.equal(module.getC(), 'c - original');
      });

      it('works when a falsy injection was provided', function () {
        const module = injector.moduleInjector({
          './c.js': undefined,
        });

        assert.equal(module.getA(), 'a - original');
        assert.equal(module.getB(), 'b - original');
        assert.equal(module.getC(), undefined);
      });

      it('works when multiple injections were provided', function () {
        const module = injector.moduleInjector({
          './a.js': MODULE_A_STUB,
          './b.js': MODULE_B_STUB,
        });

        assert.equal(module.getA(), 'a - stubbed');
        assert.equal(module.getB(), 'b - stubbed');
        assert.equal(module.getC(), 'c - original');
      });

      it('throws an error when invalid dependencies are provided', function () {
        const injectInvalidDependencies = () => {
          injector.moduleInjector({
            './b.js': null,
            './d.js': null,
          });
        };

        assert.throws(injectInvalidDependencies, /Injection Error in/);
        assert.throws(
          injectInvalidDependencies,
          /The following injections are invalid:\n - \.\/d\.js\n/
        );
        assert.throws(
          injectInvalidDependencies,
          /The following injections were passed in:\n - \.\/b\.js\n - \.\/d\.js\n/
        );
        assert.throws(
          injectInvalidDependencies,
          /Valid injection targets for this module are:\n - \.\/a\.js\n - \.\/b\.js\n - \.\/c\.js/
        );
      });

      it('does not break someObject.require calls', function () {
        const module = injector.moduleInjector();

        assert.equal(module.callRequireMethod(), 'require method in a.js');
      });
    });
  });
});
