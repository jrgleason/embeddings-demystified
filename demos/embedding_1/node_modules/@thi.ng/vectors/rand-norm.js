import { normalize, normalize2, normalize3, normalize4 } from "./normalize.js";
import { random, random2, random3, random4 } from "./random.js";
const randNorm = (v, n = 1, rnd) => normalize(null, random(v, -1, 1, rnd), n);
const randNorm2 = (v, n = 1, rnd) => normalize2(null, random2(v, -1, 1, rnd), n);
const randNorm3 = (v, n = 1, rnd) => normalize3(null, random3(v, -1, 1, rnd), n);
const randNorm4 = (v, n = 1, rnd) => normalize4(null, random4(v, -1, 1, rnd), n);
export {
  randNorm,
  randNorm2,
  randNorm3,
  randNorm4
};
