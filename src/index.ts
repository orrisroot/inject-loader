import type { LoaderContext } from 'webpack';

import injectify from './injectify';
import type { InputSourceMap } from './types';

function loader(this: LoaderContext<object>, content: string, sourceMap?: InputSourceMap) {
  if (this.cacheable) {
    this.cacheable();
  }

  const { code, map } = injectify(this, content, sourceMap)!;
  this.callback(null, code as string, map as InputSourceMap);
}

export default loader;
