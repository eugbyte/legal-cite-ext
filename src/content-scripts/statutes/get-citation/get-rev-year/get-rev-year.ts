export const getRevEdYear = (): string => {
  const elem = document.querySelector(".status-value");
  if (elem == null) {
    return "";
  }
  const actNumber = (elem as HTMLElement).innerText;
  const [year] = actNumber.match(/\d{4}/g) as RegExpMatchArray;
  return `${year} Rev Ed`;
};
