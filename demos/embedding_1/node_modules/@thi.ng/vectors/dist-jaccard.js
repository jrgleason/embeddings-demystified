const distJaccard = (a, b) => 1 - jaccardSimilarity(a, b);
const jaccardSimilarity = (a, b) => {
  let numUnion = 0;
  let numIsec = 0;
  for (let i = a.length; i-- > 0; ) {
    const aa = a[i] !== 0;
    const bb = b[i] !== 0;
    numUnion += ~~(aa || bb);
    numIsec += ~~(aa && bb);
  }
  return numUnion > 0 ? numIsec / numUnion : 0;
};
export {
  distJaccard,
  jaccardSimilarity
};
