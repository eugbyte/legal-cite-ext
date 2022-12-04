/**
 * A graph representing the way the provisions are connected,
 * e.g. `2. -> (a) -> (i)`, forms "s 2(a)(i)".
 * Purpose of this class is to stringify the provision ordered maps
 */
export class ProvisionGraph {
  /**
   * A non-disjointed graph of nodes representing the flow of the provision
   */
  private graph: Record<string, Set<string>> = {
    root: new Set<string>(),
  };

  /**
   * The value of the root node for the non-disjointed graph
   */
  private ROOT = "root";

  /**
   * Build the provision graph, e.g. 6 -> a -> [(i),(ii)], so that we can do a dfs later to stringify the graph.
   *
   * The building of the graph is done as a side effect.
   *
   * The graph is non-disjointed.
   * @param provisionMap the ordered dict mapping the regex to the matches found, e.g. `{ /d+\./ : "6.", /\(-?\d+\)/ : "(1)" }`
   * @returns
   */
  buildGraph(provisionMap: Map<RegExp, string>): void {
    const { graph, ROOT } = this;
    const provisions: string[] = [...provisionMap.values()];
    if (provisions.length === 0) {
      return;
    }

    // Creating a non-disjointed graph
    let prev = ROOT;

    for (let i = 0; i < provisions.length; i++) {
      const current: string = provisions[i];
      graph[prev].add(current);
      if (!(current in graph)) {
        graph[current] = new Set<string>();
      }
      prev = current;
    }
  }

  /**
   * DFS through the graph to stringify all the children nodes, to form the provision text.
   *
   * E.g. `{ 6. -> (1) -> [(a), (b)] }` becomes s 6(1)(a)-(b).
   *
   * The stringification is done during the recursive return trip
   * @returns
   */
  toString(): string {
    const { ROOT } = this;
    const result = this._toString(ROOT);
    return result.replace(ROOT, "s ").replaceAll(".", "");
  }

  /**
   * The recursive implementation of stringifyGraph
   * @see toString
   * @param current the current node during the recursion
   * @param depth optional, the depth of the iteration
   * @returns
   */
  private _toString(current: string, depth = 0): string {
    const { graph } = this;
    // base case
    if (current == null) {
      return "";
    }

    const texts: string[] = [];
    const children: Set<string> = graph[current];

    for (const node of children) {
      const text = this._toString(node, depth + 1);
      texts.push(text);
    }

    const result = current + texts.join("-");
    return result;
  }
}
