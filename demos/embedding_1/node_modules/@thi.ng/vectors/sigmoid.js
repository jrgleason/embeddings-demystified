const { exp } = Math;
const sigmoid = (out, a) => {
  !out && (out = a);
  for (let i = a.length; i-- > 0; ) out[i] = 1 / (1 + exp(-a[i]));
  return out;
};
export {
  sigmoid
};
