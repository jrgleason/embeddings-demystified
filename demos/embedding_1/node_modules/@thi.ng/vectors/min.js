import { defOpVV } from "./defopvv.js";
const [a, b, c, d] = defOpVV(Math.min);
const min = a;
const min2 = b;
const min3 = c;
const min4 = d;
const vmin = (v) => {
  let min5 = Infinity;
  for (let i = v.length; i-- > 0; ) min5 = Math.min(min5, v[i]);
  return min5;
};
export {
  min,
  min2,
  min3,
  min4,
  vmin
};
