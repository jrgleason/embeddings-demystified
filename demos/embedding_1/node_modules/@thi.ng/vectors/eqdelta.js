import { EPS as e } from "@thi.ng/math/api";
import { eqDelta as eq } from "@thi.ng/math/eqdelta";
import { implementsFunction } from "@thi.ng/checks/implements-function";
import { vop } from "./vop.js";
const eqDelta2 = (a, b, eps = e) => {
  return a.length === b.length && eq(a[0], b[0], eps) && eq(a[1], b[1], eps);
};
const eqDelta3 = (a, b, eps = e) => {
  return a.length === b.length && eq(a[0], b[0], eps) && eq(a[1], b[1], eps) && eq(a[2], b[2], eps);
};
const eqDelta4 = (a, b, eps = e) => {
  return a.length === b.length && eq(a[0], b[0], eps) && eq(a[1], b[1], eps) && eq(a[2], b[2], eps) && eq(a[3], b[3], eps);
};
const eqDelta = vop(
  0,
  (v1, v2, eps = e) => {
    if (implementsFunction(v1, "eqDelta")) {
      return v1.eqDelta(v2, eps);
    }
    if (implementsFunction(v2, "eqDelta")) {
      return v2.eqDelta(v1, eps);
    }
    return eqDeltaS(v1, v2, v1.length, eps);
  },
  eqDelta2,
  eqDelta3,
  eqDelta4
);
const eqDeltaS = (a, b, n, eps = e, ia = 0, ib = 0, sa = 1, sb = 1) => {
  for (; n > 0; n--, ia += sa, ib += sb) {
    if (!eq(a[ia], b[ib], eps)) {
      return false;
    }
  }
  return true;
};
const eqDeltaArray = (a, b, eps = e) => {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = a.length; i-- > 0; ) {
    if (!eqDelta(a[i], b[i], eps)) {
      return false;
    }
  }
  return true;
};
const isInArray = (p, pts, eps = e) => {
  for (let i = pts.length; i-- > 0; ) {
    if (eqDelta(p, pts[i], eps)) {
      return true;
    }
  }
  return false;
};
export {
  eqDelta,
  eqDelta2,
  eqDelta3,
  eqDelta4,
  eqDeltaArray,
  eqDeltaS,
  isInArray
};
