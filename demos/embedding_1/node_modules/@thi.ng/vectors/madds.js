import { defOpSVVV } from "./defopsvvv.js";
import { $madd } from "./ops.js";
const [a, b, c, d] = defOpSVVV($madd);
const maddS = a;
const maddS2 = b;
const maddS3 = c;
const maddS4 = d;
export {
  maddS,
  maddS2,
  maddS3,
  maddS4
};
