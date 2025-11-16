import { roundTo } from "@thi.ng/math/prec";
import { compR } from "./compr.js";
import { __iter } from "./iterator.js";
function binned(...args) {
  return __iter(binned, args) || ((rfn) => {
    const r = rfn[2];
    const {
      prec = 1,
      min = -Infinity,
      max = Infinity
    } = args[0] || {};
    return compR(
      rfn,
      (acc, x) => x < min || x > max ? acc : r(acc, roundTo(x, prec))
    );
  });
}
export {
  binned
};
