const relu = (out, a) => {
  !out && (out = a);
  for (let i = a.length; i-- > 0; ) out[i] = a[i] >= 0 ? a[i] : 0;
  return out;
};
const reluN = (out, a, n) => {
  !out && (out = a);
  for (let i = a.length; i-- > 0; ) out[i] = a[i] >= 0 ? a[i] : a[i] * n;
  return out;
};
export {
  relu,
  reluN
};
