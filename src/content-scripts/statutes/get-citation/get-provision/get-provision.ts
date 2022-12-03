import { getProvisionMap } from "./get-provision-map";
import { buildGraph as _buildGraph, stringifyGraph } from "./stringify-map";

export const getProvision = (
  leftClick: HTMLElement,
  rightClick: HTMLElement
) => {
  // convert the regex map, e.g. /\d+\./ -> "2." to a string
  const leftMap: Map<RegExp, string> = getProvisionMap(leftClick);
  const rightMap: Map<RegExp, string> = getProvisionMap(rightClick);

  const graph: Record<string, Set<string>> = {};
  const buildGraph = _buildGraph.bind(null, graph);
  buildGraph(leftMap);
  buildGraph(rightMap);

  const first = Object.keys(graph)[0];
  const provisionText = stringifyGraph(graph, first).replaceAll(".", "");
  console.log({ provisionText });

  return provisionText;
};
