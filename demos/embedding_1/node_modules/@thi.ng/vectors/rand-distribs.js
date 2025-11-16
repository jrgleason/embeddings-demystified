import { normal as op } from "@thi.ng/random/distributions/normal";
const randDistribS = (out, num, rnd = op(), n = 1, io = 0, so = 1) => {
  !out && (out = []);
  while (num-- > 0) out[io + num * so] = rnd() * n;
  return out;
};
const randDistribS2 = (out, rnd = op(), n = 1, io = 0, so = 1) => {
  !out && (out = []);
  out[io] = rnd() * n;
  out[io + so] = rnd() * n;
  return out;
};
const randDistribS3 = (out, rnd = op(), n = 1, io = 0, so = 1) => {
  !out && (out = []);
  out[io] = rnd() * n;
  out[io + so] = rnd() * n;
  out[io + 2 * so] = rnd() * n;
  return out;
};
const randDistribS4 = (out, rnd = op(), n = 1, io = 0, so = 1) => {
  !out && (out = []);
  out[io] = rnd() * n;
  out[io + so] = rnd() * n;
  out[io + 2 * so] = rnd() * n;
  out[io + 3 * so] = rnd() * n;
  return out;
};
export {
  randDistribS,
  randDistribS2,
  randDistribS3,
  randDistribS4
};
