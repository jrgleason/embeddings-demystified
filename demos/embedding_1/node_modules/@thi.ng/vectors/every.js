import { vop } from "./vop.js";
const every2 = (a) => a[0] && a[1];
const every3 = (a) => a[0] && a[1] && a[2];
const every4 = (a) => a[0] && a[1] && a[2] && a[3];
const every = vop(
  0,
  (v) => {
    for (let i = v.length; i-- > 0; ) {
      if (!v[i]) return false;
    }
    return true;
  },
  every2,
  every3,
  every4
);
export {
  every,
  every2,
  every3,
  every4
};
