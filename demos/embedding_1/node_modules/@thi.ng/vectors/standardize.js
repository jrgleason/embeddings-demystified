import { center } from "./center.js";
import { mulN } from "./muln.js";
import { set } from "./set.js";
import { sd } from "./variance.js";
const standardize = (out, a, isCentered = false, corrected) => {
  out = !isCentered ? center(out, a) : !out ? a : set(out, a);
  const d = sd(out, true, corrected);
  return d > 0 ? mulN(null, out, 1 / d) : out;
};
export {
  standardize
};
