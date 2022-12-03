import { getProvisionMap } from "./get-provision-map";
import { ProvisionGraph } from "./stringify-provision-map";

/**
 *
 * @param leftClick The HTML target element from the left click event
 * @param rightClick The HTML target element from the right click event
 * @returns The fully formed provision
 */
export const getProvision = (
  leftClick: HTMLElement,
  rightClick: HTMLElement
): string => {
  // convert the regex map, e.g. /\d+\./ -> "2." to a string
  const leftMap: Map<RegExp, string> = getProvisionMap(leftClick);
  const rightMap: Map<RegExp, string> = getProvisionMap(rightClick);

  const graph = new ProvisionGraph();
  graph.buildGraph(leftMap);
  graph.buildGraph(rightMap);

  const provisionText = graph.stringifyGraph().replaceAll(".", "");
  console.log({ provisionText });

  return provisionText;
};
