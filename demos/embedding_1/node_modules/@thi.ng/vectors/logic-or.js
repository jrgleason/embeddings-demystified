import { defOpVV } from "./defopvv.js";
const [a, b, c, d] = defOpVV((a2, b2) => a2 || b2);
const logicOr = a;
const logicOr2 = b;
const logicOr3 = c;
const logicOr4 = d;
export {
  logicOr,
  logicOr2,
  logicOr3,
  logicOr4
};
