import { min2id, min3id, min4id } from "@thi.ng/math/interval";
import { vop } from "./vop.js";
const { abs } = Math;
const minor2 = (a) => min2id(abs(a[0]), abs(a[1]));
const minor3 = (a) => min3id(abs(a[0]), abs(a[1]), abs(a[2]));
const minor4 = (a) => min4id(abs(a[0]), abs(a[1]), abs(a[2]), abs(a[3]));
const minor = vop(
  0,
  (a) => {
    let id = -1;
    let min = Infinity;
    for (let i = a.length; i-- > 0; ) {
      const x = abs(a[i]);
      if (x < min) {
        min = x;
        id = i;
      }
    }
    return id;
  },
  minor2,
  minor3,
  minor4
);
export {
  minor,
  minor2,
  minor3,
  minor4
};
