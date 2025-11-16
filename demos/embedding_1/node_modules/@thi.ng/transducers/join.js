import { isIterable } from "@thi.ng/checks/is-iterable";
import { iterator1 } from "./iterator.js";
import { compR } from "./compr.js";
import { ensureArray } from "@thi.ng/arrays/ensure-array";
function join(sep = "", src) {
  return isIterable(src) ? iterator1(join(sep), src) : (rfn) => {
    const r = rfn[2];
    return compR(
      rfn,
      (acc, x) => r(acc, ensureArray(x).join(sep))
    );
  };
}
export {
  join
};
