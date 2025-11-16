const defOpSVVN = (op) => [
  (o, a, b, n, k, io = 0, ia = 0, ib = 0, so = 1, sa = 1, sb = 1) => {
    !o && (o = a);
    while (k-- > 0) o[io + k * so] = op(a[ia + k * sa], b[ib + k * sb], n);
    return o;
  },
  (o, a, b, n, io = 0, ia = 0, ib = 0, so = 1, sa = 1, sb = 1) => {
    !o && (o = a);
    o[io] = op(a[ia], b[ib], n);
    o[io + so] = op(a[ia + sa], b[ib + sb], n);
    return o;
  },
  (o, a, b, n, io = 0, ia = 0, ib = 0, so = 1, sa = 1, sb = 1) => {
    !o && (o = a);
    o[io] = op(a[ia], b[ib], n);
    o[io + so] = op(a[ia + sa], b[ib + sb], n);
    o[io + 2 * so] = op(a[ia + 2 * sa], b[ib + 2 * sb], n);
    return o;
  },
  (o, a, b, n, io = 0, ia = 0, ib = 0, so = 1, sa = 1, sb = 1) => {
    !o && (o = a);
    o[io] = op(a[ia], b[ib], n);
    o[io + so] = op(a[ia + sa], b[ib + sb], n);
    o[io + 2 * so] = op(a[ia + 2 * sa], b[ib + 2 * sb], n);
    o[io + 3 * so] = op(a[ia + 3 * sa], b[ib + 3 * sb], n);
    return o;
  }
];
export {
  defOpSVVN
};
