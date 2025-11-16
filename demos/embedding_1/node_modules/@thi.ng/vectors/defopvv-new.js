import { vop } from "./vop.js";
const defOpVVNew = (op, dispatch = 1) => {
  const a = (o, a2, b2) => {
    !o && (o = []);
    for (let i = a2.length; i-- > 0; ) o[i] = op(a2[i], b2[i]);
    return o;
  };
  const b = (o, a2, b2) => {
    !o && (o = []);
    o[0] = op(a2[0], b2[0]);
    o[1] = op(a2[1], b2[1]);
    return o;
  };
  const c = (o, a2, b2) => {
    !o && (o = []);
    o[0] = op(a2[0], b2[0]);
    o[1] = op(a2[1], b2[1]);
    o[2] = op(a2[2], b2[2]);
    return o;
  };
  const d = (o, a2, b2) => {
    !o && (o = []);
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
  defOpVVNew
};
