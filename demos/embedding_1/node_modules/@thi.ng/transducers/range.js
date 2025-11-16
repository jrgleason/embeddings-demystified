import { isReduced, Reduced } from "./reduced.js";
function range(from, to, step) {
  return new Range(from, to, step);
}
class Range {
  from;
  to;
  step;
  constructor(from, to, step) {
    if (from === void 0) {
      from = 0;
      to = Infinity;
    } else if (to === void 0) {
      to = from;
      from = 0;
    }
    step = step === void 0 ? from < to ? 1 : -1 : step;
    this.from = from;
    this.to = to;
    this.step = step;
  }
  *[Symbol.iterator]() {
    const { from, to, step } = this;
    for (let i = 0, x; x = from + i * step, step >= 0 && x < to || step < 0 && x > to; i++) {
      yield x;
    }
  }
  $reduce(rfn, acc) {
    const { from, to, step } = this;
    for (let i = 0, x; x = from + i * step, !isReduced(acc) && (step >= 0 && x < to || step < 0 && x > to); i++) {
      acc = rfn(acc, x);
    }
    return acc;
  }
}
export {
  Range,
  range
};
