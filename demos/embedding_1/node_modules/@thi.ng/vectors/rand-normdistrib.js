import { normalize, normalize2, normalize3, normalize4 } from "./normalize.js";
import {
  randDistrib,
  randDistrib2,
  randDistrib3,
  randDistrib4
} from "./rand-distrib.js";
const randNormDistrib = (v, n = 1, distrib) => normalize(null, randDistrib(v, distrib), n);
const randNormDistrib2 = (v, n = 1, distrib) => normalize2(null, randDistrib2(v, distrib), n);
const randNormDistrib3 = (v, n = 1, distrib) => normalize3(null, randDistrib3(v, distrib), n);
const randNormDistrib4 = (v, n = 1, distrib) => normalize4(null, randDistrib4(v, distrib), n);
export {
  randNormDistrib,
  randNormDistrib2,
  randNormDistrib3,
  randNormDistrib4
};
