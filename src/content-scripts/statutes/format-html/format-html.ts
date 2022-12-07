import { createParas } from "./create-paras";
import { italiciseRegexMatches } from "./italicise-regex";

/**
 * Colors the HTML encoded text red, and italicize the bracket portions of the provisions, e.g (a)
 * @param selection the text selection of the document
 * @param citation the citation, e.g. "s 6(a)"
 * @returns The HTML encoded text
 */
export const formatHTML = (selection: string, citation: string) => {
  const bracketAlpha = /\([A-Z]+\)/gi;
  const result = italiciseRegexMatches(citation, bracketAlpha);
  const paragraph = createParas(selection).join("").replaceAll("\r", "");

  const htmlContent = `<div>${paragraph}</div>
        <p style="color:red">${result}</p>`;

  return htmlContent;
};
