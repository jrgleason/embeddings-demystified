import { defOpVNew } from "./defopv-new.js";
const [a, b, c, d] = defOpVNew((x) => x >>> 0, 1);
const asUVec = a;
const asUVec2 = b;
const asUVec3 = c;
const asUVec4 = d;
export {
  asUVec,
  asUVec2,
  asUVec3,
  asUVec4
};
