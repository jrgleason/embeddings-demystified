import { defOpVV } from "./defopvv.js";
const [a, b, c, d] = defOpVV(Math.max);
const max = a;
const max2 = b;
const max3 = c;
const max4 = d;
const vmax = (v) => {
  let max5 = -Infinity;
  for (let i = v.length; i-- > 0; ) max5 = Math.max(max5, v[i]);
  return max5;
};
export {
  max,
  max2,
  max3,
  max4,
  vmax
};
