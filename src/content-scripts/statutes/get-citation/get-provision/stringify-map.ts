/**
 * Build the provision graph, e.g. 6 -> a -> [(i),(ii)], so that we can do a dfs later to stringify the graph
 * The building of the graph is done as a side effect
 * @param graph the empty graph to fill
 * @param provisionMap the ordered dict mapping the regex to the matches found, e.g. `{ /d+\./ : "6.", /\(-?\d+\)/ : "(1)" }`
 * @returns
 */
export const buildGraph = (
  graph: Record<string, Set<string>>,
  provisionMap: Map<RegExp, string>
): void => {
  const provisions = [...provisionMap.values()];
  if (provisions.length === 0) {
    return;
  }

  // Initialize the root of the graph
  if (provisions[0] in graph) {
    graph[provisions[0]] = new Set<string>();
  }
  let prev: string = provisions[0];

  console.log("begin iteration")

  for (let i = 1; i < provisions.length; i++) {
    const current = provisions[i];
    console.log({i, current});
    graph[prev].add(current);
    if (!(current in graph)) {
      graph[current] = new Set<string>();
    }
    prev = current;
  }
};

/**
 * DFS through the graph to stringify all the children nodes, to form the provision text.
 * 
 * E.g. `{ 6. -> (1) -> [(a), (b)] }` becomes s 6(1)(a)-(b).
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
    const text = stringifyGraph(graph, node, depth + 1);
    texts.push(text);
  }

  const result = current + texts.join("-");
  // if we are at the root node of the graph, we append "s"
  return depth === 0 ? `s ${result}` : result;
};
