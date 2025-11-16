import { vop } from "./vop.js";
const equals2 = (a, b) => a.length === b.length && a[0] === b[0] && a[1] === b[1];
const equals3 = (a, b) => a.length === b.length && a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
const equals4 = (a, b) => a.length === b.length && a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
const equals = vop(
  0,
  (a, b) => {
    let l = a.length;
    if (l === b.length) {
      while (l-- > 0 && a[l] === b[l]) ;
    }
    return l < 0;
  },
  equals2,
  equals3,
  equals4
);
export {
  equals,
  equals2,
  equals3,
  equals4
};
