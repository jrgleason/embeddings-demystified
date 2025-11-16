import { dotS, dotS2, dotS3, dotS4 } from "./dots.js";
const magSqS = (a, num, ia, sa) => dotS(a, a, num, ia, ia, sa, sa);
const magSqS2 = (a, ia, sa) => dotS2(a, a, ia, ia, sa, sa);
const magSqS3 = (a, ia, sa) => dotS3(a, a, ia, ia, sa, sa);
const magSqS4 = (a, ia, sa) => dotS4(a, a, ia, ia, sa, sa);
export {
  magSqS,
  magSqS2,
  magSqS3,
  magSqS4
};
