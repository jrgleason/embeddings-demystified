import { absInnerAngle } from "@thi.ng/math/angle";
import { cross2 } from "./cross.js";
import { dot2, dot3 } from "./dot.js";
import { mag3 } from "./mag.js";
const angleBetween2 = (a, b, absInner = false) => {
  const t = Math.atan2(cross2(a, b), dot2(a, b));
  return absInner ? absInnerAngle(t) : t;
};
const angleBetween3 = (a, b, normalize = true, absInner = false) => {
  const dp = dot3(a, b);
  const t = Math.acos(normalize ? dp / (mag3(a) * mag3(b)) : dp);
  return absInner ? absInnerAngle(t) : t;
};
export {
  angleBetween2,
  angleBetween3
};
