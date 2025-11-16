import { vop } from "./vop.js";
const some2 = (a) => a[0] || a[1];
const some3 = (a) => a[0] || a[1] || a[2];
const some4 = (a) => a[0] || a[1] || a[2] || a[3];
const some = vop(
  0,
  (v) => {
    for (let i = v.length; i-- > 0; ) {
      if (v[i]) return true;
    }
    return false;
  },
  some2,
  some3,
  some4
);
export {
  some,
  some2,
  some3,
  some4
};
