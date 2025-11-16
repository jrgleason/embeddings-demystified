import { defOpVV } from "./defopvv.js";
const [a, b, c, d] = defOpVV((a2, b2) => a2 && b2);
const logicAnd = a;
const logicAnd2 = b;
const logicAnd3 = c;
const logicAnd4 = d;
export {
  logicAnd,
  logicAnd2,
  logicAnd3,
  logicAnd4
};
