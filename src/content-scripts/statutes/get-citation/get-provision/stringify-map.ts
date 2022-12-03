/**
 * Build the provision graph, e.g. 6 -> a -> [(i),(ii)], so that we can do a dfs later to stringify the graph
 * The building of the graph is done as a side effect
 * @param graph the empty graph to fill
 * @param map the ordered dict mapping the regex to the matches found, e.g. /d+\./ -> 6.
 * @returns
 */
export const buildGraph = (
  graph: Record<string, Set<string>>,
  map: Map<RegExp, string>
): void => {
  const values = [...map.values()];
  if (values.length === 0) {
    return;
  }

  // Initialize the root of the graph
  if (values[0] in graph) {
    graph[values[0]] = new Set<string>();
  }
  let current: string;
  let prev: string = values[0];

  for (let i = 1; i < values.length; i++) {
    current = values[i];
    graph[prev].add(current);
    if (!(current in graph)) {
      graph[current] = new Set<string>();
    }
    prev = current;
  }
};

/**
 * DFS through the graph to stringify all the children nodes.
 *
 * The stringification is done during the recursive return trip
 * @param graph
 * @param current
 * @returns
 */
export const stringifyGraph = (
  graph: Record<string, Set<string>>,
  current: string,
  depth = 0
): string => {
  // base case
  if (current == null) {
    return "";
  }

  const texts: string[] = [];
  const children: Set<string> = graph[current];

  for (const node of children) {
    const text = stringifyGraph(graph, node);
    texts.push(text);
  }

  const result = current + texts.join("");
  return depth === 0 ? `s ${result}` : result;
};
