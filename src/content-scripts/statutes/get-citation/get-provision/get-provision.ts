import {
  bracketAlpha,
  bracketNumber,
  dash_a,
  dash_i,
  getProvisionMap,
  numDot,
  roman,
} from "./get-provision-map";
import { ProvisionTrie } from "./stringify-provision-map";

/**
 * Two steps to get the provision
 * 1. Get the regex matches while traversing upwards through the DOM, for each left click target HTMLElement and right click target HTMLElement
 * 2. Create a graph of nodes, with each node representing a provision, e.g. 6 -> (1) -> [(a), (b)], refers to s 6(1)(a) to s 6(1)(b)
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
  const selectionMap: Map<RegExp, string> = getSelectionMap(
    document.getSelection() as Selection,
    rightClick
  );

  console.log({ leftMap, rightMap, selectionMap });

  const trie = new ProvisionTrie();
  trie.add(leftMap);
  trie.add(selectionMap);
  trie.add(rightMap);

  const provisionText = trie.toString();
  console.log({ trieText: provisionText });

  return provisionText;
};

/**
 * @warning Fragile web scrapping code, may break if website changes, since the regex of the
 *
 * Gets an ordered map mapping the regex representing the sub-provisions to the matching text,
 * w.r.t the text selected between the left cursor and the right cursor.
 * Essenstially, get the starting sub provisions, e.g. (a) and (i)
 *
 * For example, for `s 8(1)(a)-(d)`, When the user left clicks on `s 8(1)`, drags the cursors and right clicks on `s 8(1)(d)`, sub provision `(a)` is left out
 * @param selection The selection object, represents the range of text selected by the user
 * @param rightClick The HTML target element from the right click event
 */
const getSelectionMap = (
  selection: Selection,
  rightClick: HTMLElement
): Map<RegExp, string> => {
  const selectedText = selection?.toString() || "";

  // There is an overlap between roman and bracket alpha, e.g. "(i)"
  const selectionMap = getProvisionMap(rightClick, new Set<RegExp>([numDot, bracketNumber, bracketAlpha, roman]));

  if (dash_a.test(selectedText)) {
    const map = getProvisionMap(rightClick, new Set<RegExp>([numDot, bracketNumber, dash_a]));
    selectionMap.set(bracketAlpha, map.get(dash_a) || "")
  } 
  if (dash_i.test(selectedText)) {
    const map = getProvisionMap(rightClick, new Set<RegExp>([numDot, bracketNumber, dash_i]));
    selectionMap.set(roman, map.get(dash_i) || "")
  }

  return selectionMap;
};
