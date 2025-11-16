import { defOpVVNew } from "./defopvv-new.js";
const [a, b, c, d] = defOpVVNew((a2, b2) => a2 >= b2);
const gte = a;
const gte2 = b;
const gte3 = c;
const gte4 = d;
export {
  gte,
  gte2,
  gte3,
  gte4
};
