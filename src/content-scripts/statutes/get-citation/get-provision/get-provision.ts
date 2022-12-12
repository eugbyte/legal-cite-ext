import {
  bracketAlpha,
  bracketNumber,
  getProvisionMap,
  numDot,
  roman,
} from "./provision-map";
import { ProvisionTrie } from "./provision-trie/provision-trie";
import { getProvisionMapOfSelection } from "./selection-provision-map";

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
  const selectionMap: Map<RegExp, string> = getProvisionMapOfSelection(
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

  return provisionText;
};
