const distCosine = (a, b) => {
  let asum = 0;
  let bsum = 0;
  let dot = 0;
  for (let i = a.length; i-- > 0; ) {
    const aa = a[i];
    const bb = b[i];
    asum += aa * aa;
    bsum += bb * bb;
    dot += aa * bb;
  }
  return dot ? dot / (Math.sqrt(asum) * Math.sqrt(bsum)) : 0;
};
export {
  distCosine
};
