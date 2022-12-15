import {
  bracketAlpha,
  bracketNumber,
  dash_a,
  dash_i,
  getProvisionMap,
  numDot,
  roman,
} from "./provision-map";
import { ProvisionTrie } from "./provision-trie/provision-trie";
import cloneShallow from "lodash.clone";

/**
 * Two steps to get the provision
 * 1. Get the regex matches while traversing upwards through the DOM, for each left click target HTMLElement and right click target HTMLElement
 * 2. Create a graph of nodes, with each node representing a provision, e.g. `6 -> (1) -> [(a), (b)]`, refers to `s 6(1)(a)` to `s 6(1)(b)`
 * @param leftClick The HTML target element from the left click event
 * @param rightClick The HTML target element from the right click event
 * @returns The fully formed provision
 */
export const getProvision = (
  leftClick: HTMLElement,
  rightClick: HTMLElement
): string => {
  const leftMap: Map<RegExp, string> = getProvisionMap(
    leftClick,
    new Set<RegExp>([numDot, bracketNumber, bracketAlpha, roman])
  );
  const rightMap: Map<RegExp, string> = getProvisionMap(
    rightClick,
    new Set<RegExp>([numDot, bracketNumber, bracketAlpha, roman])
  );
  const selectionMap: Map<RegExp, string> = getProvisionMapFromSelection(
    document.getSelection() as Selection,
    rightClick,
    rightMap
  );

  console.log({ leftMap, rightMap, selectionMap });

  const trie = new ProvisionTrie();
  trie.add(leftMap);
  trie.add(selectionMap);
  trie.add(rightMap);

  const provisionText = trie.toString();
  console.log({ trieText: provisionText });
  console.log({ toString2: trie.toString2() });

  return provisionText;
};

/**
 * Gets an ordered map mapping the regex representing the prefix sub-provisions, e.g. (a) and (i), w.r.t the text selected between the left cursor and the right cursor.
 *
 * For example, for `s 8(1)(a)-(d)`, When the user left clicks on `s 8(1)`, drags the cursors and right clicks on `s 8(1)(d)`, sub provision `(a)` is left out.
 *
 * @warn Note that this function is just a brief estimate. It falses adds "(a)" for cases like `s 8(3)(a)` - `s 9(1)` -> `"s 9(1)(a)"`
 * @param selection The selection object, represents the range of text selected by the user
 * @param rightClick The HTML target element from the right click event
 * @param rightMap The fully formed provision map from the right click HTML target. This rightMap will be cloned, without affecting the original.
 * @returns The provision map of the prefix sub-provisions of "(a)" and "(i)", e.g. s `n(n)(a)(i)`
 */
const getProvisionMapFromSelection = (
  selection: Selection,
  rightClick: HTMLElement,
  rightMap: Map<RegExp, string>
): Map<RegExp, string> => {
  const selectedText = selection?.toString() || "";

  // Use shallow copy instead of deep copy as the keys are regex objects.
  const selectionMap = cloneShallow(rightMap);

  // Focus on the prefixes of the sub provision of "(a)" and "(i)"
  const prefixMap = getProvisionMap(
    rightClick,
    new Set<RegExp>([numDot, bracketNumber, dash_a, dash_i])
  );
  console.log({ prefixMap });

  if (dash_a.test(selectedText)) {
    selectionMap.set(bracketAlpha, prefixMap.get(dash_a) || "");
  }
  if (dash_i.test(selectedText)) {
    selectionMap.set(roman, prefixMap.get(dash_i) || "");
  }

  return selectionMap;
};
