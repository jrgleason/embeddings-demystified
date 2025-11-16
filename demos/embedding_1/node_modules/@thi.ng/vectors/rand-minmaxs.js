import {} from "@thi.ng/random";
import { SYSTEM as op } from "@thi.ng/random/system";
const randMinMaxS2 = (o, a, b, rnd = op, io = 0, ia = 0, ib = 0, so = 1, sa = 1, sb = 1) => {
  !o && (o = a);
  o[io] = rnd.minmax(a[ia], b[ib]);
  o[io + so] = rnd.minmax(a[ia + sa], b[ib + sb]);
  return o;
};
const randMinMaxS3 = (o, a, b, rnd = op, io = 0, ia = 0, ib = 0, so = 1, sa = 1, sb = 1) => {
  !o && (o = a);
  o[io] = rnd.minmax(a[ia], b[ib]);
  o[io + so] = rnd.minmax(a[ia + sa], b[ib + sb]);
  o[io + 2 * so] = rnd.minmax(a[ia + 2 * sa], b[ib + 2 * sb]);
  return o;
};
const randMinMaxS4 = (o, a, b, rnd = op, io = 0, ia = 0, ib = 0, so = 1, sa = 1, sb = 1) => {
  !o && (o = a);
  o[io] = rnd.minmax(a[ia], b[ib]);
  o[io + so] = rnd.minmax(a[ia + sa], b[ib + sb]);
  o[io + 2 * so] = rnd.minmax(a[ia + 2 * sa], b[ib + 2 * sb]);
  o[io + 3 * so] = rnd.minmax(a[ia + 3 * sa], b[ib + 3 * sb]);
  return o;
};
export {
  randMinMaxS2,
  randMinMaxS3,
  randMinMaxS4
};
