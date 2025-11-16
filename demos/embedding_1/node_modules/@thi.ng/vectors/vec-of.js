const vecOf = (size, n = 0) => new Array(size).fill(n);
const oneHot = (size, hot, value = 1) => {
  const res = vecOf(size);
  res[hot] = value;
  return res;
};
export {
  oneHot,
  vecOf
};
