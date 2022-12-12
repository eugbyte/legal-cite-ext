const numDot = /^\d+\./;
const bracketNumber = /^—?\(\d+\)/;
const bracketAlpha = /^\([A-Z]+\)/i;
const roman = /^\([xvi]+\)/i;
const dash_a = /—\r?\n\(a\)\t/;
const dash_i = /—(\r)?\n\(i\)\t/;
export { numDot, bracketNumber, bracketAlpha, roman, dash_a, dash_i };
