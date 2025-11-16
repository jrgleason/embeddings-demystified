import { defOpVNew } from "./defopv-new.js";
const [a, b, c, d] = defOpVNew((x) => !!x, 1);
const asBVec = a;
const asBVec2 = b;
const asBVec3 = c;
const asBVec4 = d;
export {
  asBVec,
  asBVec2,
  asBVec3,
  asBVec4
};
