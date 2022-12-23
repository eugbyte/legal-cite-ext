const numDot = /^\d+[A-Z]?\./; // "2.", "2A."
const bracketNumber = /^—?\(\d+[A-Z]?\)/; // "(1)"
const bracketAlpha = /^\([A-Z]+\)/i; // "(a)"
const roman = /^\([xvi]+\)/i; // "(i)"
const dash_a = /—\r?\n\(a\)\t/; // "—\n—(a)""
const dash_i = /—(\r)?\n\(i\)\t/; // "—\n—(i)""
export { numDot, bracketNumber, bracketAlpha, roman, dash_a, dash_i };
