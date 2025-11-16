const filterAll = (pred, ...xs) => {
  const res = new Array(xs.length + 1).fill(0).map(() => []);
  const a = xs[0];
  for (let i = 0, n = a.length, m = xs.length; i < n; i++) {
    if (pred(a[i])) {
      for (let j = 0; j < m; j++) res[j].push(xs[j][i]);
    }
  }
  return res;
};
export {
  filterAll
};
