import { normalize, normalize2, normalize3 } from "./normalize.js";
import { sub, sub2, sub3 } from "./sub.js";
const direction = (out, a, b, n) => normalize(null, sub(out || a, b, a), n);
const direction2 = (out, a, b, n) => normalize2(null, sub2(out || a, b, a), n);
const direction3 = (out, a, b, n) => normalize3(null, sub3(out || a, b, a), n);
export {
  direction,
  direction2,
  direction3
};
