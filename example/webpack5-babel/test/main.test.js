/* eslint-disable node/no-missing-require */
describe('Main', () => {
  let mainModule;

  it('works without injecting', () => {
    mainModule = require('main');

    expect(mainModule.getValue()).toEqual(20);
  });

  describe('injecting code into module dependencies', () => {
    let mainModuleInjector;

    beforeEach(() => {
      mainModuleInjector = require('@orrisroot/inject-loader!main');
    });

    it('allows for injecting code into a subset of dependencies', () => {
      mainModule = mainModuleInjector({
        './bar': { BAR: 5 },
      });

      expect(mainModule.getValue()).toEqual(50);

      mainModule = mainModuleInjector({
        './getFoo': () => 10,
      });

      expect(mainModule.getValue()).toEqual(20);
    });

    it('allows for injecting code multiple dependencies', () => {
      mainModule = mainModuleInjector({
        './getFoo': () => 5,
        './bar': { BAR: 5 },
      });

      expect(mainModule.getValue()).toEqual(25);
    });
  });
});
