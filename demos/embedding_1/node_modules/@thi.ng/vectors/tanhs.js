const { tanh } = Math;
const tanhS = (out, a, num, io = 0, ia = 0, so = 1, sa = 1) => {
  !out && (out = a);
  for (let i = num; i-- > 0; ) out[io + i * so] = tanh(a[ia + i * sa]);
  return out;
};
export {
  tanhS
};
