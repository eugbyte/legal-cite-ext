const numDot = /\d+\./;
const bracketNumber = /\(-?\d+\)/;
const bracketAlpha = /\([A-Z]+\)/i;

/**
 * We use an ordered hashmap to record the provisions found as we traverse up the DOM tree recursively using element.parentElement.
 *
 * At the same time, when we find a provision, e.g. (2) of 5(2), we need to make sure that we don't add a provision such as "(a)",
 * when we inspect the entire textContent of the root parent element.
 *
 * Lastly, remove the trailing empty keys from the hashmap.
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

  for (const regex of keys) {
    const isFound: boolean =
      regex.test(text) && provisionDict.get(regex) === "";
    if (!isFound) {
      continue;
    }

    const [value] = regex.exec(text) as RegExpExecArray;
    provisionDict.set(regex, value);
  }

  // Explore
  backtrack(element.parentElement, provisionDict, (depth += 1));
}

export function getProvisionMap(element: HTMLElement): Map<RegExp, string> {
  console.log(element.innerText);
  // an ordered map
  const orderedDict = new Map<RegExp, string>([
    [numDot, ""],
    [bracketNumber, ""],
    [bracketAlpha, ""],
  ]);
  backtrack(element, orderedDict);
  console.log(orderedDict);
  return orderedDict;
}
