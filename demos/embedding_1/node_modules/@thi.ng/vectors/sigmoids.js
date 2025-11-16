const { exp } = Math;
const sigmoidS = (out, a, num, io = 0, ia = 0, so = 1, sa = 1) => {
  !out && (out = a);
  for (let i = num; i-- > 0; )
    out[io + i * so] = 1 / (1 + exp(-a[ia + i * sa]));
  return out;
};
export {
  sigmoidS
};
