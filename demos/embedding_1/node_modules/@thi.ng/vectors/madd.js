import { defOpVVV } from "./defopvvv.js";
import { $madd } from "./ops.js";
const [a, b, c, d] = defOpVVV($madd);
const madd = a;
const madd2 = b;
const madd3 = c;
const madd4 = d;
export {
  madd,
  madd2,
  madd3,
  madd4
};
