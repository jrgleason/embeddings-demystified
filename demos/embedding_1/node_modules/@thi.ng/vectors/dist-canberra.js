const { abs } = Math;
const distCanberra = (a, b) => {
  let delta = 0;
  for (let i = a.length; i-- > 0; ) {
    const aa = a[i];
    const bb = b[i];
    const d = abs(aa) + abs(bb);
    d > 0 && (delta += abs(aa - bb) / d);
  }
  return delta;
};
export {
  distCanberra
};
