import { ensureTransducer } from "./ensure.js";
import { push } from "./push.js";
import { isReduced } from "./reduced.js";
const step = (tx, unwrap = true, cache = true) => {
  const [_, complete, reduce] = ensureTransducer(tx)(push());
  let done = false;
  let result;
  const fn = (x) => {
    if (!done) {
      let acc = reduce([], x);
      done = isReduced(acc);
      if (done) {
        acc = complete(acc.deref());
      }
      const res = acc.length === 1 && unwrap ? acc[0] : acc.length > 0 ? acc : void 0;
      if (cache) result = res;
      return res;
    }
  };
  fn.deref = () => result;
  return fn;
};
export {
  step
};
