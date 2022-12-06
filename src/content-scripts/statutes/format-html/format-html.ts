/**
 * Colors the HTML encoded text red, and italicize the bracket portions of the provisions, e.g (a)
 * @param selection the text selection of the document
 * @param citation the citation, e.g. "s 6(a)"
 * @returns The HTML encoded text
 */
export const formatHTML = (selection: string, citation: string) => {
  const bracketAlpha = /\([A-Z]+\)/gi;

  const queue: [number, number][] = [...citation.matchAll(bracketAlpha)].map(
    (match) => [
      match.index as number,
      (match.index as number) + match[0].length - 1,
    ]
  );

  let result = "";
  let index = 0;

  while (index < citation.length && queue.length > 0) {
    const [start, end] = queue[0];
    const inRange = start <= index && index <= end;
    if (!inRange) {
      result += citation[index];
      index += 1;
    } else {
      queue.shift();
      let italic = citation.slice(start, end + 1); // "(e)"
      italic = italic.slice(1, italic.length - 1); // "e"
      italic = `<i>${italic}</i>`; // "<i>e</i>"
      result += `(${italic})`; // "(<i>e</i>)"
      index += end - start + 1;
    }
  }

  if (index != citation.length) {
    result += citation.slice(index);
  }

  const htmlContent = `
        <p style="white-space: pre-line">${selection}</p>
        <p style="color:red">${result}</p>
      `;

  return htmlContent;
};
