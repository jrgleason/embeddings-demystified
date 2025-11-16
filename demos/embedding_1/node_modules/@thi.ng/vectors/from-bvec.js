import { defOpVNew } from "./defopv-new.js";
const [a, b, c, d] = defOpVNew((x) => ~~x, 1);
const fromBVec = a;
const fromBVec2 = b;
const fromBVec3 = c;
const fromBVec4 = d;
export {
  fromBVec,
  fromBVec2,
  fromBVec3,
  fromBVec4
};
