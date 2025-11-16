import {
  normalizeS,
  normalizeS2,
  normalizeS3,
  normalizeS4
} from "./normalizes.js";
import {
  randDistribS,
  randDistribS2,
  randDistribS3,
  randDistribS4
} from "./rand-distribs.js";
const randNormDistribS = (out, num, rnd, n = 1, io = 0, so = 1) => normalizeS(
  null,
  randDistribS(out, num, rnd, 1, io, so),
  num,
  n,
  io,
  io,
  so,
  so
);
const $ = (normalize, random) => (a, rnd, n = 1, ia = 0, sa = 1) => normalize(null, random(a, rnd, 1, ia, sa), n, ia, ia, sa, sa);
const randNormDistribS2 = $(normalizeS2, randDistribS2);
const randNormDistribS3 = $(normalizeS3, randDistribS3);
const randNormDistribS4 = $(normalizeS4, randDistribS4);
export {
  randNormDistribS,
  randNormDistribS2,
  randNormDistribS3,
  randNormDistribS4
};
