import { vop } from "./vop.js";
const defOpVN = (op, dispatch = 1) => {
  const a = (o, a2, n) => {
    !o && (o = a2);
    for (let i = a2.length; i-- > 0; ) o[i] = op(a2[i], n);
    return o;
  };
  const b = (o, a2, n) => {
    !o && (o = a2);
    o[0] = op(a2[0], n);
    o[1] = op(a2[1], n);
    return o;
  };
  const c = (o, a2, n) => {
    !o && (o = a2);
    o[0] = op(a2[0], n);
    o[1] = op(a2[1], n);
    o[2] = op(a2[2], n);
    return o;
  };
  const d = (o, a2, n) => {
    !o && (o = a2);
    o[0] = op(a2[0], n);
    o[1] = op(a2[1], n);
    o[2] = op(a2[2], n);
    o[3] = op(a2[3], n);
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
  defOpVN
};
