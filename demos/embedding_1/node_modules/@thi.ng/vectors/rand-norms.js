import {
  normalizeS,
  normalizeS2,
  normalizeS3,
  normalizeS4
} from "./normalizes.js";
import { randomS, randomS2, randomS3, randomS4 } from "./randoms.js";
const randNormS = (v, size, n = 1, rnd, ia = 0, sa = 1) => normalizeS(
  v,
  randomS(v, size, -1, 1, rnd, ia, sa),
  size,
  n,
  ia,
  ia,
  sa,
  sa
);
const $ = (normalize, random) => (a, n = 1, rnd, ia = 0, sa = 1) => normalize(null, random(a, -1, 1, rnd, ia, sa), n, ia, ia, sa, sa);
const randNormS2 = $(normalizeS2, randomS2);
const randNormS3 = $(normalizeS3, randomS3);
const randNormS4 = $(normalizeS4, randomS4);
export {
  randNormS,
  randNormS2,
  randNormS3,
  randNormS4
};
