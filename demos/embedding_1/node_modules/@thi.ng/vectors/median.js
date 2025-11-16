import { __ensureInputs } from "./ensure.js";
const median = (out, src) => {
  __ensureInputs(src);
  out = out || [];
  for (let i = src[0].length; i-- > 0; ) {
    out[i] = vmedian(src.map((x) => x[i]));
  }
  return out;
};
const vmedian = (a) => {
  if (!a.length) return 0;
  const n = a.length;
  const m = n >> 1;
  a = [...a].sort((a2, b) => a2 - b);
  return n & 1 ? a[m] : (a[m - 1] + a[m]) * 0.5;
};
export {
  median,
  vmedian
};
