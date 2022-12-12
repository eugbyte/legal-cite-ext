import {
  getProvisionMap,
  numDot,
  bracketNumber,
  dash_a,
  dash_i,
  bracketAlpha,
  roman,
} from "./provision-map";
import cloneShallow from "lodash.clone";

/**
 * Gets an ordered map mapping the regex representing the prefix sub-provisions, e.g. (a) and (i), w.r.t the text selected between the left cursor and the right cursor.
 *
 * For example, for `s 8(1)(a)-(d)`, When the user left clicks on `s 8(1)`, drags the cursors and right clicks on `s 8(1)(d)`, sub provision `(a)` is left out
 * @param selection The selection object, represents the range of text selected by the user
 * @param rightClick The HTML target element from the right click event
 * @param rightMap The fully formed provision map from the right click HTML target. This rightMap will be cloned, without affecting the .
 * @returns The provision map of the prefix sub-provisions of "(a)" and "(i)", e.g. s `n(n)(a)(i)`
 */
export const getProvisionMapOfSelection = (
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

  if (dash_a.test(selectedText)) {
    selectionMap.set(bracketAlpha, prefixMap.get(dash_a) || "");
  }
  if (dash_i.test(selectedText)) {
    selectionMap.set(roman, prefixMap.get(dash_i) || "");
  }

  return selectionMap;
};
