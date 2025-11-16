import { defOpVV } from "./defopvv.js";
import { $add } from "./ops.js";
const [a, b, c, d] = defOpVV($add);
const add = a;
const add2 = b;
const add3 = c;
const add4 = d;
export {
  add,
  add2,
  add3,
  add4
};
