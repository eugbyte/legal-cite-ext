const numDot = /\d+\./;
const bracketNumber = /\(-?\d+\)/;
const bracketAlpha = /\([A-Z]+\)/i;

/**
 * We use an ordered hashmap to record the provisions found as we traverse up the DOM tree recursively using element.parentElement.
 * At the same time, when we find a provision, e.g. (2) of 5(2), we need to make sure that we don't add a provision such as "(a)",
 * when we inspect the entire textContent of the root parent element.
 * Thus, remove the trailing empty keys from the hashmap.
 */
function backtrack(
  element: HTMLElement | null,
  provisionDict: Map<RegExp, string>,
  depth = 0
): void {
  console.log({ depth });

  // Base cases
  // no more parent element
  if (element == null) {
    console.log("element is null");
    return;
  }
  // provisions are fully formed, e.g. ["5.", "(1)"]
  const isComplete = provisionDict.get(numDot) !== "";
  if (isComplete) {
    console.log({ isComplete });
    return;
  }

  const text: string = element.innerText || "";

  // Choose and update state
  const keys: RegExp[] = Array.from(provisionDict.keys());

  for (let i = 0; i < keys.length; i++) {
    const regex: RegExp = keys[i];
    const isFound: boolean =
      regex.test(text) && provisionDict.get(regex) === "";
    if (!isFound) {
      continue;
    }

    const [value] = regex.exec(text) as RegExpExecArray;
    provisionDict.set(regex, value);

    // delete the empty trailing suffixes
    for (let j = i; j < keys.length; j++) {
      if (provisionDict.get(keys[j]) === "") {
        provisionDict.delete(keys[j]);
      }
    }
  }

  // Explore
  backtrack(element.parentElement, provisionDict, (depth += 1));
}

export function getProvision(element: HTMLElement): string {
  console.log(element.innerText);
  const map = new Map<RegExp, string>([
    [numDot, ""],
    [bracketNumber, ""],
    [bracketAlpha, ""],
  ]);
  backtrack(element, map);
  console.log(map);
  return Array.from(map.values()).join("").replace(".", "");
}
