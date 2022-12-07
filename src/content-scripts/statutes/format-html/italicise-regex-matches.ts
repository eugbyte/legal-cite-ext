// sub-provisions have italicised letters, e.g. (a)
export const italiciseRegexMatches = (citation: string, regex: RegExp) => {
  const queue: [number, number][] = [...citation.matchAll(regex)].map(
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
  return result;
};
