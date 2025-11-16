import { roundTo } from "@thi.ng/math/prec";
import { defOpVN } from "./defopvn.js";
const [a, b, c, d] = defOpVN(roundTo);
const roundN = a;
const roundN2 = b;
const roundN3 = c;
const roundN4 = d;
export {
  roundN,
  roundN2,
  roundN3,
  roundN4
};
