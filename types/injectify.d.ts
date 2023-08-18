import type { LoaderContext } from 'webpack';
import type { InputSourceMap } from './types';
declare const injectify: (context: LoaderContext<object>, source: string, inputSourceMap?: InputSourceMap) => import("@babel/core").BabelFileResult | null;
export default injectify;
//# sourceMappingURL=injectify.d.ts.map