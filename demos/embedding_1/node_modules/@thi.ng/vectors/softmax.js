import { divN } from "./divn.js";
import { exp } from "./exp.js";
import { sum } from "./sum.js";
const softMax = (out, src, temperature) => {
  const e = temperature !== void 0 ? exp(null, divN([], src, temperature)) : exp([], src);
  return divN(out || src, e, sum(e));
};
export {
  softMax
};
