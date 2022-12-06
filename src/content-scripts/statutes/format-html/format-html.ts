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
      result += `<i>${citation.slice(start, end + 1)}</i>`;
      index += end - start + 1;
    }
  }

  if (index != citation.length) {
    result += citation.slice(index);
  }

  const htmlContent = `
        <p>${selection}</p>
        <p style="color:red">${result}</p>
      `;

  return htmlContent;
};
