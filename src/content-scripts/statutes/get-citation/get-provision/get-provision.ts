import { getProvisionMap } from "./get-provision-map";
import { ProvisionGraph } from "./stringify-provision-map";

/**
 * Two steps to get the provision
 * 1. Get the regex matches while traversing upwards through the DOM, for each left click target HTMLElement and right click target HTMLElement
 * 2. Create a graph of nodes, with each node representing a provision, e.g. 6 -> (1) -> [(a), (b)]
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
  console.log({ leftMap, rightMap });

  const graph = new ProvisionGraph();
  graph.buildGraph(leftMap);
  graph.buildGraph(rightMap);

  const provisionText: string = graph.toString();
  console.log({ provisionText });

  return provisionText;
};
