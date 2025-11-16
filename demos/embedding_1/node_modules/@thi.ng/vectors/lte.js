import { defOpVVNew } from "./defopvv-new.js";
const [a, b, c, d] = defOpVVNew((a2, b2) => a2 <= b2);
const lte = a;
const lte2 = b;
const lte3 = c;
const lte4 = d;
export {
  lte,
  lte2,
  lte3,
  lte4
};
