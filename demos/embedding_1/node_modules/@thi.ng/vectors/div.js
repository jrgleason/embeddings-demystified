import { defOpVV } from "./defopvv.js";
import { $div } from "./ops.js";
const [a, b, c, d] = defOpVV($div);
const div = a;
const div2 = b;
const div3 = c;
const div4 = d;
export {
  div,
  div2,
  div3,
  div4
};
