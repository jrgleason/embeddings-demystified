import { EPS } from "@thi.ng/math/api";
import { magSq, magSq2, magSq3, magSq4 } from "./magsq.js";
import { mulN, mulN2, mulN3, mulN4 } from "./muln.js";
import { set, set2, set3, set4 } from "./set.js";
const $ = (magSq5, mulN5, set5) => (out, v, n = 1) => {
  !out && (out = v);
  const m = Math.sqrt(magSq5(v));
  return m >= EPS ? mulN5(out, v, n / m) : out !== v ? set5(out, v) : out;
};
const normalize = $(magSq, mulN, set);
const normalize2 = $(magSq2, mulN2, set2);
const normalize3 = $(magSq3, mulN3, set3);
const normalize4 = $(magSq4, mulN4, set4);
export {
  normalize,
  normalize2,
  normalize3,
  normalize4
};
