const swizzle = (order) => {
  const [a, b, c, d, e, f, g, h] = order;
  switch (order.length) {
    case 0:
      return () => [];
    case 1:
      return (x) => [x[a]];
    case 2:
      return (x) => [x[a], x[b]];
    case 3:
      return (x) => [x[a], x[b], x[c]];
    case 4:
      return (x) => [x[a], x[b], x[c], x[d]];
    case 5:
      return (x) => [x[a], x[b], x[c], x[d], x[e]];
    case 6:
      return (x) => [x[a], x[b], x[c], x[d], x[e], x[f]];
    case 7:
      return (x) => [x[a], x[b], x[c], x[d], x[e], x[f], x[g]];
    case 8:
      return (x) => [x[a], x[b], x[c], x[d], x[e], x[f], x[g], x[h]];
    default:
      return (x) => {
        let n = order.length;
        const res = new Array(n);
        for (; n-- > 0; ) res[n] = x[order[n]];
        return res;
      };
  }
};
export {
  swizzle
};
