import { vop } from "./vop.js";
const set2 = (o, a) => {
  !o && (o = []);
  o[0] = a[0];
  o[1] = a[1];
  return o;
};
const set3 = (o, a) => {
  !o && (o = []);
  o[0] = a[0];
  o[1] = a[1];
  o[2] = a[2];
  return o;
};
const set4 = (o, a) => {
  !o && (o = []);
  o[0] = a[0];
  o[1] = a[1];
  o[2] = a[2];
  o[3] = a[3];
  return o;
};
const set = vop(
  1,
  (o, a) => {
    !o && (o = []);
    for (let i = a.length; i-- > 0; ) o[i] = a[i];
    return o;
  },
  set2,
  set3,
  set4
);
export {
  set,
  set2,
  set3,
  set4
};
