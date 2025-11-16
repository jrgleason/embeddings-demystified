import { vop } from "./vop.js";
const defOpVV = (op, dispatch = 1, outA = true) => {
  const a = outA ? (o, a2, b2) => {
    !o && (o = a2);
    for (let i = a2.length; i-- > 0; ) o[i] = op(a2[i], b2[i]);
    return o;
  } : (o, a2, b2) => {
    !o && (o = b2);
    for (let i = a2.length; i-- > 0; ) o[i] = op(a2[i], b2[i]);
    return o;
  };
  const b = outA ? (o, a2, b2) => {
    !o && (o = a2);
    o[0] = op(a2[0], b2[0]);
    o[1] = op(a2[1], b2[1]);
    return o;
  } : (o, a2, b2) => {
    !o && (o = b2);
    o[0] = op(a2[0], b2[0]);
    o[1] = op(a2[1], b2[1]);
    return o;
  };
  const c = outA ? (o, a2, b2) => {
    !o && (o = a2);
    o[0] = op(a2[0], b2[0]);
    o[1] = op(a2[1], b2[1]);
    o[2] = op(a2[2], b2[2]);
    return o;
  } : (o, a2, b2) => {
    !o && (o = b2);
    o[0] = op(a2[0], b2[0]);
    o[1] = op(a2[1], b2[1]);
    o[2] = op(a2[2], b2[2]);
    return o;
  };
  const d = outA ? (o, a2, b2) => {
    !o && (o = a2);
    o[0] = op(a2[0], b2[0]);
    o[1] = op(a2[1], b2[1]);
    o[2] = op(a2[2], b2[2]);
    o[3] = op(a2[3], b2[3]);
    return o;
  } : (o, a2, b2) => {
    !o && (o = b2);
    o[0] = op(a2[0], b2[0]);
    o[1] = op(a2[1], b2[1]);
    o[2] = op(a2[2], b2[2]);
    o[3] = op(a2[3], b2[3]);
    return o;
  };
  return [
    vop(dispatch, a, b, c, d),
    b,
    c,
    d
  ];
};
export {
  defOpVV
};
