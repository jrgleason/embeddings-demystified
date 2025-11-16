const dotS = (a, b, n, ia = 0, ib = 0, sa = 1, sb = 1) => {
  let sum = 0;
  while (n-- > 0) sum += a[ia + n * sa] * b[ib + n * sb];
  return sum;
};
const dotS2 = (a, b, io = 0, ib = 0, sa = 1, sb = 1) => a[io] * b[ib] + a[io + sa] * b[ib + sb];
const dotS3 = (a, b, ia = 0, ib = 0, sa = 1, sb = 1) => a[ia] * b[ib] + a[ia + sa] * b[ib + sb] + a[ia + 2 * sa] * b[ib + 2 * sb];
const dotS4 = (a, b, ia = 0, ib = 0, sa = 1, sb = 1) => a[ia] * b[ib] + a[ia + sa] * b[ib + sb] + a[ia + 2 * sa] * b[ib + 2 * sb] + a[ia + 3 * sa] * b[ib + 3 * sb];
export {
  dotS,
  dotS2,
  dotS3,
  dotS4
};
