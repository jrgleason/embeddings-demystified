import { ensureIndex } from "@thi.ng/errors/out-of-bounds";
const lookup = (table, ids) => ids.map((i) => (ensureIndex(i, 0, table.length), table[i]));
const lookupUnsafe = (table, ids) => ids.map((i) => table[i]);
export {
  lookup,
  lookupUnsafe
};
