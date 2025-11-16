const msubNS2 = (o, a, n, b, io = 0, ia = 0, ib = 0, so = 1, sa = 1, sb = 1) => {
  !o && (o = a);
  o[io] = a[ia] * n - b[ib];
  o[io + so] = a[ia + sa] * n - b[ib + sb];
  return o;
};
export {
  msubNS2
};
