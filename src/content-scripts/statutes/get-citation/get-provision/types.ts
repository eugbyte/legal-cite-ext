const numDot = /\d+\./;
const bracketNumber = /\(-?\d+\)/;
const bracketAlpha = /\([A-Z]+\)/i;

export { numDot, bracketNumber, bracketAlpha };

export enum CLICK_TYPE {
  left = 0,
  middle,
  right,
}
