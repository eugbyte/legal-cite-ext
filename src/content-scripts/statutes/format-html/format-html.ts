import { createPara } from "./create-para";
import { italiciseRegexMatches } from "./italicise-regex-matches";

/**
 * Colors the HTML encoded text red, and italicize the bracket portions of the provisions, e.g (a)
 * @param selection the text selection of the document
 * @param citation the citation, e.g. "s 6(a)"
 * @returns The HTML encoded text
 */
export const formatHTML = (selection: string, citation: string) => {
  const bracketAlpha = /\([A-Z]+\)/gi;
  const result = italiciseRegexMatches(citation, bracketAlpha);

  const htmlContent = `
        <div>${createPara(selection)}</div>
        <p style="color:red">${result}</p>
      `;

  return htmlContent;
};
