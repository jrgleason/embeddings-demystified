import { max2id, max3id, max4id } from "@thi.ng/math/interval";
import { vop } from "./vop.js";
const { abs } = Math;
const major2 = (a) => max2id(abs(a[0]), abs(a[1]));
const major3 = (a) => max3id(abs(a[0]), abs(a[1]), abs(a[2]));
const major4 = (a) => max4id(abs(a[0]), abs(a[1]), abs(a[2]), abs(a[3]));
const major = vop(
  0,
  (a) => {
    let id = -1;
    let max = -Infinity;
    for (let i = a.length; i-- > 0; ) {
      const x = abs(a[i]);
      if (x > max) {
        max = x;
        id = i;
      }
    }
    return id;
  },
  major2,
  major3,
  major4
);
export {
  major,
  major2,
  major3,
  major4
};
