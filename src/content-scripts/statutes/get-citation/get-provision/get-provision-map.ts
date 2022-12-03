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
  provisionDict: Map<RegExp, string>
): void {
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
    const regex = keys[i];
    const isFound: boolean =
      regex.test(text) && provisionDict.get(regex) === "";
    if (!isFound) {
      continue;
    }

    const [value] = regex.exec(text) as RegExpExecArray;
    provisionDict.set(regex, value);

    for (let j = i; j < keys.length; j++) {
      
    }
  }

  // Explore
  backtrack(element.parentElement, provisionDict);
}

/**
 * Get an ordered map mapping the regex to matched text
 * @param element The HTML target element of either the left click or right click mouse event
 * @returns
 */
export function getProvisionMap(element: HTMLElement): Map<RegExp, string> {
  console.log(element.innerText);
  // an ordered map
  const orderedMap = new Map<RegExp, string>([
    [numDot, ""],
    [bracketNumber, ""],
    [bracketAlpha, ""],
  ]);
  backtrack(element, orderedMap);
  console.log(orderedMap);
  return orderedMap;
}
