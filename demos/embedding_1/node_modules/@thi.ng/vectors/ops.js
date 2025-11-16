const $add = (a, b) => a + b;
const $addI = (a, b) => a + b | 0;
const $addU = (a, b) => a + b >>> 0;
const $addm = (a, b, c) => (a + b) * c;
const $bandI = (a, b) => a & b;
const $bandU = (a, b) => (a & b) >>> 0;
const $borI = (a, b) => a | b;
const $borU = (a, b) => (a | b) >>> 0;
const $bxorI = (a, b) => a ^ b;
const $bxorU = (a, b) => (a ^ b) >>> 0;
const $div = (a, b) => a / b;
const $divI = (a, b) => a / b | 0;
const $divU = (a, b) => a / b >>> 0;
const $fmod = (a, b) => a % b;
const $lsI = (a, b) => a << b;
const $lsU = (a, b) => a << b >>> 0;
const $madd = (a, b, c) => a * b + c;
const $msub = (a, b, c) => a * b - c;
const $mix = (a, b, c) => a + (b - a) * c;
const $mul = (a, b) => a * b;
const $mulI = (a, b) => a * b | 0;
const $mulU = (a, b) => a * b >>> 0;
const $rsI = (a, b) => a >> b;
const $rsU = (a, b) => a >>> b;
const $sub = (a, b) => a - b;
const $subI = (a, b) => a - b | 0;
const $subU = (a, b) => a - b >>> 0;
const $subm = (a, b, c) => (a - b) * c;
export {
  $add,
  $addI,
  $addU,
  $addm,
  $bandI,
  $bandU,
  $borI,
  $borU,
  $bxorI,
  $bxorU,
  $div,
  $divI,
  $divU,
  $fmod,
  $lsI,
  $lsU,
  $madd,
  $mix,
  $msub,
  $mul,
  $mulI,
  $mulU,
  $rsI,
  $rsU,
  $sub,
  $subI,
  $subU,
  $subm
};
