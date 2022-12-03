import { getProvisionMap } from "./get-provision-map";
import { buildGraph as _buildGraph, stringifyGraph } from "./stringify-map";

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
  console.log({ leftMap, rightMap });

  const graph: Record<string, Set<string>> = {};
  const buildGraph = _buildGraph.bind(null, graph);
  buildGraph(leftMap);
  console.log("left", graph);
  buildGraph(rightMap);
  console.log("left and right", graph);

  const first = Object.keys(graph)[0];
  const provisionText = stringifyGraph(graph, first).replaceAll(".", "");
  console.log({ provisionText });

  return provisionText;
};
