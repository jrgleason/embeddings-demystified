const reluS = (out, a, num, io = 0, ia = 0, so = 1, sa = 1) => {
  !out && (out = a);
  for (let i = num; i-- > 0; ) {
    const x = a[ia + i * sa];
    out[io + i * so] = x >= 0 ? x : 0;
  }
  return out;
};
const reluNS = (out, a, n, num, io = 0, ia = 0, so = 1, sa = 1) => {
  !out && (out = a);
  for (let i = num; i-- > 0; ) {
    const x = a[ia + i * sa];
    out[io + i * so] = x >= 0 ? x : x * n;
  }
  return out;
};
export {
  reluNS,
  reluS
};
