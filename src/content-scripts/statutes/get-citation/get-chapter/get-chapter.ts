import titleCase from "lodash.startcase";

export const getChapter = (): string => {
  const chapter = (document.querySelector(".legis-title") as HTMLElement)
    .innerText;
  return titleCase(chapter);
};
