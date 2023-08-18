import { BAR } from './bar';
import getFoo from './getFoo';

export function getValue() {
  return getFoo() * BAR;
}
