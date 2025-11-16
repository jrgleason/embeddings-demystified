const setS = (o, a, size, io = 0, ia = 0, so = 1, sa = 1) => {
  !o && (o = []);
  while (size-- > 0) o[io + size * so] = a[ia + size * sa];
  return o;
};
const setS2 = (o, a, io = 0, ia = 0, so = 1, sa = 1) => {
  !o && (o = []);
  o[io] = a[ia];
  o[io + so] = a[ia + sa];
  return o;
};
const setS3 = (o, a, io = 0, ia = 0, so = 1, sa = 1) => {
  !o && (o = []);
  o[io] = a[ia];
  o[io + so] = a[ia + sa];
  o[io + 2 * so] = a[ia + 2 * sa];
  return o;
};
const setS4 = (o, a, io = 0, ia = 0, so = 1, sa = 1) => {
  !o && (o = []);
  o[io] = a[ia];
  o[io + so] = a[ia + sa];
  o[io + 2 * so] = a[ia + 2 * sa];
  o[io + 3 * so] = a[ia + 3 * sa];
  return o;
};
export {
  setS,
  setS2,
  setS3,
  setS4
};
