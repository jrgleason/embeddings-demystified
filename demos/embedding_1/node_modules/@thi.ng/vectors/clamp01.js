import { clamp01 as op } from "@thi.ng/math/interval";
import { defOpV } from "./defopv.js";
const [a, b, c, d] = defOpV(op);
const clamp01 = a;
const clamp01_2 = b;
const clamp01_3 = c;
const clamp01_4 = d;
export {
  clamp01,
  clamp01_2,
  clamp01_3,
  clamp01_4
};
