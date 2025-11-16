import { defOpSVN } from "./defopsvn.js";
import { $add } from "./ops.js";
const [a, b, c, d] = defOpSVN($add);
const addNS = a;
const addNS2 = b;
const addNS3 = c;
const addNS4 = d;
export {
  addNS,
  addNS2,
  addNS3,
  addNS4
};
