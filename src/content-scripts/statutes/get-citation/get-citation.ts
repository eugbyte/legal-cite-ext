import { getChapter } from "./get-chapter";
import { getProvision } from "./get-provision";
import { getRevEdYear } from "./get-rev-year";

/**
 *
 * @param leftCursor The target element from the left mouse event
 * @param rightCursor The target element from the right mouse event
 * @returns The complete citation
 */
export const getCitation = (
  leftCursor: HTMLElement,
  rightCursor: HTMLElement
): string => {
  const chapter: string = getChapter(); // Personal Data Protection Act 2012
  const revEdYear = getRevEdYear(); // 2020 Rev Ed
  const provisionText = getProvision(leftCursor, rightCursor);

  const citation = `${chapter} (${revEdYear}) s ${provisionText}`; // Personal Data Protection Act 2012 (2020 Rev Ed) s 2(1)
  return citation.replace(/\n+/g, ""); // remove line breaks
};
