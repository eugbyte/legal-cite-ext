import { bracketAlpha } from "../get-citation";

export const formatHTML = (selection: string, citation: string) => {
  if (bracketAlpha.test(citation)) {
    const texts = citation.split(bracketAlpha);
    const [bracketAlphaText] = bracketAlpha.exec(citation) as RegExpExecArray;
    bracketAlphaText.replace("(", "<i>");
    bracketAlphaText.replace(")", "</i>");
    texts.splice(1, 0, bracketAlphaText);
    citation = texts.join("");
  }
  const htmlContent = `
        <p>${selection}</p>
        <p style="color:red">${citation}</p>
      `;

  return htmlContent;
};
