import { vop } from "./vop.js";
const product2 = (a) => a[0] * a[1];
const product3 = (a) => a[0] * a[1] * a[2];
const product4 = (a) => a[0] * a[1] * a[2] * a[3];
const product = vop(
  0,
  (v) => {
    let res = 1;
    for (let i = v.length; i-- > 0; ) res *= v[i];
    return res;
  },
  product2,
  product3,
  product4
);
export {
  product,
  product2,
  product3,
  product4
};
