import { magSq, magSq2, magSq3, magSq4 } from "./magsq.js";
import { mulN, mulN2, mulN3, mulN4 } from "./muln.js";
import { set, set2, set3, set4 } from "./set.js";
const $ = (magSq5, mulN5, set5) => (out, v, n) => {
  !out && (out = v);
  const m = magSq5(v);
  return m > n * n ? mulN5(out, v, n / Math.sqrt(m)) : out !== v ? set5(out, v) : out;
};
const limit = $(magSq, mulN, set);
const limit2 = $(magSq2, mulN2, set2);
const limit3 = $(magSq3, mulN3, set3);
const limit4 = $(magSq4, mulN4, set4);
export {
  limit,
  limit2,
  limit3,
  limit4
};
