import { PI, TAU } from "@thi.ng/math/api";
import { cartesian2FromAngles } from "./cartesian.js";
import { center } from "./center.js";
import { headingXY } from "./heading.js";
import { mean } from "./mean.js";
import { sd, variance } from "./variance.js";
const circularMean = (angles) => headingXY(mean([], cartesian2FromAngles(angles)));
const centerCircular = (out, angles) => {
  const mean2 = circularMean(angles);
  !out && (out = []);
  for (let i = 0, n = angles.length; i < n; i++) {
    out[i] = (angles[i] - mean2 + PI) % TAU;
  }
  return center(null, out);
};
const circularVariance = (angles, corrected) => variance(centerCircular([], angles), true, corrected);
const circularSD = (angles, corrected) => sd(centerCircular([], angles), true, corrected);
export {
  centerCircular,
  circularMean,
  circularSD,
  circularVariance
};
