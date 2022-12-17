/**
 * Create HTML paragraphs, e.g. <p></p> from line breaks in text, e.g. "Hello \n World" => <p>Hello</p><p>World</p>.
 *
 * Line breaks, e.g. \n, are not "respected" for the "text/html" mime format on the clipboard when copied from document.getSelection().toString().
 * Thus, manually create <p> paragraphs instead
 * @param selection the selected text from `document.getSelection().toString()`
 * @returns an array of paragraphs
 */
export const createParas = (selection: string): string => {
  return selection
    .split("\n")
    .map((text) => `<p>${text}</p>`)
    .join("")
    .replaceAll("\r", "");
};
