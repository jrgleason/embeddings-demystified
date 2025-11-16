import { defOpVNew } from "./defopv-new.js";
const [a, b, c, d] = defOpVNew((x) => x | 0, 1);
const asIVec = a;
const asIVec2 = b;
const asIVec3 = c;
const asIVec4 = d;
export {
  asIVec,
  asIVec2,
  asIVec3,
  asIVec4
};
