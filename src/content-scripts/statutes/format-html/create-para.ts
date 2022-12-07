// Line breaks, e.g. \n, are not "respected" on the clipboard when copied from document.getSelection().toString()
export const createPara = (selection: string): string => {
  return selection
    .split("\n")
    .map((text) => `<p>${text}</p>`)
    .join("")
    .replaceAll("\r", "");
};
