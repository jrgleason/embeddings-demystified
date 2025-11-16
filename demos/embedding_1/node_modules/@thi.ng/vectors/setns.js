const setNS = (o, n, size, io = 0, so = 1) => {
  !o && (o = []);
  while (size-- > 0) o[io + size * so] = n;
  return o;
};
const setNS2 = (o, n, io = 0, so = 1) => {
  !o && (o = []);
  o[io] = n;
  o[io + so] = n;
  return o;
};
const setNS3 = (o, n, io = 0, so = 1) => {
  !o && (o = []);
  o[io] = n;
  o[io + so] = n;
  o[io + 2 * so] = n;
  return o;
};
const setNS4 = (o, n, io = 0, so = 1) => {
  !o && (o = []);
  o[io] = n;
  o[io + so] = n;
  o[io + 2 * so] = n;
  o[io + 3 * so] = n;
  return o;
};
export {
  setNS,
  setNS2,
  setNS3,
  setNS4
};
