/* eslint-disable node/no-missing-import, import/no-unresolved */
import mainModuleInjector from '@orrisroot/inject-loader!main';
import { getValue as mainGetValue } from 'main';

describe('Main', () => {
  it('works without injecting', () => {
    expect(mainGetValue()).toEqual(20);
  });

  describe('injecting code into module dependencies', () => {
    it('allows for injecting code into a subset of dependencies', () => {
      let mainModuleInjected = mainModuleInjector({
        './bar': { BAR: 5 },
      });

      expect(mainModuleInjected.getValue()).toEqual(50);

      mainModuleInjected = mainModuleInjector({
        './getFoo': () => 10,
      });

      expect(mainModuleInjected.getValue()).toEqual(20);
    });

    it('allows for injecting code multiple dependencies', () => {
      let mainModuleInjected = mainModuleInjector({
        './getFoo': () => 5,
        './bar': { BAR: 5 },
      });

      expect(mainModuleInjected.getValue()).toEqual(25);
    });
  });
});
