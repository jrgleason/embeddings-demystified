import { abs } from "./abs.js";
import { center } from "./center.js";
import { magSq } from "./magsq.js";
import { sum } from "./sum.js";
const variance = (a, isCentered = false, corrected = false) => {
  const k = ~~corrected;
  return a.length > k ? magSq(isCentered ? a : center([], a)) / (a.length - k) : 0;
};
const sd = (a, isCentered = false, corrected = false) => Math.sqrt(variance(a, isCentered, corrected));
const sdError = (a, isCentered = false, corrected = false) => a.length > 1 ? sd(a, isCentered, corrected) / Math.sqrt(a.length) : 0;
const meanAD = (a, isCentered = false) => a.length > 1 ? sum(isCentered ? abs([], a) : abs(null, center([], a))) / a.length : 0;
export {
  meanAD,
  sd,
  sdError,
  variance
};
