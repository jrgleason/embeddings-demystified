import { isNumber } from "@thi.ng/checks/is-number";
import { fillRange } from "./fill-range.js";
import { shuffle } from "./shuffle.js";
function permutation(buf, rnd) {
  return shuffle(
    fillRange(isNumber(buf) ? new Array(buf) : buf),
    void 0,
    rnd
  );
}
export {
  permutation
};
