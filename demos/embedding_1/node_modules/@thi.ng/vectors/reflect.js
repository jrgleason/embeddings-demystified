import { dot, dot2, dot3 } from "./dot.js";
import { maddN, maddN2, maddN3 } from "./maddn.js";
const reflect = (out, a, b) => maddN(out || a, b, -2 * dot(a, b), a);
const reflect2 = (out, a, b) => maddN2(out || a, b, -2 * dot2(a, b), a);
const reflect3 = (out, a, b) => maddN3(out || a, b, -2 * dot3(a, b), a);
export {
  reflect,
  reflect2,
  reflect3
};
