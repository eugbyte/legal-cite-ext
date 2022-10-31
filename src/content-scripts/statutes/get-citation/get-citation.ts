import { getChapter } from "./get-chapter";
import { getProvision } from "./get-provision";
import { getRevEdYear } from "./get-rev-year";

export const getCitation = (target: HTMLElement): string => {
  const chapter: string = getChapter(); // Personal Data Protection Act 2012
  const revEdYear = getRevEdYear(); // 2020 Rev Ed
  const provision: string = getProvision(target); // s 2(1)
  const citation = `${chapter} (${revEdYear}) s ${provision}`; // Personal Data Protection Act 2012 (2020 Rev Ed) s 2(1)
  return citation.replace(/\n+/g, ""); // remove line breaks
};
