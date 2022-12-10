export const numDot = /^\d+\./;
export const bracketNumber = /^—?\(\d+\)/;
export const bracketAlpha = /^\([A-Z]+\)/i;
export const roman = /^\([xvi]+\)/i;
export const dash_a = /—\r?\n\(a\)\t/;
export const dash_i = /—(\r)?\n\(i\)\t/;

/**
 * Get an ordered map mapping the regex to matched text
 *
 * e.g. `{ /d+\./ : "6.", /\(-?\d+\)/ : "(1)" }` -> s 6(1)
 * @param element The HTML target element of either the left click or right click mouse event
 * @returns
 */
export function getProvisionMap(element: HTMLElement): Map<RegExp, string> {
  // an ordered map
  const orderedMap = new Map<RegExp, string>([
    [numDot, ""],
    [bracketNumber, ""],
    [dash_a, ""],
    [bracketAlpha, ""],
    [dash_i, ""],
    [roman, ""],
  ]);
  traverseUp(element, orderedMap);
  return orderedMap;
}

/**
 * We use an ordered hashmap to record the provisions found as we traverse up the DOM tree recursively using element.parentElement.
 *
 * At the same time, when we find a provision, e.g. (2) of 5(2), we need to make sure that we don't add a provision such as "(a)",
 * when we inspect the entire textContent of the root parent element.
 *
 * Lastly, remove the trailing empty keys from the hashmap.
 */
function traverseUp(
  element: HTMLElement | null,
  provisionDict: Map<RegExp, string>
): void {
  // Base cases
  // no more parent element
  if (element == null) {
    return;
  }
  // provisions are fully formed, e.g. ["5.", "(1)"]
  const isComplete = provisionDict.get(numDot) !== "";
  if (isComplete) {
    return;
  }

  const text: string = element.innerText || "";

  // Choose and update state
  const keys: RegExp[] = Array.from(provisionDict.keys());

  for (let i = keys.length - 1; i >= 0; i--) {
    const regex = keys[i];
    const isFound: boolean =
      regex.test(text) && provisionDict.get(regex) === "";
    if (!isFound) {
      continue;
    }

    let [value] = regex.exec(text) as RegExpExecArray;
    value = value
      .replaceAll(".", "")
      .replaceAll("—", "")
      .replaceAll(/\r|\r\n|\n|\t/gm, "")
      .replaceAll("—", "");
    provisionDict.set(regex, value);

    // delete the empty trailing keys in the ordered dict
    for (let j = i; j < keys.length; j++) {
      if (provisionDict.get(keys[j]) === "") {
        provisionDict.delete(keys[j]);
      }
    }

    /**
     * @warning  Fragile web scrapping code, may break if website changes.
     *
     * Fragile code workaround to handle regex overlap between bracketAlpha and roman regex, e.g. for "(i)".
     *
     * In the AGC website, every level of sub-provision for letters and roman numerals, are enclosed in <table>.
     * So "(a)" is in a table, and "(ii)" is in another nested table.
     */
    const isRomanAlphaOverlap: boolean =
      regex == roman && isFound && bracketAlpha.test(text);
    let elementCopy: HTMLElement | null = element;
    if (isRomanAlphaOverlap) {
      while (
        elementCopy != null &&
        elementCopy.tagName !== "TABLE" &&
        !numDot.test(elementCopy.innerText)
      ) {
        elementCopy = elementCopy.parentElement;
      }

      if (
        elementCopy == null ||
        numDot.test((elementCopy as HTMLElement).innerText)
      ) {
        console.error(
          "TABLE tag not found or depth edited. Website changed, hence, web scrapping broke."
        );
        // let the user know of the error, and to edit the citation himself
        provisionDict.set(bracketAlpha, "(__)");
      } else {
        element = elementCopy;
        break;
      }
    }
  }

  // Explore
  const next = element?.parentElement as HTMLElement | null;
  traverseUp(next, provisionDict);
}
