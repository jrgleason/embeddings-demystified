import { smoothStep as op } from "@thi.ng/math/step";
import { defOpVVV } from "./defopvvv.js";
const [a, b, c, d] = defOpVVV(op, 1, false);
const smoothStep = a;
const smoothStep2 = b;
const smoothStep3 = c;
const smoothStep4 = d;
export {
  smoothStep,
  smoothStep2,
  smoothStep3,
  smoothStep4
};
